export default function() {
  const div = document.getElementsByTagName('div')
  const c = []
  const regNum = /-?\d+(?:\.\d+)?/g
  const regColor = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/ // cCount记录container个数
  let containers
  let inAnim = false
  let i
  let j
  let k
  for (i = 0; i < div.length; i++) {
    if (div[i].getAttribute('data-perspective') === 'scroll') {
      const stage = div[i]
      for (j = 0; j < stage.childNodes.length; j++) {
        if (stage.childNodes[j].nodeType === 1) {
          const wrap = stage.childNodes[j]
          containers = []
          for (k = 0; k < wrap.childNodes.length; k++) {
            if (wrap.childNodes[k].nodeType === 1) {
              containers.push(wrap.childNodes[k])
            }
          }
        }
      }
    }
  }
  const cCount = containers.length
  // 将表示颜色值的#XXX或#XXXXXX字符串转换为rgb(X,X,X)
  function colorToRgb(str) {
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
  for (i = 0; i < cCount; i++) {
    c[i] = {}
    c[i].target = containers[i]
    c[i].target.style.transition = '0.5s'
    c[i].sLength = parseInt(c[i].target.getAttribute('data-scroll-number') === undefined ? 1 : c[i].target.getAttribute('data-scroll-number'))
    c[i].cssArr = arguments[i] // c[i].cssArr为对应第i个容器的CSS参数数组

    // 将16进制表示的颜色值转换为RGB表示
    for (j = 0; j < c[i].cssArr.length; j++) {
      const curLength = c[i].cssArr[j].length
      for (k = 0; k < curLength; k++) {
        if (regColor.test(c[i].cssArr[j][k].toString().replace(/\s+/g, ''))) {
          c[i].cssArr[j][k] = colorToRgb(c[i].cssArr[j][k].toString().replace(/\s+/g, ''))
        }
        const pCSS = ['transform', 'animation']
        pCSS.forEach(function(value) {
          if (c[i].cssArr[j][k].toString().toLowerCase() === value) {
            const prefix = ['webkit', 'ms']
            value = value.replace(/(\w)/, function(v) { return v.toUpperCase() })
            for (let m = 0; m < prefix.length; m++) {
              c[i].cssArr[j].push(prefix[m] + value)
              c[i].cssArr[j].push(c[i].cssArr[j][k + 1])
              c[i].cssArr[j].push(c[i].cssArr[j][k + 2])
            }
          }
        })
      }
    }
    c[i].layers = []
    for (j = 0; j < c[i].target.childNodes.length; j++) {
      if (c[i].target.childNodes[j].nodeType === 1) {
        c[i].layers.push(c[i].target.childNodes[j])
      }
    }
    c[i].childCount = c[i].cssArr.length
    c[i].layers = c[i].layers.slice(0, c[i].childCount)
    c[i].sDuration = arguments[cCount] ? arguments[cCount][i] : 0.2 // 若未给出transition数组参数，则全部赋值为0.2s
    c[i].attr = []
    c[i].prop = []
    c[i].propNum = []
    c[i].propStr = []
    for (j = 0; j < c[i].childCount; j++) {
      c[i].layers[j].style.transition = c[i].sDuration + 's'
      c[i].attr[j] = [] // 第i个容器中第j个元素的CSS参数数组中属性所组成的数组
      c[i].prop[j] = [] // 第i个容器中第j个元素的CSS参数数组中值所组成的数组
      c[i].propNum[j] = [] // 值中包含的数字
      c[i].propStr[j] = [] // 值中除数字以外的字符串
      for (k = 0; k < c[i].cssArr[j].length; k++) {
        switch (k % 3) {
          case 0: {
            c[i].attr[j].push(c[i].cssArr[j][k])
            c[i].propNum[j][k / 3] = []
            c[i].propStr[j][k / 3] = []
            break
          }
          case 1: {
            c[i].propNum[j][Math.floor(k / 3)][0] = c[i].cssArr[j][k].toString().match(regNum) // 第i个容器中第j个元素的第Math.floor(k/3)个CSS名值对的初始状态
            c[i].propStr[j][Math.floor(k / 3)] = c[i].cssArr[j][k].toString().split(regNum)
            break
          }
          case 2: {
            c[i].propNum[j][Math.floor(k / 3)][1] = c[i].cssArr[j][k].toString().match(regNum)
            break
          }
        }
      }

      // 计算各中间状态的CSS属性值，写入c[i].prop[j][k]数组
      for (k = 0; k < c[i].cssArr[j].length / 3; k++) {
        c[i].delta = []
        for (let m = 0; m < c[i].propNum[j][k][0].length; m++) {
          c[i].delta[m] = (c[i].propNum[j][k][1][m] - c[i].propNum[j][k][0][m]) / c[i].sLength
        }
        c[i].prop[j][k] = []
        for (let l = 0; l <= c[i].sLength; l++) {
          if (l === 0) {
            c[i].prop[j][k][l] = c[i].cssArr[j][k * 3 + 1] // 第一个状态即为初始值
          } else {
            let n
            c[i].prop[j][k][l] = ''
            for (n = 0; n < c[i].propNum[j][k][0].length; n++) {
              if (l === c[i].sLength) {
                c[i].prop[j][k][l] += c[i].propStr[j][k][n] + c[i].propNum[j][k][1][n]
              } else {
                // 若属性为颜色，由于RGB表示里不能有小数，需将delta存为整数
                if (c[i].propStr[j][k].join('').indexOf('rgb') > -1) {
                  c[i].prop[j][k][l] += c[i].propStr[j][k][n] + Math.floor((parseFloat(c[i].propNum[j][k][0][n]) + c[i].delta[n] * l))
                } else {
                  c[i].prop[j][k][l] += c[i].propStr[j][k][n] + (parseFloat(c[i].propNum[j][k][0][n]) + c[i].delta[n] * l)
                }
              }
            }
            c[i].prop[j][k][l] += c[i].propStr[j][k][n]
          }
        }
      }
    }
  }
  // 根据每个容器的动画数，判断第几次滚动时应执行换场动画
  let sCount = 0
  const breakPoints = []
  let totalLength = 0
  for (i = 0; i < c.length - 1; i++) {
    totalLength += c[i].sLength
    breakPoints.push(totalLength + i + 1)
  }
  totalLength += c[c.length - 1].sLength + c.length - 1

  // 点击按钮时的操作
  function jumpTo(i) {
    switchContainers(i, 0)
    sCount = i ? breakPoints[i - 1] : i
    setAnim(sCount, true)
  }

  // 换场动画，同时需要对按钮进行处理
  function switchContainers(i, dir) {
    const curCon = c[i]
    const ctrl = document.getElementById('persp-controller').getElementsByTagName('li')
    inAnim = true
    if (dir === 1) {
      i++
    }
    curCon.target.parentNode.style.transition = '0.5s'
    curCon.target.parentNode.style.top = '-' + i * 100 + '%'
    setTimeout(function() {
      inAnim = false
    }, 500)
    let j
    for (j = 0; j < ctrl.length; j++) {
      (function(j) {
        const btn = ctrl[j].getElementsByTagName('div')[0]
        if (j !== i) {
          btn.style.backgroundColor = 'transparent'
          btn.onmouseover = function() {
            btn.style.backgroundColor = '#999'
            btn.parentNode.getElementsByTagName('span')[0].style.display = 'inline-block'
            btn.parentNode.getElementsByTagName('span')[0].style.opacity = '1'
          }
          btn.onmouseout = function() {
            btn.style.backgroundColor = 'transparent'
            btn.parentNode.getElementsByTagName('span')[0].style.opacity = '0'
            setTimeout(function() {
              btn.parentNode.getElementsByTagName('span')[0].style.display = 'none'
            }, 200)
          }
          btn.onclick = function() {
            jumpTo(j)
          }
        } else {
          btn.style.backgroundColor = '#999'
          btn.onmouseover = function() {
            return false
          }
          btn.onmouseout = function() {
            btn.style.backgroundColor = '#999'
            btn.parentNode.getElementsByTagName('span')[0].style.opacity = '0'
            setTimeout(function() {
              btn.parentNode.getElementsByTagName('span')[0].style.display = 'none'
            }, 200)
          }
          btn.onclick = function() {
            return false
          }
        }
      })(j)
    }
  }
  function setAnim(sCount, isSwitch) {
    let mark = 0
    let curCon = {}
    let prevCountSum = 0
    let i
    for (i = 0; i < breakPoints.length; i++) {
      if (sCount >= breakPoints[i]) {
        mark++
      }
    }
    curCon = c[mark]
    for (i = 0; i < mark; i++) {
      prevCountSum += c[i].sLength + 1
    }

    // 若未换场，则需等待目前动画结束再更新CSS属性；否则立即更新
    if (((!isSwitch) && (!inAnim)) || (isSwitch)) {
      if (!isSwitch) {
        inAnim = true
        setTimeout(function() {
          inAnim = false
        }, curCon.sDuration * 1000)
      } else {
        for (i = 0; i < curCon.childCount; i++) {
          curCon.layers[i].style.transition = '0s'
        }
      }
      for (i = 0; i < curCon.childCount; i++) {
        for (let j = 0; j < curCon.attr[i].length; j++) {
          curCon.layers[i].style[curCon.attr[i][j]] = curCon.prop[i][j][sCount - prevCountSum]
        }
      }
    }
    if (isSwitch) {
      setTimeout(function() {
        for (i = 0; i < curCon.childCount; i++) {
          curCon.layers[i].style.transition = curCon.sDuration + 's'
        }
      }, 50)
    }
  }
  function scrollFunc(e) {
    if (!inAnim) {
      const wheelDir = e.wheelDelta ? e.wheelDelta : (-e.detail)
      let switched = false
      if (((wheelDir < 0) && (sCount === totalLength)) || ((wheelDir > 0) && (sCount === 0))) {
        return false
      }
      if (wheelDir < 0) {
        sCount++
      }
      if (wheelDir > 0) {
        sCount--
      }

      // 分两种情况，执行向下和向上的换场动画
      for (let i = 0; i < breakPoints.length; i++) {
        if ((wheelDir < 0) && (sCount === breakPoints[i])) {
          switchContainers(i, 1)
          setAnim(sCount, true)
          switched = true
          break
        } else if ((wheelDir > 0) && (sCount === breakPoints[i] - 1)) {
          switchContainers(i, -1)
          setAnim(sCount, true)
          switched = true
          break
        }
      }
      if (!switched) {
        setAnim(sCount, false)
      }
    }
    return false
  }

  // 兼容Firefox
  if (document.addEventListener) {
    document.addEventListener('DOMMouseScroll', scrollFunc, false)
  }
  document.onmousewheel = scrollFunc

  // 动态生成控制按钮
  const ul = document.createElement('ul')
  ul.setAttribute('id', 'persp-controller')
  for (i = 0; i < c.length; i++) {
    const li = document.createElement('li')
    const btn = document.createElement('div')
    const span = document.createElement('span')
    li.style.listStyle = 'none'
    li.style.display = 'block'
    li.style.position = 'relative'
    btn.style.height = '8px'
    btn.style.width = '8px'
    btn.style.border = '1px solid #fff'
    btn.style.backgroundColor = 'transparent'
    btn.style.boxShadow = '0 0 1px 1px #999'
    btn.style.borderRadius = '50%'
    btn.style.margin = '16px 0'
    btn.style.transition = '0.2s'
    btn.style.cursor = 'pointer'
    span.innerHTML = c[i].target.getAttribute('data-scroll-tag')
    span.style.color = '#777'
    span.style.font = '12px arial'
    span.style.padding = '2px 10px'
    span.style.backgroundColor = 'rgba(255,255,255,0.8)'
    span.style.borderRadius = '4px'
    span.style.position = 'absolute'
    span.style.left = '15px'
    span.style.top = '-4px'
    span.style.transition = '0.2s'
    span.style.opacity = '0'
    li.appendChild(btn)
    li.appendChild(span)
    ul.appendChild(li)
  }
  ul.style.position = 'absolute'
  ul.style.left = '2%'
  ul.style.top = '50%'
  ul.style.marginTop = -1 * (13 * c.length + 8) + 'px'
  ul.style.zIndex = 1000
  c[0].target.parentNode.parentNode.appendChild(ul)

  // 初始化按钮状态
  switchContainers(0, 0)
}
