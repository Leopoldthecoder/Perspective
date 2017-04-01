# 一个例子
`Hover` 负责视差转动和视差位移。让我们也从一个例子开始。

## 示例
有如下 HTML：
```HTML
<div id="wrap">
  <section data-hover-layer="0"></section>
  <p data-hover-layer="1">Perspective.js</p>
</div>
```
在 JS 文件中：
```javascript
// 若使用 npm 引入
import { Hover } from 'perspective.js'

// 若使用 CDN 引入
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

最终效果：
<script async src="//jsfiddle.net/leopoldthecuber/4amva0hf/3/embed/result/"></script>

这个例子展示了视差位移。视差转动和更多参数详解，请参阅下一节。