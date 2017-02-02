import walk from 'dom-walk'
import objectAssign from 'object-assign'
// import convert from 'color-convert'
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
    this.stages = []
    this.activeStageIndex = -1

    let activeStage
    const self = this
    Object.defineProperty(this, 'activeStage', {
      get: function() {
        return activeStage
      },
      set: function(value) {
        activeStage = value
        self.activeStageIndex = self.stages.findIndex(stage => stage === value)
        self.handleActiveStageChange()
      }
    })

    this.initStages()
    this.processStages()
    // TODO
    this.activeStage = this.stages[0]

    document.addEventListener('mousewheel', this.handleScroll.bind(this))
    document.addEventListener('DOMMouseScroll', this.handleScroll.bind(this))
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
    const { startAt, endAt, startNumbers, endNumbers, strings } = effect
    step = Math.max(startAt, step)
    step = Math.min(endAt, step)
    let result = strings[0]
    if (startNumbers && startNumbers.length > 0) {
      startNumbers.forEach((startNumber, index) => {
        const stepNumber = startNumber + (step - startAt) *
          (endNumbers[index] - startNumber) / (endAt - startAt)
        result += `${ stepNumber }${ strings[index + 1] }`
      })
    }
    return result
  }

  static processColorValues(effect) {
    ['start', 'end'].forEach(key => {
      console.log(is(effect[key]))
    })
  }

  setActiveStage(id, changeByScroll = false) {
    if (this.activeStage.id === id) return
    const oldIndex = this.activeStageIndex
    // if (!changeByScroll) this.activeStage.step = 0
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
    this.animating = true
    this.target.style.transform = `translateY(${ -this.activeStageIndex * 100 }%)`
    setTimeout(_ => {
      this.animating = false
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
      this.animating = true
      stageConfig.items.forEach(item => {
        item.node.style.transition = needTransition
          ? `${ stageConfig.transition }ms ${ stageConfig.easing }`
          : 'none'
        item.effects.forEach(effect => {
          item.node.style[effect.property] = this.constructor.getCurrentStyleValue(effect, step)
        })
      })
      setTimeout(_ => {
        this.animating = false
      }, Number(stageConfig.transition))
    }
  }

  handleScroll(event) {
    if (this.animating) return

    const wheelDirection = event.wheelDelta ? event.wheelDelta : -event.detail
    this.activeStage.step += wheelDirection < 0 ? 1 : -1

    window.requestAnimationFrame(this.handleStepChange.bind(this))
  }
}
export default Scroll
