import { Scroll } from '../../src/index'
import scrollConfig from './scroll.json'

function start() {
  // const target = document.querySelector('#wrap')
  // target.addEventListener('stage-change', ({ detail }) => {
  //   console.log('stage:', detail)
  // })
  // target.addEventListener('step-change', ({ detail }) => {
  //   console.log('step:', detail)
  // })
  new Scroll('#wrap', scrollConfig)
}

window.onload = start
