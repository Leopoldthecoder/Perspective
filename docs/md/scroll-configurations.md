# Configurations

In the previous section, we initiated the scroll effects like this:
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

You can probably see that we created a Scroll instance with two parameters: a string `.wrap` and an object. The first parameter tells Scroll which DOM element to apply parallax scroll effects, and it can be a DOM element or a string. If it's a string, Scroll will try to find the DOM by calling `document.querySelector`, so make sure it returns an existing DOM element.

The second parameter is a configuration object for you to define how you wish the effects to look like. It has the following keys.

## stages
- Type: `Object[]`
- Default: `[]`

Stage is an important concept in Scroll. Take a look at our first [example](https://perspective.js.org/examples/). Obviously it has four parts, the first part being 'Good Old Parallax Effect', the second 'Charge Batteries', the third 'Draw a Joystick', and the fourth 'Rotate the Sentence'. Each part is defined as a `stage`.

As mentioned above, we have a configuration object with a key named `stages`, and the value for that key is an object array, each object represents a stage and defines its scroll behavior. You can have as many DOM elements (we call them `items` in Perspective.js) in one stage as you want, and their scroll behavior is described in the `items` path. `items` and other paths of a stage are as follows.

### id
- Type: `String`
- Default: `N/A`

ID of the stage. After defining a stage, you need to add `data-scroll-stage-id` with the same value to a DOM element. Perspective.js will bind the DOM element and perform defined stage animations on it.

?> It's a little ambiguous to say Perspective.js performs animation on a stage. In fact, a stage does not animate, it's the `items` in the stage that do the actual animations.

### scrollNumber
- Type: `Number`
- Default: `1`

Defines how many scrolls the stage animations last.

### transition
- Type: `Number`
- Default: `200`

Defines how many milliseconds each transition lasts.

### easing
- Type: `String`
- Default: `ease`

The transition timing function.

### items
- Type: `Object[]`
- Default: `[]`

Animating items. Each item represents a DOM element, and when you scroll, these DOM elements will perform animations defined in `items`. Paths for an item are:

#### id
- Type: `String`
- Default: `N/A`

ID of the item. Just like `id` of a stage, after defining an item, you need to add `data-scroll-item-id` with the same value to a DOM element. Perspective.js looks the DOM tree for that ID and add animations on it.

#### effects
- Type: `Object[]`
- Default: `N/A`

CSS transitions for an item. For each effect, you can define `property`, `start`, `end`, `startAt` and `endAt`. The first three are required, and the latter two are optional.

| Path | Type | Default | Description |
|------|------|---------|-------------|
| property | String | N/A | CSS property name of the transition |
| start | String | N/A | Starting value of the property |
| end | String | N/A | Ending value of the property |
| startAt | Number | 0 | Start the transition on which scroll. Must not be less than 0 |
| endAt | Number | `scrollNumber` of current stage | End the transition on which scroll. Must not exceed `scrollNumber` of current stage |

?> Note that only CSS properties with number values are supported. Animating `position` from `static` to `fixed` is impossible. On top of that, keywords are also not supported, e.g. changing `height` from `100px` to `auto`.

!> Though the unit after `0` in a CSS value can be omitted, you cannot do this for `start` and `end`. In other words, `start: 'translate(0)'` is invalid, you should write `start: 'translate(0px)'`.

Thanks to `startAt` and `endAt`, not all items have to animate simultaneously. Check this out:

<script async src="//jsfiddle.net/leopoldthecuber/88wmq2qm/1/embed/result/"></script>

## stageSwitchTransition
- Type: `Number`
- Default: `800`

Defines how many milliseconds the transition lasts when switching between two stages.

## stageSwitchDelay
- Type: `Number`
- Default: `0`

When you scroll to the edge of a stage, Perspective.js will wait this amount of time before switching to the next stage. Also in milliseconds.

## stageSwitchEasing
- Type: `String`
- Default: `cubic-bezier(.86, 0, .07, 1)`

Transition timing function when switching stages.

## disableAfterSwitching
- Type: `Number`
- Default: `500`

Defines how many milliseconds the stage will freeze after switching. During this time, Perspective.js will not respond to mouse scroll.