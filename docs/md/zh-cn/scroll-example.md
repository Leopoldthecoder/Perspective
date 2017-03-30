# 一个例子

`Scroll` 负责视差滚动效果。它允许你为 DOM 元素设置不同的 CSS 动画，并且在滚动鼠标滚轮时播放它们。

## 示例
首先来看一个例子。假如我们有如下 HTML：

```html
<div class="wrap">
  <div data-scroll-stage-id="basic">
    <p data-scroll-item-id="slow">SLOW</p>
    <p data-scroll-item-id="fast">FAST</p>
  </div>
</div>
```

暂时可以忽略上面的 `data-scroll-stage-id` 和 `data-scroll-item-id`，稍后会对它们进行说明。现在在 JavaScript 中写入以下代码：

```javascript
// 若使用 npm 引入
import { Scroll } from 'perspective.js'

// 若使用 CDN 引入
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

于是你就得到了一个带有视差滚动的页面：

<script async src="//jsfiddle.net/leopoldthecuber/tqeakbsm/embed/result/"></script>