import walk from 'dom-walk'
import objectAssign from 'object-assign'
import { getObjectFromArrById } from './utils'

const defaultConfig = {
  showIndicator: true,
  indicatorPosition: 'left',
  stageSwitchTransition: 500,
  stageSwitchEasing: 'ease',
  stages: []
}
const defaultStageConfig = {
  scrollNumber: 1,
  transition: 200,
  easing: 'ease',
  items: []
}
const regNum = /-?\d+(?:\.\d+)?/g
// const regColor = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

class Scroll {
  constructor(target, config) {
    if (typeof target === 'string') {
      target = document.querySelector(target)
    }
    if (!target || target.nodeType !== 1) {
      throw new Error('Cannot find target dom to apply scroll effects')
    }
    config = objectAssign({}, defaultConfig, config)

    this.target = target
    this.config = config
    this.animating = false

    this.stages = []
    walk(target, node => {
      if (node.nodeType !== 1) return
      const stageId = node.getAttribute('data-scroll-stage-id')
      if (stageId) {
        const stageConfig = getObjectFromArrById(config.stages, stageId)
        if (!stageConfig) throw new Error(`Missing scrolling config for stage id: ${ stageId }`)
        this.stages.push({
          node,
          stageConfig: objectAssign({}, defaultStageConfig, stageConfig),
          step: 0
        })
      }
    })

    this.stages.forEach(stage => {
      stage.node.style.transition = `${ this.config.stageSwitchTransition }ms ${ this.config.stageSwitchEasing }`

      walk(stage.node, node => {
        if (node.nodeType !== 1) return
        const itemId = node.getAttribute('data-scroll-item-id')
        if (itemId) {
          const itemConfig = getObjectFromArrById(stage.stageConfig.items, itemId)
          if (!itemConfig) throw new Error(`Missing scrolling config for item id: ${ itemId }`)
          itemConfig.node = node
        }
      })

      stage.stageConfig.items.forEach(item => {
        item.effects.forEach(effect => {
          if (effect.startAt === undefined) effect.startAt = 0
          if (effect.endAt === undefined) effect.endAt = stage.stageConfig.scrollNumber
          effect.startNumbers = (effect.start.match(regNum) || []).map(item => Number(item))
          effect.endNumbers = (effect.end.match(regNum) || []).map(item => Number(item))
          effect.strings = effect.start.split(regNum)
        })
      })
    })
    console.log(this.stages)
    // TODO
    this.activeStage = this.stages[0]

    document.addEventListener('mousewheel', this.onScroll.bind(this))
    document.addEventListener('DOMMouseScroll', this.onScroll.bind(this))
  }

  static getCurrentStyleValue(effect, step) {
    const { startAt, endAt, startNumbers, endNumbers, strings } = effect
    step = Math.max(startAt, step)
    step = Math.min(endAt, step)
    let result = strings[0]
    if (startNumbers && startNumbers.length > 0) {
      startNumbers.forEach((startNumber, index) => {
        const stepNumber = startNumber + (step - startAt) * (endNumbers[index] - startNumber) / (endAt - startAt)
        result += `${ stepNumber }${ strings[index + 1] }`
      })
    }
    return result
  }

  handleStepChange() {
    const step = this.activeStage.step
    const stageConfig = this.activeStage.stageConfig
    if (step > Number(stageConfig.scrollNumber)) {
      // TODO: switch stage
      this.activeStage.step--
      setTimeout(_ => {
        this.animating = false
      }, Number(this.config.stageSwitchTransition))
    } else if (step < 0) {
      this.activeStage.step++
      // TODO: switch stage
      setTimeout(_ => {
        this.animating = false
      }, Number(this.config.stageSwitchTransition))
    } else {
      stageConfig.items.forEach(item => {
        item.node.style.transition = `${ stageConfig.transition }ms ${ stageConfig.easing }`
        item.effects.forEach(effect => {
          item.node.style[effect.property] = this.constructor.getCurrentStyleValue(effect, step)
        })
      })
      setTimeout(_ => {
        this.animating = false
      }, Number(stageConfig.transition))
    }
  }

  onScroll(event) {
    if (this.animating) return
    this.animating = true

    const wheelDirection = event.wheelDelta ? event.wheelDelta : -event.detail
    this.activeStage.step += wheelDirection < 0 ? 1 : -1

    window.requestAnimationFrame(this.handleStepChange.bind(this))
  }
}
export default function(target, config) {
  new Scroll(target, config)
}
