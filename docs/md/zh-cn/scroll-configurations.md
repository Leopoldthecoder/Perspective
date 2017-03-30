# 配置项

在前一节中，我们用以下代码定义了视差滚动：
```javascript
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

你也许已经看出来了，我们创建了一个 Scroll 实例。它接收了两个参数：字符串 `.wrap` 和一个对象。第一个参数告诉 Scroll 需要在哪个 DOM 元素上执行视差滚动，它可以是一个 DOM 节点，也可以是一个字符串。如果是一个字符串，Scroll 会以其为参数调用 `document.querySelector` 以获得相应的 DOM 节点。

第二个参数是一个配置对象，你可以通过它定义视差滚动的各种行为。支持的配置项如下：

## stages
- 类型：`Object[]`
- 默认值：`[]`

舞台（stage）是 Scroll 的一个重要概念。以这个[demo](https://perspective.js.org/examples/)为例，显然它由四部分组成：第一部分是 'Good Old Parallax Effect'，第二部分是 'Charge Batteries'，第三部分是 'Draw a Joystick'，第四部分是 'Rotate the Sentence'。每一部分就是一个舞台 `stage`。

在上面的代码中，配置项中 `stages` 的值为一个对象数组，这个数组中的每个对象都对应一个舞台，并且定义了这个舞台的行为。一个舞台可以拥有任意多个参与动画的 DOM 节点（我们称之为 `item` ），每个 `item` 的行为都被定义在了 `items` 数组中。舞台有以下字段：

### id
- 类型：`String`
- 默认值：`N/A`

舞台的 ID。完成一个舞台的定义后，你需要给这个舞台所对应的 DOM 节点添加一个自定义属性 `data-scroll-stage-id`，且它的值为舞台 ID。Perspective.js 会将两者绑定，并且在这个 DOM 节点上执行定义在舞台中的动画。

?> 请注意，舞台本身并不会执行动画。真正执行动画的是舞台所对应的 DOM 节点中的 `items`。

### scrollNumber
- 类型：`Number`
- 默认值：`1`

舞台的动画会持续多少次滚轮的滚动。

### transition
- 类型：`Number`
- 默认值：`200`

每一步动画持续的时间，单位为毫秒。

### easing
- 类型：`String`
- 默认值：`ease`

动画的时间函数。

### items
- 类型：`Object[]`
- 默认值：`[]`

执行动画的 `items`。每一个 `item` 对应一个 DOM 节点，这些节点会在你滚动鼠标滚轮时真正地执行动画。需要执行的动画由以下几个字段定义：

#### id
- 类型：`String`
- 默认值：`N/A`

`item` 的 ID。和舞台的 `id` 类似，你需要为 `item` 对应的 DOM 节点添加自定义属性 `data-scroll-item-id`，并将其赋值为 `item` 的 ID。Perspective.js 会遍历 DOM 树，找到 ID 对应的节点，并使其执行动画。

#### effects
- 类型：`Object[]`
- 默认值：`N/A`

CSS 动画效果。对于每一个效果（effect），你可以定义 `property`、`start`、`end`、`startAt` 和 `endAt`。前三项为必填项，后两项可选。

| 字段名 | 类型 | 默认值 | 描述 |
|------|------|---------|-------------|
| property | String | N/A | CSS 属性名 |
| start | String | N/A | 该属性的起始值 |
| end | String | N/A | 该属性的最终值 |
| startAt | Number | 0 | 从第几次滚动开始执行该属性的动画，必须大于等于 0 |
| endAt | Number | 当前舞台的 `scrollNumber` | 在第几次滚动时结束该属性的动画，必须小于等于当前舞台的 `scrollNumber` |

?> 注意：只有值为数字的 CSS 属性才支持。将 `position` 从 `static` 改变为 `fixed` 是不可能的。除此之外，关键字也不被支持，比如将 `height` 从 `100px` 变为 `auto`。

!> 虽然 CSS 中值为 `0` 的单位可以省略，但是对于 `start` 和 `end` 来说不能这样做。即：`start: 'translate(0)'` 是非法的，必须写为 `start: 'translate(0px)'`。

因为 `startAt` 和 `endAt` 的存在，并不是所有 `item` 的动画都必须是同步的，比如：

<script async src="//jsfiddle.net/leopoldthecuber/88wmq2qm/1/embed/result/"></script>

## stageSwitchTransition
- 类型：`Number`
- 默认值：`800`

舞台切换动画的持续时间，单位为毫秒。

## stageSwitchDelay
- 类型：`Number`
- 默认值：`0`

当滚动至舞台边缘（舞台的动画已播放完毕）时，等待多少毫秒才切换至下一个舞台。

## stageSwitchEasing
- 类型：`String`
- 默认值：`cubic-bezier(.86, 0, .07, 1)`

舞台切换动画的时间函数。

## disableAfterSwitching
- 类型：`Number`
- 默认值：`500`

舞台切换后，多少毫秒内不响应滚轮事件（即这段时间内滚动滚轮不会触发 `item` 的动画）。