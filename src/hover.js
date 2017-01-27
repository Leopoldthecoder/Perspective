import objectAssign from 'object-assign'
import walk from 'dom-walk'
const defaultConfig = {
  homing: true,
  layers: []
}

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
    const layer = node.dataset.hoverLayer
    if (layer) {
      const configSpeed = config.layers[Number(layer)].speed
      layers.push({
        node,
        speed: configSpeed === undefined ? 0.2 : configSpeed,
        reverse: !!config.layers[Number(layer)].reverse
      })
    }
  })

  target.addEventListener('mousemove', event => {
    layers.forEach(({ node, speed, reverse }) => {
      const offsetX = Math.floor(speed * (0.5 * document.body.clientWidth + (reverse ? 1 : -1) * event.clientX))
      const offsetY = Math.floor(speed * (0.5 * document.body.clientHeight + (reverse ? 1 : -1) * event.clientY))
      ;['webkitTransform', 'msTransform', 'transform'].forEach(key => {
        node.style[key] = `translate(${ offsetX }px, ${ offsetY }px)`
      })
    })
  })
}
