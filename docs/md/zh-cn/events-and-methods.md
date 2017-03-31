# 事件与方法

Perspective.js 提供了一系列事件和方法，通过它们可以对动画过程有更多的控制。

## 事件

以下事件均在初始化 Scroll 时传入的 DOM 节点上触发。事件都是 [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)，所以事件参数都存在于 `detail` 属性中。比如：
```javascript
wrap.addEventListener('step-change', event => {
  console.log(event.detail) // the parameters are stored in event.detail
})
```

### step-change

- 在动画关键帧改变时触发
- 参数：
- `activeStage`：一个描述当前舞台的对象：`id` 为舞台 ID，`node` 为舞台对应的 DOM 节点，`config` 为定义 Scroll 时传入的舞台配置对象
- `current`：当前关键帧的索引

?> `step` 可以理解为动画的关键帧：每次滚动滚轮时，动画会切换到下一个预设的状态，即过渡到一个新的关键帧，此时就会触发 `step-change`。

### stage-change

- 当舞台切换时触发
- 参数：
- `previous`：一个描述原舞台的对象：`id` 为舞台 ID，`node` 为舞台对应的 DOM 节点，`config` 为定义 Scroll 时传入的舞台配置对象，`step` 为舞台切换前所在动画关键帧的索引
- `current`：一个描述现舞台的对象：`id` 为舞台 ID，`node` 为舞台对应的 DOM 节点，`config` 为定义 Scroll 时传入的舞台配置对象

### scroll-out

- 当用户使用鼠标滚轮滚动出所有舞台时触发（即在第一个舞台的第一个关键帧向上滚动或在最后一个舞台的最后一个关键帧向下滚动）
- 参数：
 - `direction`：描述鼠标滚动方向的字符串，`top` 或 `bottom`

?> 若页面有其他内容希望在用户看完所有动画后展示，会用到 `scroll-out`。在大多数情况下，`scroll-out` 应该和 `destroy` 及 `restore` 方法配合使用。

## 方法

每个 Scroll 实例都拥有以下方法：

### setActiveStage(stageId)
设定当前舞台，参数是目标舞台的 ID。

### setStep(stepIndex)
设定当前关键帧，参数是目标关键帧的索引。

### getActiveStage
返回当前舞台的描述对象。

### getStep
返回当前关键帧的索引。

### destroy
Perspective.js 内部监听 `wheel` 事件，并在事件回调中执行了 `preventDefault`，因此会阻止页面真正发生滚动。调用 `destroy` 方法会移除事件监听，从而使页面重新可以滚动。当然，被 `destroy` 的实例无法进行视差动画的播放。

### restore
若在 `destroy` 后需要重新绑定事件监听，可以调用 `restore` 方法。

?> 有了 `scroll-out`、`destroy` 和 `restore`，你可以精确地控制何时播放视差动画，何时允许页面滚动。

## 试验场

来看一看有了这些事件和方法后，我们可以做到什么。

在一个视差滚动的页面里，经常会有一组指示器和一个进度条。用户可以通过点击指示器切换不同的舞台；进度条则能够提示用户前方还有多少动画未播放。使用本节介绍的事件和方法，就可以写出这样一个视差滚动页：

<script async src="//jsfiddle.net/leopoldthecuber/m22mypy5/1/embed/result/"></script>