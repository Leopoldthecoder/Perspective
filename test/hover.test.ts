import { describe, it, expect, beforeEach } from 'vitest'
import Hover from '../src/hover'

function createHoverDOM() {
  const container = document.createElement('div')
  container.style.width = '400px'
  container.style.height = '300px'

  const layer0 = document.createElement('div')
  layer0.setAttribute('data-hover-layer', '0')
  const layer1 = document.createElement('div')
  layer1.setAttribute('data-hover-layer', '1')

  container.appendChild(layer0)
  container.appendChild(layer1)
  document.body.appendChild(container)
  return container
}

function createConfig() {
  return {
    layers: [
      { multiple: 0.2, reverseTranslate: false },
      { multiple: 0.4, reverseTranslate: true },
    ],
    max: 20,
    perspective: 1000,
    scale: 1.05,
    speed: 300,
  }
}

describe('Hover', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('constructor', () => {
    it('should accept a DOM element as target', () => {
      const container = createHoverDOM()
      const hover = new Hover(container, createConfig())
      expect(hover.target).toBe(container)
    })

    it('should accept a CSS selector as target', () => {
      const container = createHoverDOM()
      container.id = 'hover-target'
      const hover = new Hover('#hover-target', createConfig())
      expect(hover.target).toBe(container)
    })

    it('should throw when target is not found', () => {
      expect(() => new Hover('#nonexistent', createConfig())).toThrow(
        'Cannot find target dom'
      )
    })

    it('should throw when target is null', () => {
      expect(() => new Hover(null, createConfig())).toThrow(
        'Cannot find target dom'
      )
    })

    it('should set perspective transform on target', () => {
      const container = createHoverDOM()
      const hover = new Hover(container, createConfig())
      expect(hover.target.style.transform).toContain('perspective(1000px)')
    })

    it('should collect layers from DOM', () => {
      const container = createHoverDOM()
      const hover = new Hover(container, createConfig())
      expect(hover.layers).toHaveLength(2)
    })

    it('should assign correct multiples to layers', () => {
      const container = createHoverDOM()
      const hover = new Hover(container, createConfig())
      expect(hover.layers[0].multiple).toBe(0.2)
      expect(hover.layers[1].multiple).toBe(0.4)
    })

    it('should assign reverseTranslate from config', () => {
      const container = createHoverDOM()
      const hover = new Hover(container, createConfig())
      expect(hover.layers[0].reverseTranslate).toBe(false)
      expect(hover.layers[1].reverseTranslate).toBe(true)
    })
  })

  describe('getInitialTransformMatrix', () => {
    it('should return default identity matrix when no transform is set', () => {
      const node = document.createElement('div')
      document.body.appendChild(node)
      const result = Hover.getInitialTransformMatrix(node)
      expect(result.matrixArr).toEqual([1, 0, 0, 1, 0, 0])
      expect(result.translateXIndex).toBe(4)
      expect(result.translateYIndex).toBe(5)
    })
  })

  describe('getValues', () => {
    it('should calculate tilt values from mouse position', () => {
      const container = createHoverDOM()
      const hover = new Hover(container, createConfig())

      // Simulate dimensions
      hover.width = 400
      hover.height = 300
      hover.left = 0
      hover.top = 0

      const values = hover.getValues({ pageX: 200, pageY: 150 })
      // At center: tiltX and tiltY should be ~0
      expect(Number(values.tiltX)).toBeCloseTo(0, 0)
      expect(Number(values.tiltY)).toBeCloseTo(0, 0)
    })

    it('should clamp values to [0, 1] range', () => {
      const container = createHoverDOM()
      const hover = new Hover(container, createConfig())

      hover.width = 400
      hover.height = 300
      hover.left = 0
      hover.top = 0

      // Mouse far outside the element
      const values = hover.getValues({ pageX: -1000, pageY: -1000 })
      // x=0, y=0 → tiltX = max/2 = 10, tiltY = -max/2 = -10
      expect(Number(values.tiltX)).toBeCloseTo(10, 0)
      expect(Number(values.tiltY)).toBeCloseTo(-10, 0)
    })

    it('should reverse tilt when reverseTilt is true', () => {
      const container = createHoverDOM()
      const config = createConfig()
      config.reverseTilt = true
      const hover = new Hover(container, config)

      hover.width = 400
      hover.height = 300
      hover.left = 0
      hover.top = 0

      const values = hover.getValues({ pageX: 0, pageY: 0 })
      // x=0 → tiltX = -(max/2) = -10
      expect(Number(values.tiltX)).toBeCloseTo(-10, 0)
    })
  })

  describe('default config', () => {
    it('should use default values when config is minimal', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const hover = new Hover(container, { layers: [] })
      expect(hover.config.max).toBe(20)
      expect(hover.config.perspective).toBe(1000)
      expect(hover.config.scale).toBe(1)
      expect(hover.config.speed).toBe(300)
      expect(hover.config.reset).toBe(true)
      expect(hover.config.reverseTilt).toBe(false)
    })
  })
})
