/**
 * Scroll — hijacks the mouse wheel to drive step-based CSS property animations
 * across one or more "stages". Each stage contains items whose CSS properties
 * are interpolated between start/end values as the user scrolls.
 *
 * Mark stage containers with `data-scroll-stage-id` and individual items
 * with `data-scroll-item-id` to bind them to the config.
 */

import { getObjectFromArrById, is, merge, walkDOM, throttle, hexToRgb, hslToRgb } from './utils'

export interface ScrollEffect {
  property: string
  start: string
  end: string
  startAt?: number
  endAt?: number
}

export interface ScrollItemConfig {
  id: string
  effects: ScrollEffect[]
  node?: HTMLElement
}

export interface ScrollStageConfig {
  id: string
  scrollNumber?: number
  transition?: number
  easing?: string
  items: ScrollItemConfig[]
}

export interface ScrollConfig {
  stageSwitchTransition?: number
  stageSwitchDelay?: number
  stageSwitchEasing?: string
  disableAfterSwitching?: number
  stages: ScrollStageConfig[]
}

interface ResolvedScrollConfig {
  stageSwitchTransition: number
  stageSwitchDelay: number
  stageSwitchEasing: string
  disableAfterSwitching: number
  stages: ScrollStageConfig[]
}

interface ResolvedStageConfig {
  id: string
  scrollNumber: number
  transition: number
  easing: string
  items: ResolvedItemConfig[]
}

interface ResolvedItemConfig {
  id: string
  effects: ProcessedEffect[]
  node: HTMLElement
}

/** Internal representation after parsing start/end values into numeric + string parts for interpolation. */
interface ProcessedEffect extends ScrollEffect {
  startNumbers: number[]
  endNumbers: number[]
  strings: string[]
  isColor?: boolean
}

interface Stage {
  node: HTMLElement
  stageConfig: ResolvedStageConfig
  id: string
  step: number
}

const defaultConfig: ResolvedScrollConfig = {
  stageSwitchTransition: 800,
  stageSwitchDelay: 0,
  stageSwitchEasing: 'cubic-bezier(.86, 0, .07, 1)',
  disableAfterSwitching: 500,
  stages: []
}
const defaultStageConfig = {
  scrollNumber: 1,
  transition: 200,
  easing: 'ease',
  items: [] as ScrollItemConfig[]
}
const numberRegExp = /-?\d+(?:\.\d+)?/g

class Scroll {
  target: HTMLElement
  config: ResolvedScrollConfig
  animating = false
  switching = false
  stages: Stage[] = []
  activeStageIndex = 0
  activeStage!: Stage
  boundHandleScroll!: (event: WheelEvent) => void
  throttledHandleStepChange!: (...args: Parameters<Scroll['handleStepChange']>) => void
  private switchingTimeout: ReturnType<typeof setTimeout> | undefined
  private animatingTimeout: ReturnType<typeof setTimeout> | undefined

  constructor(target: HTMLElement | string, config: ScrollConfig) {
    if (typeof target === 'string') {
      target = document.querySelector(target) as HTMLElement
    }
    if (!target || target.nodeType !== 1) {
      throw new Error('Cannot find target dom to apply scroll effects')
    }
    const resolvedConfig = merge({} as ResolvedScrollConfig, [defaultConfig, config as Partial<ResolvedScrollConfig>])
    target.style.overflow = 'hidden'

    this.target = target
    this.config = resolvedConfig

    this.initStages()
    this.processStages()
    this.defineActiveStage()
    this.addEventListeners()
  }

  /**
   * Make `activeStage` reactive: when assigned a new stage, automatically
   * trigger stage-switch animation and dispatch a 'stage-change' event.
   */
  defineActiveStage() {
    let activeStage = this.stages[this.activeStageIndex]
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    Object.defineProperty(this, 'activeStage', {
      get() {
        return activeStage
      },
      set(value: Stage) {
        if (value === activeStage) return
        const oldId = activeStage.id
        const oldNode = activeStage.node
        const oldConfig = activeStage.stageConfig
        const oldStep = activeStage.step
        activeStage = value
        self.activeStageIndex = self.stages.findIndex(stage => stage === value)
        self.handleActiveStageChange()
        self.target.dispatchEvent(new CustomEvent('stage-change', {
          detail: {
            previous: {
              id: oldId,
              node: oldNode,
              config: oldConfig,
              step: oldStep
            },
            current: {
              id: value.id,
              node: value.node,
              config: value.stageConfig
            }
          }
        }))
      }
    })
  }

