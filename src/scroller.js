import walk from 'dom-walk'
import objectAssign from 'object-assign'
import convert from 'color-convert'
import throttle from 'throttle-debounce/throttle'
import { getObjectFromArrById, is } from './utils'

const defaultConfig = {
  showIndicator: true,
  indicatorPosition: 'left',
  stageSwitchTransition: 500,
  stageSwitchEasing: 'ease',
  disableAfterSwitching: 500,
  stages: []
}
const defaultStageConfig = {
  scrollNumber: 1,
  transition: 200,
  easing: 'ease',
  items: []
}
const numberRegExp = new RegExp(/-?\d+(?:\.\d+)?/, 'g')
const vendors = ['webkit', 'ms', 'moz', '']

class Scroll {
  constructor(target, config) {
    if (typeof target === 'string') {
      target = document.querySelector(target)
    }
    if (!target || target.nodeType !== 1) {
      throw new Error('Cannot find target dom to apply scroll effects')
    }
    config = objectAssign({}, defaultConfig, config)
    target.style.transition = `
      ${ config.stageSwitchTransition }ms ${ config.stageSwitchEasing }
    `

    this.target = target
    this.config = config
    this.animating = false
    this.switching = false
    this.stages = []
    this.activeStageIndex = 0

    this.initStages()
    this.processStages()

    let activeStage = this.stages[this.activeStageIndex]
    const self = this
    Object.defineProperty(this, 'activeStage', {
      get: function() {
        return activeStage
      },
      set: function(value) {
        if (value === activeStage) return
        activeStage = value
        self.activeStageIndex = self.stages.findIndex(stage => stage === value)
        self.handleActiveStageChange()
      }
    })

    this.addEventListeners()
  }

  addEventListeners() {
    this.boundHandleScroll = this.handleScroll.bind(this)
    this.throttledHandleStepChange = throttle(50, true, this.handleStepChange, true)
    document.addEventListener('mousewheel', this.boundHandleScroll)
    document.addEventListener('DOMMouseScroll', this.boundHandleScroll)
  }

  removeEventListeners() {
    document.removeEventListener('mousewheel', this.boundHandleScroll)
    document.removeEventListener('DOMMouseScroll', this.boundHandleScroll)
  }

  initStages() {
    walk(this.target, node => {
      if (node.nodeType !== 1) return
      const stageId = node.getAttribute('data-scroll-stage-id')
      if (stageId) {
        const stageConfig = getObjectFromArrById(this.config.stages, stageId)
        if (!stageConfig) {
          throw new Error(`
            Missing scrolling config for stage id: ${ stageId }
          `)
        }
        this.stages.push({
          node,
          stageConfig: objectAssign({}, defaultStageConfig, stageConfig),
          id: stageId,
          step: 0
        })
      }
    })
  }

  processStages() {
    this.stages.forEach(stage => {
      this.constructor.attachNodeToItems(stage)
      this.processItemEffects(stage)
    })
  }

  static attachNodeToItems(stage) {
    walk(stage.node, node => {
      if (node.nodeType !== 1) return
      const itemId = node.getAttribute('data-scroll-item-id')
      if (itemId) {
        const itemConfig = getObjectFromArrById(stage.stageConfig.items, itemId)
        if (!itemConfig) throw new Error(`Missing scrolling config for item id: ${ itemId }`)
        itemConfig.node = node
      }
    })
  }

