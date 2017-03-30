# 事件与方法

To give you more control over the animations, Perspective.js provides several events and methods.

## Events

All the following events are triggered on the HTML node with which you initiated the Scroll instance. They are instances of [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent), so their parameters are stored in the `detail` attribute. Typically you can:
```javascript
wrap.addEventListener('step-change', event => {
  console.log(event.detail) // the parameters are stored in event.detail
})
```

### step-change

- triggers each time current step changes
- param:
 - `activeStage`: an object describing the stage you're currently in. `id` is the id of the active stage, `node` is the DOM node of the active stage, and `config` is the configuration object you defined for the active stage
 - `current`: index of the current step

?> `step` is just an alias of scroll. Every time you scroll, the animation hits another keyframe, and we call that a step.

### stage-change

- triggers when the active stage changes
- param:
 - `previous`: an object describing the previous stage. `id` is the id of the previous stage, `node` is the DOM node of the previous stage, `config` is the configuration object you defined for the previous stage, and `step` is the index of the active step before the stage changes
 - `current`: an object describing the current stage. `id` is the id of the active stage, `node` is the DOM node of the active stage, and `config` is the configuration object you defined for the active stage

### scroll-out

- triggers when user scrolls out of all stages
- param:
 - `direction`: a string indicating which direction the user moves out of the stages. Can be `top` or `bottom`

?> `scroll-out` is useful if you wish to display other contents when the user has finished watching all the stage animations. In most cases it should be used with `destroy` and `restore` methods.

## Methods

The Scroll instance has the following methods.

### setActiveStage(stageId)
Taking the stage ID as the parameter, this method sets the target stage active.

### setStep(stepIndex)
Taking the index of a step as the parameter, this method scrolls to the target step within the current stage.

### getActiveStage
Returns the object describing the active stage.

### getStep
Returns the index of the current step.

### destroy
Internally, Perspective.js listens to the `wheel` event and executes `preventDefault` in the event callback, which prevents the HTML from actually scrolling. Calling `destroy` removes all the event listeners, so you can scroll up and down the page again.

### restore
If you want to reattach event listeners to the Scroll instance, call the `restore` method on it.

?> With `scroll-out`, `destroy` and `restore`, you can precisely control when to perform animations and when to just scroll the page.

## Field test

With all these events and methods in hand, let's see what we can do.

In a parallax page, it's common to have a set of indicators and a progress bar. The indicators enables the user to navigate through different stages, while the progress bar shows how many more animations are ahead. The following is an example:

<script async src="//jsfiddle.net/leopoldthecuber/m22mypy5/1/embed/result/"></script>