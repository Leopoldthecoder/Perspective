/**
 * Hover — applies a 3D tilt + parallax layer translation effect to an element
 * when the user moves their mouse over it.
 *
 * Mark child elements with `data-hover-layer="<index>"` to make them translate
 * independently based on the layer config's `multiple` factor.
 */

import { merge, walkDOM } from './utils'

export interface HoverLayerConfig {
  multiple: number
  reverseTranslate?: boolean
}

export interface HoverConfig {
  layers: HoverLayerConfig[]
  max?: number
  reverseTilt?: boolean
  perspective?: number
  easing?: string
  scale?: number
  speed?: number
  disabledAxis?: '' | 'x' | 'y'
  reset?: boolean
}

interface ResolvedHoverConfig {
  layers: HoverLayerConfig[]
  max: number
  reverseTilt: boolean
  perspective: number
  easing: string
  scale: number
  speed: number
  disabledAxis: '' | 'x' | 'y'
  reset: boolean
}

interface TransformMatrix {
  matrixArr: (string | number)[]
  translateXIndex: number
  translateYIndex: number
}

interface HoverLayer extends TransformMatrix {
  node: HTMLElement
  multiple: number
  reverseTranslate: boolean
}

const defaultConfig: ResolvedHoverConfig = {
  layers: [],
  max: 20,
  reverseTilt: false,
  perspective: 1000,
  easing: 'cubic-bezier(.03, .98, .52, .99)',
  scale: 1,
  speed: 300,
  disabledAxis: '',
  reset: true
}

class Hover {
  target: HTMLElement
  config: ResolvedHoverConfig
  layers: HoverLayer[]
  private width = 0
  private height = 0
  private left = 0
  private top = 0
  private transitionTimeout: ReturnType<typeof setTimeout> | undefined

  constructor(target: HTMLElement | string, config: HoverConfig) {
    if (typeof target === 'string') {
      target = document.querySelector(target) as HTMLElement
    }
    if (!target || target.nodeType !== 1) {
      throw new Error('Cannot find target dom to apply hover effects')
    }
    const resolvedConfig = merge({} as ResolvedHoverConfig, [defaultConfig, config as Partial<ResolvedHoverConfig>])

    this.target = target
    this.config = resolvedConfig
    this.layers = []

    walkDOM(target, node => {
      const layer = node.getAttribute('data-hover-layer')
      if (layer) {
        const configMultiple = resolvedConfig.layers[Number(layer)].multiple
        if (!configMultiple) throw new Error(`Missing translate config for ${ layer }`)
        this.layers.push(merge({
          node: node as HTMLElement,
          multiple: configMultiple === undefined ? 0.2 : configMultiple,
          reverseTranslate: !!resolvedConfig.layers[Number(layer)].reverseTranslate
        } as HoverLayer, [Hover.getInitialTransformMatrix(node as HTMLElement)]) as unknown as HoverLayer)
      }
    })
    this.target.style.transform = `perspective(${ this.config.perspective }px)`
    this.addEventHandlers()
  }

  /**
   * Read the current CSS transform matrix from the element's computed style.
   * Supports both 2D `matrix()` (6 values, translate at indices 4,5)
   * and 3D `matrix3d()` (16 values, translate at indices 12,13).
   */
  static getInitialTransformMatrix(node: HTMLElement): TransformMatrix {
    const matrixMatch = (window.getComputedStyle(node).transform).match(/matrix.*\((.*)\)/)
    let matrixArr: (string | number)[] = [1, 0, 0, 1, 0, 0]
    let translateXIndex = 4
    let translateYIndex = 5
    if (matrixMatch && matrixMatch[1]) {
      matrixArr = matrixMatch[1].split(/\s*,\s*/)
    }
    if (matrixArr.length === 16) {
      translateXIndex = 12
      translateYIndex = 13
    }
    return {
      matrixArr,
      translateXIndex,
      translateYIndex
    }
  }

  addEventHandlers() {
    this.target.addEventListener('mouseenter', this.onMouseEnter.bind(this))
    this.target.addEventListener('mousemove', this.onMouseMove.bind(this))
    this.target.addEventListener('mouseleave', this.onMouseLeave.bind(this))
  }