  processItemEffects(stage) {
    stage.stageConfig.items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.startAt === undefined) effect.startAt = 0
        if (effect.endAt === undefined) effect.endAt = Number(stage.stageConfig.scrollNumber)
        this.constructor.processColorValues(effect)
        effect.startNumbers = (effect.start.match(numberRegExp) || []).map(item => Number(item))
        effect.endNumbers = (effect.end.match(numberRegExp) || []).map(item => Number(item))
        effect.strings = effect.start.split(numberRegExp)
      })
    })
  }

  static getCurrentStyleValue(effect, step) {
    const { startAt, endAt, startNumbers, endNumbers, strings, isColor } = effect
    step = Math.max(startAt, step)
    step = Math.min(endAt, step)
    let result = strings[0]
    let alphaIndex = -1
    if (startNumbers && startNumbers.length > 0) {
      startNumbers.forEach((startNumber, index) => {
        if ((/rgba/).test(strings[index])) alphaIndex = index + 3
        let stepNumber = startNumber + (step - startAt) *
          (endNumbers[index] - startNumber) / (endAt - startAt)
        if (isColor && index !== alphaIndex) stepNumber = Math.round(stepNumber)
        result += `${ stepNumber }${ strings[index + 1] }`
      })
    }
    return result
  }

  static processColorValues(effect) {
    ['start', 'end'].forEach(key => {
      let effectValue = effect[key]
      const effectFormat = is(effectValue)
      if (!effectFormat) return
      effect.isColor = true
      if (effectFormat === 'hex') {
        effectValue = `
          rgb(${ convert.hex.rgb(effectValue).join(',') })
        `
      } else if (effectFormat === 'hsl') {
        const [hue, saturation, lightness, alpha] =
          effectValue
          .match(/hsla?\((.*)\)/)[1]
          .split(/\s*,\s*/)
          .map(value => parseFloat(value))
        effectValue = `
          rgba(${ convert.hsl.rgb([hue, saturation, lightness]).join(',') }, ${ alpha === undefined ? 1 : alpha })
        `
      }
      effect[key] = effectValue
    })
  }

  setActiveStage(id, changeByScroll = false) {
    if (this.activeStage.id === id) return
    const oldIndex = this.activeStageIndex
    this.activeStage = getObjectFromArrById(this.stages, id) || this.stages[0]
    const newIndex = this.activeStageIndex
    if (changeByScroll) {
      this.activeStage.step = oldIndex < newIndex
        ? 0
        : Number(this.activeStage.stageConfig.scrollNumber)
      this.handleStepChange(false)
    } else {
      this.activeStage.step = 0
      this.handleStepChange(false)
    }
  }

  handleActiveStageChange() {
    clearTimeout(this.switchingTimeout)
    this.switching = true
    vendors.forEach(vendor => {
      const property = vendor.length ? `${ vendor }Transform` : 'transform'
      this.target.style[property] = `translateY(${ -this.activeStageIndex * 100 }%)`
    })
    this.switchingTimeout = setTimeout(_ => {
      this.switching = false
    }, Number(this.config.stageSwitchTransition) + Number(this.config.disableAfterSwitching))
  }

  setStep(step) {
    if (typeof step !== 'number') throw new Error(`${ step } is not a number`)
    if (step < 0 || step > Number(this.activeStage.stageConfig.scrollNumber)) {
      throw new Error(`
        ${ step } should be within [0, ${ this.activeStage.stageConfig.scrollNumber }]
      `)
    }
    this.activeStage.step = step
    this.handleStepChange()
  }

  handleStepChange(needTransition = true) {
    const step = this.activeStage.step
    const stageConfig = this.activeStage.stageConfig
    const activeIndex = this.activeStageIndex

    if (step > Number(stageConfig.scrollNumber)) {
      if (activeIndex === this.stages.length - 1) {
        this.activeStage.step = Number(stageConfig.scrollNumber)
        return
      }
      this.setActiveStage(this.stages[activeIndex + 1].id, true)
    } else if (step < 0) {
      if (activeIndex === 0) {
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
          item.node.style[effect.property] = this.constructor.getCurrentStyleValue(effect, step)
        })
      })
      this.animatingTimeout = setTimeout(_ => {
        this.animating = false
      }, needTransition ? Number(stageConfig.transition) : 0)
    }
  }

  handleScroll(event) {
    event.preventDefault()
    if (this.animating || this.switching) return

    const wheelDirection = event.wheelDelta ? event.wheelDelta : -event.detail
    this.activeStage.step += wheelDirection < 0 ? 1 : -1

    this.throttledHandleStepChange()
  }
}
export default Scroll
