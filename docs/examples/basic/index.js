import { PerspectiveScroll } from '../../../src/index'
import scrollConfig from './scroll.json'

function start() {
  new PerspectiveScroll('.wrap', scrollConfig)
}

window.onload = start
