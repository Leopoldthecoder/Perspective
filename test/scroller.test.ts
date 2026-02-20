import { describe, it, expect, beforeEach, vi } from 'vitest'
import Scroll from '../src/scroller'

// Helper to create a minimal DOM structure for Scroll
function createScrollDOM() {
  const container = document.createElement('div')
  const stage1 = document.createElement('div')
  stage1.setAttribute('data-scroll-stage-id', 'stage1')
  const item1 = document.createElement('div')
  item1.setAttribute('data-scroll-item-id', 'item1')
  stage1.appendChild(item1)
  container.appendChild(stage1)
  document.body.appendChild(container)
  return container
}

function createConfig() {
  return {
    stages: [
      {
        id: 'stage1',
        scrollNumber: 3,
        transition: 200,
        easing: 'ease',
        items: [
          {
            id: 'item1',
            effects: [
              {
                property: 'transform',
                start: 'translateX(0px)',
                end: 'translateX(100px)',
              },
            ],
          },
        ],
      },
    ],
  }
}

describe('Scroll', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('constructor', () => {
    it('should accept a DOM element as target', () => {
      const container = createScrollDOM()
      const scroll = new Scroll(container, createConfig())
      expect(scroll.target).toBe(container)
      scroll.destroy()
    })

    it('should accept a CSS selector as target', () => {
      const container = createScrollDOM()
      container.id = 'scroll-target'
      const scroll = new Scroll('#scroll-target', createConfig())
      expect(scroll.target).toBe(container)
      scroll.destroy()
    })

    it('should throw when target is not found', () => {
      expect(() => new Scroll('#nonexistent', createConfig())).toThrow(
        'Cannot find target dom'
      )
    })

    it('should throw when target is not a DOM element', () => {
      expect(() => new Scroll(null, createConfig())).toThrow(
        'Cannot find target dom'
      )
    })

    it('should set overflow hidden on target', () => {
      const container = createScrollDOM()
      const scroll = new Scroll(container, createConfig())
      expect(container.style.overflow).toBe('hidden')
      scroll.destroy()
    })

    it('should initialize with activeStageIndex 0', () => {
      const container = createScrollDOM()
      const scroll = new Scroll(container, createConfig())
      expect(scroll.activeStageIndex).toBe(0)
      scroll.destroy()
    })
  })

  describe('getCurrentStyleValue', () => {
    it('should return start value at startAt step', () => {
      const effect = {
        startAt: 0,
        endAt: 3,
        startNumbers: [0],
        endNumbers: [100],
        strings: ['translateX(', 'px)'],
        isColor: false,
      }
      expect(Scroll.getCurrentStyleValue(effect, 0)).toBe('translateX(0px)')
    })

    it('should return end value at endAt step', () => {
      const effect = {
        startAt: 0,
        endAt: 3,
        startNumbers: [0],
        endNumbers: [100],
        strings: ['translateX(', 'px)'],
        isColor: false,
      }
      expect(Scroll.getCurrentStyleValue(effect, 3)).toBe('translateX(100px)')
    })

    it('should interpolate at mid step', () => {
      const effect = {
        startAt: 0,
        endAt: 2,
        startNumbers: [0],
        endNumbers: [100],
        strings: ['translateX(', 'px)'],
        isColor: false,
      }
      expect(Scroll.getCurrentStyleValue(effect, 1)).toBe('translateX(50px)')
    })

    it('should clamp below startAt', () => {
      const effect = {
        startAt: 1,
        endAt: 3,
        startNumbers: [0],
        endNumbers: [100],
        strings: ['translateX(', 'px)'],
        isColor: false,
      }
      expect(Scroll.getCurrentStyleValue(effect, 0)).toBe('translateX(0px)')
    })

    it('should clamp above endAt', () => {
      const effect = {
        startAt: 0,
        endAt: 2,
        startNumbers: [0],
        endNumbers: [100],
        strings: ['translateX(', 'px)'],
        isColor: false,
      }
      expect(Scroll.getCurrentStyleValue(effect, 5)).toBe('translateX(100px)')
    })

    it('should round color values', () => {
      const effect = {
        startAt: 0,
        endAt: 3,
        startNumbers: [0, 0, 0],
        endNumbers: [255, 128, 64],
        strings: ['rgb(', ',', ',', ')'],
        isColor: true,
      }
      const result = Scroll.getCurrentStyleValue(effect, 1)
      expect(result).toBe('rgb(85,43,21)')
    })
  })

  describe('processColorValues', () => {
    it('should convert hex to rgb', () => {
      const effect = { start: '#ff0000', end: '#0000ff' }
      Scroll.processColorValues(effect)
      expect(effect.isColor).toBe(true)
      expect(effect.start).toContain('rgb(')
      expect(effect.start).toContain('255')
    })

    it('should convert hsl to rgba', () => {
      const effect = { start: 'hsl(0, 100%, 50%)', end: 'hsl(240, 100%, 50%)' }
      Scroll.processColorValues(effect)
      expect(effect.isColor).toBe(true)
      expect(effect.start).toContain('rgba(')
    })

    it('should preserve hsla alpha value', () => {
      const effect = { start: 'hsla(0, 100%, 50%, 0.5)', end: '#000000' }
      Scroll.processColorValues(effect)
      expect(effect.start).toContain('0.5')
    })

    it('should not modify non-color values', () => {
      const effect = { start: 'translateX(0px)', end: 'translateX(100px)' }
      Scroll.processColorValues(effect)
      expect(effect.isColor).toBeUndefined()
      expect(effect.start).toBe('translateX(0px)')
    })
  })

  describe('destroy / restore', () => {
    it('should remove and re-add event listeners', () => {
      const container = createScrollDOM()
      const scroll = new Scroll(container, createConfig())

      const removeSpy = vi.spyOn(document, 'removeEventListener')
      scroll.destroy()
      expect(removeSpy).toHaveBeenCalledWith('wheel', scroll.boundHandleScroll)

      const addSpy = vi.spyOn(document, 'addEventListener')
      scroll.restore()
      expect(addSpy).toHaveBeenCalledWith('wheel', scroll.boundHandleScroll, { passive: false })

      scroll.destroy()
      removeSpy.mockRestore()
      addSpy.mockRestore()
    })
  })

  describe('stage management', () => {
    function createMultiStageDOM() {
      const container = document.createElement('div')

      const stage1 = document.createElement('div')
      stage1.setAttribute('data-scroll-stage-id', 'stage1')
      const item1 = document.createElement('div')
      item1.setAttribute('data-scroll-item-id', 'item1')
      stage1.appendChild(item1)

      const stage2 = document.createElement('div')
      stage2.setAttribute('data-scroll-stage-id', 'stage2')
      const item2 = document.createElement('div')
      item2.setAttribute('data-scroll-item-id', 'item2')
      stage2.appendChild(item2)

      container.appendChild(stage1)
      container.appendChild(stage2)
      document.body.appendChild(container)
      return container
    }

    function createMultiStageConfig() {
      return {
        stages: [
          {
            id: 'stage1',
            scrollNumber: 2,
            items: [
              {
                id: 'item1',
                effects: [{ property: 'opacity', start: '1', end: '0' }],
              },
            ],
          },
          {
            id: 'stage2',
            scrollNumber: 2,
            items: [
              {
                id: 'item2',
                effects: [{ property: 'opacity', start: '0', end: '1' }],
              },
            ],
          },
        ],
      }
    }

    it('should initialize multiple stages', () => {
      const container = createMultiStageDOM()
      const scroll = new Scroll(container, createMultiStageConfig())
      expect(scroll.stages).toHaveLength(2)
      expect(scroll.stages[0].id).toBe('stage1')
      expect(scroll.stages[1].id).toBe('stage2')
      scroll.destroy()
    })

    it('getActiveStage should return the current active stage', () => {
      const container = createMultiStageDOM()
      const scroll = new Scroll(container, createMultiStageConfig())
      expect(scroll.getActiveStage().id).toBe('stage1')
      scroll.destroy()
    })

    it('getStep should return current step', () => {
      const container = createMultiStageDOM()
      const scroll = new Scroll(container, createMultiStageConfig())
      expect(scroll.getStep()).toBe(0)
      scroll.destroy()
    })

    it('setStep should update step and apply effects', () => {
      const container = createMultiStageDOM()
      const scroll = new Scroll(container, createMultiStageConfig())
      scroll.setStep(1)
      expect(scroll.getStep()).toBe(1)
      scroll.destroy()
    })

    it('setStep should throw for non-number', () => {
      const container = createMultiStageDOM()
      const scroll = new Scroll(container, createMultiStageConfig())
      expect(() => scroll.setStep('1')).toThrow('step should be a number')
      scroll.destroy()
    })

    it('setStep should throw for out-of-range step', () => {
      const container = createMultiStageDOM()
      const scroll = new Scroll(container, createMultiStageConfig())
      expect(() => scroll.setStep(99)).toThrow('step should be within')
      scroll.destroy()
    })
  })
})