  addEventListeners() {
    this.boundHandleScroll = this.handleScroll.bind(this)
    this.throttledHandleStepChange = throttle(50, true, this.handleStepChange, true)
    document.addEventListener('wheel', this.boundHandleScroll, { passive: false })
  }

  removeEventListeners() {
    document.removeEventListener('wheel', this.boundHandleScroll)
  }

  /** Discover stage elements in the DOM and pair them with their config. */
  initStages() {
    walkDOM(this.target, node => {
      const stageId = node.getAttribute('data-scroll-stage-id')
      if (stageId) {
        const stageConfig = getObjectFromArrById(this.config.stages, stageId)
        if (!stageConfig) {
          throw new Error(`
            Missing scrolling config for stage id: ${ stageId }
          `)
        }
        ;(node as HTMLElement).style.transition = `
          ${ this.config.stageSwitchTransition }ms ${ this.config.stageSwitchEasing } ${ this.config.stageSwitchDelay }ms
        `
        this.stages.push({
          node: node as HTMLElement,
          stageConfig: merge({} as ResolvedStageConfig, [defaultStageConfig as unknown as Partial<ResolvedStageConfig>, stageConfig as unknown as Partial<ResolvedStageConfig>]),
          id: stageId,
          step: 0
        })
      }
    })
  }

  processStages() {
    this.stages.forEach(stage => {
      Scroll.attachNodeToItems(stage)
      this.processItemEffects(stage)
    })
  }

  /** Walk a stage's DOM to find items by `data-scroll-item-id` and attach the node reference. */
  static attachNodeToItems(stage: Stage) {
    walkDOM(stage.node, node => {
      const itemId = node.getAttribute('data-scroll-item-id')
      if (itemId) {
        const itemConfig = getObjectFromArrById(stage.stageConfig.items, itemId)
        if (!itemConfig) throw new Error(`Missing scrolling config for item id: ${ itemId }`)
        itemConfig.node = node as HTMLElement
      }
    })
  }

  /**
   * Pre-process each effect's start/end values: normalize colors to RGB,
   * then split into numeric parts (for interpolation) and string parts (template).
   * e.g. "translateX(100px)" → numbers: [100], strings: ["translateX(", "px)"]
   */
  processItemEffects(stage: Stage) {
    stage.stageConfig.items.forEach(item => {
      item.effects.forEach(effect => {
        const processed = effect as ProcessedEffect
        if (processed.startAt === undefined) processed.startAt = 0
        if (processed.endAt === undefined) processed.endAt = Number(stage.stageConfig.scrollNumber)
        Scroll.processColorValues(processed)
        processed.startNumbers = (processed.start.match(numberRegExp) || []).map(n => Number(n))
        processed.endNumbers = (processed.end.match(numberRegExp) || []).map(n => Number(n))
        processed.strings = processed.start.split(numberRegExp)
      })
    })
  }

  /** Linearly interpolate between start and end values at the given step, producing a CSS value string. */
  static getCurrentStyleValue(effect: ProcessedEffect, step: number): string {
    const { startAt, endAt, startNumbers, endNumbers, strings, isColor } = effect
    // Clamp step to the effect's active range
    step = Math.min(endAt!, Math.max(startAt!, step))
    let result = strings[0]
    let alphaIndex = -1
    if (startNumbers && startNumbers.length > 0) {
      startNumbers.forEach((startNumber, index) => {
        if ((/rgba/).test(strings[index])) alphaIndex = index + 3
        let stepNumber = startNumber + (step - startAt!) *
          (endNumbers[index] - startNumber) / (endAt! - startAt!)
        if (isColor && index !== alphaIndex) stepNumber = Math.round(stepNumber)
        result += `${ stepNumber }${ strings[index + 1] }`
      })
    }
    return result
  }

  /** Convert hex/HSL color values in an effect to RGB so they can be numerically interpolated. */
  static processColorValues(effect: ProcessedEffect) {
    (['start', 'end'] as const).forEach(key => {
      let effectValue = effect[key]
      const effectFormat = is(effectValue)
      if (!effectFormat) return
      effect.isColor = true
      if (effectFormat === 'hex') {
        effectValue = `
          rgb(${ hexToRgb(effectValue).join(',') })
        `
      } else if (effectFormat === 'hsl') {
        const [hue, saturation, lightness, alpha] =
          effectValue
            .match(/hsla?\((.*)\)/)![1]
            .split(/\s*,\s*/)
            .map(value => parseFloat(value))
        effectValue = `
          rgba(${ hslToRgb([hue, saturation, lightness]).join(',') }, ${ alpha === undefined ? 1 : alpha })
        `
      }
      effect[key] = effectValue
    })
  }

