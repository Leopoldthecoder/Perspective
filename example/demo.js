import { PerspectiveScroll } from '../src/index'
import scrollConfig from './scroll.json'

function start() {
  const scroll = new PerspectiveScroll('#wrap', scrollConfig)
  setTimeout(_ => {
    scroll.setActiveStage('image')
  }, 2000)
}

window.onload = start
