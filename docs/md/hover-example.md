# An example
`Hover` manages parallax tilting. Just like Scroll, let's begin with an example.

## Example
Say we have the following markup:
```HTML
<div id="wrap">
  <section data-hover-layer="0"></section>
  <p data-hover-layer="1">Perspective.js</p>
</div>
```
And in the script:
```javascript
// using npm
import { Hover } from 'perspective.js'

// using CDN
const Hover = perspective.Hover

new Hover('#wrap', {
  max: 40,
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

Finally we get:
<script async src="//jsfiddle.net/j0scdvsb/embed/result/"></script>