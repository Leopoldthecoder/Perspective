import perspective from '../src/index'
import hoverConfig from './hover.json'
var imgs = ['http://7xiryd.com1.z0.glb.clouddn.com/perspective_universe-background.jpg', 'http://7xiryd.com1.z0.glb.clouddn.com/perspective_planet_1.png', 'http://7xiryd.com1.z0.glb.clouddn.com/perspective_planet_2.png', 'http://7xiryd.com1.z0.glb.clouddn.com/perspective_cube_1.png', 'http://7xiryd.com1.z0.glb.clouddn.com/perspective_cube_2.png', 'http://7xiryd.com1.z0.glb.clouddn.com/perspective_cube_3.png', 'http://7xiryd.com1.z0.glb.clouddn.com/perspective_cube_4.png', 'http://7xiryd.com1.z0.glb.clouddn.com/perspective_cube_5.png', 'http://7xiryd.com1.z0.glb.clouddn.com/perspective_wood.jpg', 'http://7xiryd.com1.z0.glb.clouddn.com/perspective_sky.jpg']
var iLength = imgs.length
var inst = document.getElementsByClassName('inst')[0]
var imgsOnload = function() {
  imgs.pop()
  inst.innerHTML = Math.ceil((1 - imgs.length / iLength) * 100) + '%'
  if (imgs.length === 0) {
    start()
  }
}
for (var s in imgs) {
  var img = new Image()
  img.onload = imgsOnload
  img.src = imgs[s]
}

function start() {
  setTimeout(function() {
    inst.style.opacity = 0
    setTimeout(function() {
      inst.style.opacity = 1
      inst.style.transform = 'rotate(90deg)'
      inst.style.textShadow = 'none'
      inst.style.fontSize = '60px'
      inst.style.fontFamily = 'arial'
      inst.style.bottom = '10px'
      inst.className += ' flash'
      inst.innerHTML = '>'
    }, 400)
  }, 300)
  var cssArr1 = [['transform', 'translateY(0px)', '-100'], ['transform', 'translateY(0px)', '-180'], ['transform', 'translateY(0px)', '-700']]
  var cssArr2 = [['backgroundImage', 'url(\'http://7xiryd.com1.z0.glb.clouddn.com/perspective_cube_1.png\')', 'url(\'http://7xiryd.com1.z0.glb.clouddn.com/perspective_cube_5.png\')']]
  var cssArr3 = [[], ['opacity', '0', '0.9', 'transform', 'translateY(0px)', '-50']]
  var cssArr4 = [['width', '100px', '200', 'backgroundColor', '#fd0', '#0f0'], [], ['color', '#fd0', '#0f0']]
  var cssArr5 = [['transform', 'rotateX(0deg)', '288']]
  var cssArr6 = []
  perspective.scroll(cssArr1, cssArr2, cssArr3, cssArr4, cssArr5, cssArr6, [0, 0.5, 2, 3, 0.5, 0])
  perspective.hover('#container6', hoverConfig)
  function removeInst() {
    inst.style.opacity = 0
    setTimeout(function() {
      inst.style.display = 'none'
    }, 400)
    window.removeEventListener('mousewheel', removeInst, false)
    window.removeEventListener('DOMMouseScroll', removeInst, false)
  }
  window.addEventListener('mousewheel', removeInst, false)
  window.addEventListener('DOMMouseScroll', removeInst, false)
}
