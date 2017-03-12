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
  const scroll = new Scroll('#wrap', scrollConfig)
  document.querySelector('#wrap').addEventListener('stage-change', event => {
    console.log(event)
  })
  setTimeout(_ => {
    scroll.setActiveStage('color')
  }, 3000)
}

window.onload = start
