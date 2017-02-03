const getObjectFromArrById = (arr, id) => {
  let result
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

const is = color => {
  const formats = {
    // hsl: new RegExp(/^hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*(,\s*[\d\.]+)?\s*\)$/),
    hsl: new RegExp(/^hsla?\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*(,\s*[\d\.]+)?\s*\)$/),
    hex: new RegExp(/^#[a-f0-9]{3}([a-f0-9]{3})?$/, 'i')
  }
  for (const format in formats) {
    if (formats.hasOwnProperty(format)) {
      if (formats[format].test(color)) {
        return format
      }
    }
  }
}

export {
  getObjectFromArrById,
  is
}
