# 一个例子
`Hover` manages parallax tilt and parallax translate. Just like Scroll, let's begin with an example.

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

Finally we get:
<script async src="//jsfiddle.net/leopoldthecuber/4amva0hf/3/embed/result/"></script>

This is an example of parallax translate. For parallax tilt and detailed configuration, please read the next section.