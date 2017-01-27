import objectAssign from 'object-assign'
import walk from 'dom-walk'
import throttle from 'throttle-debounce/throttle'

const defaultConfig = {
  homing: true,
  layers: []
}
let animating = false

export default function(target, config) {
  if (typeof target === 'string') {
    target = document.querySelector(target)
  }
  if (!target || target.nodeType !== 1) {
    throw new Error('Cannot find dom')
  }
  config = objectAssign({}, defaultConfig, config)
  console.log(config)

  const layers = []
  walk(target, node => {
    if (node.nodeType !== 1) return
    const layer = node.getAttribute('data-hover-layer')
    if (layer) {
      const configSpeed = config.layers[Number(layer)].speed

      let originalTranslateX = 0
      let originalTranslateY = 0
      const matrixMatch = (window.getComputedStyle(node).transform).match(/matrix\((.*)\)/)
      const matrix3dMatch = (window.getComputedStyle(node).transform).match(/matrix3d\((.*)\)/)
      if (matrixMatch && matrixMatch[1]) {
        const matrixArr = matrixMatch[1].split(/\s*\,\s*/)
        originalTranslateX = Number(matrixArr[4])
        originalTranslateY = Number(matrixArr[5])
      } else if (matrix3dMatch && matrix3dMatch[1]) {
        const matrixArr = matrix3dMatch[1].split(/\s*\,\s*/)
        originalTranslateX = Number(matrixArr[12])
        originalTranslateY = Number(matrixArr[13])
      }

      layers.push({
        node,
        speed: configSpeed === undefined ? 0.2 : configSpeed,
        reverse: !!config.layers[Number(layer)].reverse,
        originalTranslateX,
        originalTranslateY
      })
    }
  })

  const doTranslate = (node, x, y) => {
    ['webkitTransform', 'msTransform', 'transform'].forEach(key => {
      node.style[key] = `translate(${ x }px, ${ y }px)`
    })
  }

  const translateLayers = (layer, x, y) => {
    const { node, speed, reverse, originalTranslateX, originalTranslateY } = layer
    const offsetX = Math.floor(speed * (0.5 * document.body.clientWidth + (reverse ? -1 : 1) * x))
    const offsetY = Math.floor(speed * (0.5 * document.body.clientHeight + (reverse ? -1 : 1) * y))
    doTranslate(node, originalTranslateX + offsetX, originalTranslateY + offsetY)
  }

  target.addEventListener('mousemove', throttle(60, true, event => {
    if (animating) return
    layers.forEach(layer => {
      translateLayers(layer, event.clientX, event.clientY)
    })
  }))

  target.addEventListener('mouseleave', _ => {
    if (config.homing !== true) return
    layers.forEach(({ node, originalTranslateX, originalTranslateY }) => {
      node.style.transition = '0.2s'
      doTranslate(node, originalTranslateX, originalTranslateY)
    })
  })

  target.addEventListener('mouseenter', event => {
    animating = true
    layers.forEach(layer => {
      layer.node.style.transition = '0.2s'
      translateLayers(layer, event.clientX, event.clientY)
    })
    setTimeout(() => {
      animating = false
      layers.forEach(({ node }) => {
        node.style.transition = '0.1s'
      })
    }, 200)
  })
}
