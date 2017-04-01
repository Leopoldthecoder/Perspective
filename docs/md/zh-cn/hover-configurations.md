# 配置项
和 Scroll 相比，Hover 的配置要简单许多。

## max
- 类型：`Number`
- 默认值：`20`

视差转动的最大 `rotateX` 和 `rotateY`。

## reverseTilt
- 类型：`Boolean`
- 默认值：`false`

默认情况下，鼠标移动到的位置会有一个浮起的效果。若将 `reverseTilt` 设置为 `true`，它们会有一个被按下的效果。

## perspective
- 类型：`Number`
- 默认值：`1000`

初始化 Hover 时传入的 DOM 节点 CSS `transform` 属性中 `perspective` 的值。

## easing
- 类型：`String`
- 默认值：`cubic-bezier(.03, .98, .52, .99)`

初始化 Hover 时传入的 DOM 节点的动画时间函数。

## scale
- 类型：`Number`
- 默认值：`1`

初始化 Hover 时传入的 DOM 节点 CSS `transform` 属性中 `scale` 的值。

## speed
- 类型：`Number`
- 默认值：`300`

初始化 Hover 时传入的 DOM 节点的动画时长，单位为毫秒。

## disabledAxis
- 类型：`String`
- 默认值：`''`

为 `x` 或 `y`，会禁止相应轴的转动。

## reset
- 类型：`Boolean`
- 默认值：`true`

定义在鼠标移出后各元素是否复位。

## layers
- 类型：`Object[]`
- 默认值：`[]`

对于视差位移，你需要设置 `layers`。它是一个对象数组，每个对象定义了一个 DOM 节点的位移行为。为了将对象和 DOM 节点对应起来，需要为 DOM 节点添加 `data-hover-layer` 属性，其值为对应对象在 `layers` 中的索引。每个对象拥有以下字段：

### multiple
- 类型：`Number`
- 默认值：`0.2`

定义节点位移的速度，其值的含义为节点真实移动的距离与鼠标移动距离之比。

### reverseTranslate
- 类型：`Boolean`
- 默认值：`false`

默认情况下，节点移动的方向和鼠标移动的方向相反。若 `reverseTranslate` 为 `true`，则节点会反向移动。
