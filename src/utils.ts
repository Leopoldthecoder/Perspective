export type ColorFormat = 'hsl' | 'hex'

/** Find an object in an array by its `id` property, or throw if not found. */
export const getObjectFromArrById = <T extends { id: string }>(arr: T[], id: string): T => {
  let result: T | undefined
  for (let i = 0, len = arr.length; i < len; i++) {
    const value = arr[i]
    if (value.id === id) {
      result = value
      break
    }
  }
  if (!result) {
    throw new Error(`Cannot find ${ id } id in ${ JSON.stringify(arr) }`)
  } else {
    return result
  }
}

/** Detect the color format of a CSS color string. Returns 'hsl', 'hex', or undefined. */
export const is = (color: string): ColorFormat | undefined => {
  const formats: Record<ColorFormat, RegExp> = {
    hsl: /^hsla?\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*(,\s*[\d.]+)?\s*\)$/,
    hex: /^#[a-f0-9]{3}([a-f0-9]{3})?$/i
  }
  for (const format in formats) {
    if (formats[format as ColorFormat].test(color)) {
      return format as ColorFormat
    }
  }
}

/** Shallow-merge properties from multiple source objects into the target. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const merge = <T>(target: T, sources: Array<any>): T => {
  for (let i = 0, j = sources.length; i < j; i++) {
    const source = sources[i] || {}
    for (const prop in source) {
      if (Object.prototype.hasOwnProperty.call(source, prop)) {
        const value = source[prop]
        if (value !== undefined) {
          (target as Record<string, unknown>)[prop] = value
        }
      }
    }
  }
  return target
}

/** Walk all element nodes under `root` (inclusive) using a TreeWalker. */
export const walkDOM = (root: Node, callback: (node: Element) => void) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT)
  if (root.nodeType === Node.ELEMENT_NODE) {
    callback(root as Element)
  }
  let node: Node | null
  while ((node = walker.nextNode())) {
    callback(node as Element)
  }
}

/**
 * Throttle a function call.
 *
 * - Default mode (`debounceMode` omitted): classic throttle — executes immediately
 *   when `delay` has elapsed, with an optional trailing call.
 * - `debounceMode = true`: executes on the leading edge, then ignores calls until
 *   `delay` ms of inactivity.
 * - `noTrailing = true`: suppress the trailing-edge invocation.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const throttle = <T extends (...args: any[]) => void>(
  delay: number,
  noTrailing: boolean,
  callback: T,
  debounceMode?: boolean
): ((...args: Parameters<T>) => void) => {
  let timeoutID: ReturnType<typeof setTimeout> | undefined
  let lastExec = 0

  return function wrapper(this: unknown, ...args: Parameters<T>) {
    const elapsed = Date.now() - lastExec

    const exec = () => {
      lastExec = Date.now()
      callback.apply(this, args)
    }

    // Leading-edge execution in debounce mode
    if (debounceMode && !timeoutID) {
      exec()
    }

    if (timeoutID) {
      clearTimeout(timeoutID)
    }

    if (debounceMode === undefined && elapsed > delay) {
      // Enough time has passed — execute immediately (throttle mode)
      exec()
    } else if (noTrailing !== true) {
      // Schedule a trailing call (or reset the debounce timer)
      timeoutID = setTimeout(
        debounceMode ? () => { timeoutID = undefined } : exec,
        debounceMode === undefined ? delay - elapsed : delay
      )
    }
  }
}

/** Convert a hex color string (e.g. "#ff0" or "#ff00ff") to an [R, G, B] tuple. */
export const hexToRgb = (hex: string): [number, number, number] => {
  let h = hex.replace(/^#/, '')
  // Expand shorthand (#abc → #aabbcc)
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  }
  const num = parseInt(h, 16)
  // Extract RGB components using bitwise operations
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}

/**
 * Convert an [H, S, L] tuple (H: 0-360, S: 0-100, L: 0-100) to [R, G, B].
 * Uses the standard HSL-to-RGB algorithm with a piecewise hue-to-channel helper.
 */
export const hslToRgb = (hsl: [number, number, number]): [number, number, number] => {
  const h = hsl[0] / 360
  const s = hsl[1] / 100
  const l = hsl[2] / 100

  // Achromatic (grey) — no saturation
  if (s === 0) {
    const v = Math.round(l * 255)
    return [v, v, v]
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const result: [number, number, number] = [0, 0, 0]
  for (let i = 0; i < 3; i++) {
    // Offset hue by 1/3 for each channel: R=+1/3, G=0, B=-1/3
    let t = h + (1 / 3) * -(i - 1)
    if (t < 0) t++
    if (t > 1) t--
    if (6 * t < 1) result[i] = p + (q - p) * 6 * t
    else if (2 * t < 1) result[i] = q
    else if (3 * t < 2) result[i] = p + (q - p) * (2 / 3 - t) * 6
    else result[i] = p
    result[i] = Math.round(result[i] * 255)
  }
  return result
}