  setActiveStage(id: string, changeByScroll = false) {
    if (this.activeStage.id === id) return
    const oldIndex = this.activeStageIndex
    this.activeStage.step = 0
    const newStage = getObjectFromArrById(this.stages, id) || this.stages[0]
    const newIndex = this.stages.findIndex(stage => stage === newStage)
    if (changeByScroll) {
      newStage.step = oldIndex < newIndex
        ? 0
        : Number(newStage.stageConfig.scrollNumber)
      this.activeStage = newStage
      this.handleStepChange(false, false)
    } else {
      this.activeStage = newStage
      this.handleStepChange(false, false)
    }
  }

  /** Slide all stages vertically to bring the new active stage into view. */
  handleActiveStageChange() {
    clearTimeout(this.switchingTimeout)
    this.switching = true
    this.stages.forEach(stage => {
      stage.node.style.transform = `translateY(${ -this.activeStageIndex * 100 }%)`
    })
    this.switchingTimeout = setTimeout(() => {
      this.switching = false
    }, Number(this.config.stageSwitchTransition) + Number(this.config.disableAfterSwitching))
  }

  setStep(step: number) {
    const type = typeof step
    if (type !== 'number') throw new Error(`step should be a number, got ${ type }`)
    if (step < 0 || step > Number(this.activeStage.stageConfig.scrollNumber)) {
      throw new Error(`
        step should be within [0, ${ this.activeStage.stageConfig.scrollNumber }], got ${ step }
      `)
    }
    if (this.activeStage.step === step) return
    this.activeStage.step = step
    this.handleStepChange()
  }

  getActiveStage(): Stage {
    return this.activeStage
  }

  getStep(): number {
    return this.activeStage.step
  }

  /**
   * Core animation driver. Applies interpolated CSS values for the current step.
   * If the step overflows beyond [0, scrollNumber], switches to the adjacent stage.
   */
  handleStepChange(needTransition = true, dispatchEvent = true) {
    const step = this.activeStage.step
    const stageConfig = this.activeStage.stageConfig
    const activeIndex = this.activeStageIndex

    // Step overflows forward — switch to next stage or emit 'scroll-out'
    if (step > Number(stageConfig.scrollNumber)) {
      if (activeIndex === this.stages.length - 1) {
        this.target.dispatchEvent(new CustomEvent('scroll-out', {
          detail: { direction: 'bottom' }
        }))
        this.activeStage.step = Number(stageConfig.scrollNumber)
        return
      }
      this.setActiveStage(this.stages[activeIndex + 1].id, true)
    // Step overflows backward — switch to previous stage or emit 'scroll-out'
    } else if (step < 0) {
      if (activeIndex === 0) {
        this.target.dispatchEvent(new CustomEvent('scroll-out', {
          detail: { direction: 'top' }
        }))
        this.activeStage.step = 0
        return
      }
      this.setActiveStage(this.stages[activeIndex - 1].id, true)
    } else {
      clearTimeout(this.animatingTimeout)
      this.animating = true
      stageConfig.items.forEach(item => {
        item.node.style.transition = needTransition
          ? `${ stageConfig.transition }ms ${ stageConfig.easing }`
          : 'none'
        item.effects.forEach(effect => {
          ;(item.node.style as unknown as Record<string, string>)[effect.property] = Scroll.getCurrentStyleValue(effect, step)
        })
      })

      if (dispatchEvent) {
        this.target.dispatchEvent(new CustomEvent('step-change', {
          detail: {
            activeStage: {
              id: this.activeStage.id,
              node: this.activeStage.node,
              config: stageConfig
            },
            current: step
          }
        }))
      }

      this.animatingTimeout = setTimeout(() => {
        this.animating = false
      }, needTransition ? Number(stageConfig.transition) : 0)
    }
  }

  /** Wheel event handler — increments/decrements the step counter based on scroll direction. */
  handleScroll(event: WheelEvent) {
    event.preventDefault()
    if (this.animating || this.switching) return

    this.activeStage.step += event.deltaY > 0 ? 1 : -1
    this.throttledHandleStepChange()
  }

  destroy() {
    this.removeEventListeners()
  }

  restore() {
    this.addEventListeners()
  }
}
export default Scroll
