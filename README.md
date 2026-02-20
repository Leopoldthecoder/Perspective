# Perspective.js

[Documentation](https://perspective.js.org) | [Demo](https://perspective.js.org/examples/)

Parallax scrolling/hovering effect. And more.

## Features

- Parallax scroll, parallax tilt and parallax translate effects
- Any CSS properties with number values are supported
- Written in TypeScript with full type definitions
- Zero runtime dependencies

## Installation

### npm

```shell
npm install perspective.js
# or
pnpm add perspective.js
# or
yarn add perspective.js
```

Then in your project:

```typescript
import { Scroll, Hover } from 'perspective.js'
```

### CDN

```html
<script src="https://unpkg.com/perspective.js/dist/perspective.umd.js"></script>
```

Once loaded, Perspective.js will register `perspective` to the `window` object, and it has two attributes: `Scroll` and `Hover`.

## Usage

### Parallax scroll

```typescript
import { Scroll } from 'perspective.js'

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

```typescript
import { Hover } from 'perspective.js'

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

```typescript
import { Hover } from 'perspective.js'

new Hover('#wrap', {
  max: 400,
  scale: 1.1,
  perspective: 500
})
```

## Inspirations

- [skrollr](https://github.com/Prinzhorn/skrollr)
- [pressels.com](http://pressels.com/)
- [Tilt.js](https://github.com/gijsroge/tilt.js) and [vanilla-tilt.js](https://github.com/micku7zu/vanilla-tilt.js)

## License

MIT
