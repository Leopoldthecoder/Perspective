# An example

`Scroll` is in charge of parallax scroll effects. It lets you set CSS animations on DOM elements, and play them as you scroll your mouse.

## Example
Let's start with an example. Say we have the following markup:

```html
<div class="wrap">
  <div data-scroll-stage-id="basic">
    <p data-scroll-item-id="slow">SLOW</p>
    <p data-scroll-item-id="fast">FAST</p>
  </div>
</div>
```

Just ignore `data-scroll-stage-id` and `data-scroll-item-id` for a minute, we'll come back for them later. Now if we want some parallax effects, we just need to:

```javascript
// using npm
import { Scroll } from 'perspective.js'

// using CDN
const Scroll = perspective.Scroll

new Scroll('.wrap', {
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

See this little example in motion:

<script async src="//jsfiddle.net/leopoldthecuber/tqeakbsm/embed/result/"></script>