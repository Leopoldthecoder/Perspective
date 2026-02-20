import { describe, it, expect } from 'vitest'
import { getObjectFromArrById, is, merge } from '../src/utils'

describe('getObjectFromArrById', () => {
  const arr = [
    { id: 'a', value: 1 },
    { id: 'b', value: 2 },
    { id: 'c', value: 3 },
  ]

  it('should find object by id', () => {
    expect(getObjectFromArrById(arr, 'b')).toEqual({ id: 'b', value: 2 })
  })

  it('should return the first match', () => {
    const duped = [...arr, { id: 'a', value: 99 }]
    expect(getObjectFromArrById(duped, 'a')).toEqual({ id: 'a', value: 1 })
  })

  it('should throw when id is not found', () => {
    expect(() => getObjectFromArrById(arr, 'z')).toThrow('Cannot find z id')
  })

  it('should throw on empty array', () => {
    expect(() => getObjectFromArrById([], 'a')).toThrow()
  })
})

describe('is', () => {
  it('should detect 6-digit hex colors', () => {
    expect(is('#ff0000')).toBe('hex')
    expect(is('#AABBCC')).toBe('hex')
  })

  it('should detect 3-digit hex colors', () => {
    expect(is('#abc')).toBe('hex')
    expect(is('#FFF')).toBe('hex')
  })

  it('should detect hsl colors', () => {
    expect(is('hsl(120, 50%, 50%)')).toBe('hsl')
  })

  it('should detect hsla colors', () => {
    expect(is('hsla(120, 50%, 50%, 0.5)')).toBe('hsl')
  })

  it('should return undefined for non-color strings', () => {
    expect(is('red')).toBeUndefined()
    expect(is('not a color')).toBeUndefined()
    expect(is('rgb(1,2,3)')).toBeUndefined()
  })

  it('should return undefined for invalid hex', () => {
    expect(is('#gggggg')).toBeUndefined()
    expect(is('#12345')).toBeUndefined()
  })
})

describe('merge', () => {
  it('should merge source properties into target', () => {
    const result = merge({}, [{ a: 1, b: 2 }])
    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('should merge multiple sources left to right', () => {
    const result = merge({}, [{ a: 1 }, { a: 2, b: 3 }])
    expect(result).toEqual({ a: 2, b: 3 })
  })

  it('should not overwrite with undefined values', () => {
    const result = merge({}, [{ a: 1 }, { a: undefined }])
    expect(result).toEqual({ a: 1 })
  })

  it('should return the target object', () => {
    const target = { x: 0 }
    const result = merge(target, [{ y: 1 }])
    expect(result).toBe(target)
  })

  it('should handle null/undefined sources gracefully', () => {
    const result = merge({}, [null, undefined, { a: 1 }])
    expect(result).toEqual({ a: 1 })
  })

  it('should overwrite existing target properties', () => {
    const result = merge({ a: 1 }, [{ a: 99 }])
    expect(result).toEqual({ a: 99 })
  })
})
