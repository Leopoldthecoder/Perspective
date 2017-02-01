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

// 将表示颜色值的#XXX或#XXXXXX字符串转换为rgb(X,X,X)
const colorToRgb = str => {
  let colorRgb = 'rgb('
  let colorHex = str.toLowerCase()
  let i
  if (colorHex.length === 4) {
    let colorHexFull = '#'
    for (i = 1; i < 4; i++) {
      colorHexFull += colorHex.slice(i, i + 1).concat(colorHex.slice(i, i + 1))
    }
    colorHex = colorHexFull
  }
  for (i = 1; i < 4; i++) {
    colorRgb += parseInt('0x' + colorHex.slice(2 * i - 1, 2 * i + 1)).toString()
    if (i < 3) {
      colorRgb += ','
    }
  }
  colorRgb += ')'
  return colorRgb
}

export {
  getObjectFromArrById,
  colorToRgb
}