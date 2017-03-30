# Perspective.js

[Documentation](http://leopoldthecoder.github.io/Perspective)

[Demo](http://leopoldthecoder.github.io/Perspective/examples)

Parallax scrolling/hovering effect. And more.

## Features
A standalone Javascript library to make dashing scrolling/hovering effects. Any CSS properties with number values are supported.

## Installation
### npm
```shell
npm install perspective.js
# or
yarn add perspective.js
```

Then in your project
```javascript
import { Scroll, Hover } from 'perspective.js'
```

### CDN
```html
<script type="text/javascript" src="//unpkg.com/perspective.js/lib/perspective.js"></script>
```
Once loaded, Perspective.js will register `perspective` to the `window` object, and it has two attributes: `Scroll` and `Hover`

## Usage
### Parallax scroll
```javascript
// using npm
import { Scroll } from 'perspective.js'

// using CDN
const Scroll = perspective.Scroll

new Scroll('#wrap', {
  stages: [{
    id: 'basic',
    scrollNumber: 60,
    transition: 0,
    items: [{
      id: 'slow',
      effects: [{
        property: 'transform',
        start: 'translateY(0px)',
        end: 'translateY(-50px)'
      }]
    }, {
      id: 'fast',
      effects: [{
        property: 'transform',
        start: 'translateY(0px)',
        end: 'translateY(-180px)'
      }]
    }]
  }]
})
```

### Parallax translate
```javascript
// using npm
import { Hover } from 'perspective.js'

// using CDN
const Hover = perspective.Hover

new Hover('#wrap', {
  max: 0,
  scale: 1.1,
  perspective: 500,
  layers: [{
    multiple: 0.1,
    reverseTranslate: true
  }, {
    multiple: 0.3,
    reverseTranslate: true
  }]
})
```

### Parallax tilt
```javascript
// using npm
import { Hover } from 'perspective.js'

// using CDN
const Hover = perspective.Hover

new Hover('#wrap', {
  max: 400,
  scale: 1.1,
  perspective: 500
})
```

## Roadmap
- Mobile support

## Inspirations
- [skrollr](https://github.com/Prinzhorn/skrollr)
- [pressels.com](http://pressels.com/)
- [Tilt.js](https://github.com/gijsroge/tilt.js) and [vanilla-tilt.js](https://github.com/micku7zu/vanilla-tilt.js)

## License
MIT