  /** Apply a translation offset to a layer by modifying its CSS transform matrix. */
  doTranslate(layer: HoverLayer, offsetX: number, offsetY: number) {
    const { node, matrixArr, translateXIndex, translateYIndex } = layer
    const matrixArrCopy = matrixArr.slice()
    matrixArrCopy[translateXIndex] = Number(matrixArrCopy[translateXIndex]) + offsetX
    matrixArrCopy[translateYIndex] = Number(matrixArrCopy[translateYIndex]) + offsetY
    const matrix = matrixArrCopy.join(', ')
    node.style.transform = `${ matrixArr.length === 6 ? 'matrix' : 'matrix3d' }(${ matrix })`
  }

  translateLayers(layer: HoverLayer, x: number, y: number) {
    const { multiple, reverseTranslate } = layer
    const offsetX = Math.floor(multiple * (0.5 * document.body.clientWidth + (reverseTranslate ? -1 : 1) * x))
    const offsetY = Math.floor(multiple * (0.5 * document.body.clientHeight + (reverseTranslate ? -1 : 1) * y))
    this.doTranslate(layer, offsetX, offsetY)
  }

  /** Convert a mouse position into tilt angles (degrees) relative to the target center. */
  getValues(event: { pageX: number; pageY: number }): { tiltX: number; tiltY: number } {
    // Normalize cursor position to [0, 1] within the target bounds
    let x = (event.pageX - this.left) / this.width
    let y = (event.pageY - this.top) / this.height

    x = Math.min(Math.max(x, 0), 1)
    y = Math.min(Math.max(y, 0), 1)

    // Map [0, 1] → [-max/2, +max/2] degrees
    const tiltX = (this.config.reverseTilt ? -1 : 1) * Number((this.config.max / 2 - x * this.config.max).toFixed(2))
    const tiltY = (this.config.reverseTilt ? -1 : 1) * Number((y * this.config.max - this.config.max / 2).toFixed(2))
    return {
      tiltX,
      tiltY
    }
  }

  setTransition() {
    clearTimeout(this.transitionTimeout)
    this.target.style.transition = `${ this.config.speed }ms ${ this.config.easing }`
    this.transitionTimeout = setTimeout(() => {
      this.target.style.transition = ''
    }, this.config.speed)
  }

  onMouseEnter(event: MouseEvent) {
    this.width = this.target.offsetWidth
    this.height = this.target.offsetHeight
    this.left = this.target.offsetLeft
    this.top = this.target.offsetTop
    this.setTransition()

    this.layers.forEach(layer => {
      layer.node.style.transition = `${ this.config.speed }ms ${ this.config.easing }`
      this.translateLayers(layer, event.clientX, event.clientY)
    })
    setTimeout(() => {
      this.layers.forEach(({ node }) => {
        node.style.transition = 'none'
      })
    }, this.config.speed)
  }

  onMouseMove(event: MouseEvent) {
    const values = this.getValues(event)
    this.target.style.transform = `
      perspective(${ this.config.perspective }px)
      rotateX(${ this.config.disabledAxis === 'x' ? 0 : values.tiltY }deg)
      rotateY(${ this.config.disabledAxis === 'y' ? 0 : values.tiltX }deg)
      scale3d(${ this.config.scale }, ${ this.config.scale }, ${ this.config.scale })
    `
    window.requestAnimationFrame(() => {
      this.layers.forEach(layer => {
        this.translateLayers(layer, event.clientX, event.clientY)
      })
    })
  }

  /** Reset tilt and layer translations back to the neutral position. */
  onMouseLeave() {
    if (this.config.reset !== true) return

    this.setTransition()
    this.target.style.transform = `
      perspective(${ this.config.perspective }px)
      rotateX(0deg)
      rotateY(0deg)
      scale3d(1, 1, 1)
    `
    this.layers.forEach(layer => {
      layer.node.style.transition = `${ this.config.speed }ms ${ this.config.easing }`
      this.doTranslate(layer, 0, 0)
    })
  }
}

export default Hover
