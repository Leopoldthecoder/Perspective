# Configurations
Compared to Scroll, Hover has much simpler configs.

## max
- Type: `Number`
- Default: `20`

Max `rotateX` and `rotateY` for parallax tilt.

## reverseTilt
- Type: `Boolean`
- Default: `false`

By default, the elements float up as your mouse hovers over them. If `reverseTilt` is `true`, they will look like being pressed down instead.

## perspective
- Type: `Number`
- Default: `1000`

`perspective` for the CSS `transform` of the DOM element with which you called `new Hover`.

## easing
- Type: `String`
- Default: `cubic-bezier(.03, .98, .52, .99)`

Transition timing function of the DOM element with which you called `new Hover`.

## scale
- Type: `Number`
- Default: `1`

`scale` for the CSS `transform` of the DOM element with which you called `new Hover`.

## speed
- Type: `Number`
- Default: `300`

Transition duration of the DOM element with which you called `new Hover`.

## disabledAxis
- Type: `String`
- Default: `''`

Can be `x` or `y`. Disables a certain axis from tilting.

## reset
- Type: `Boolean`
- Default: `true`

Defines if everything returns to its original state when your mouse hovers out of them.

## layers
- Type: `Object[]`
- Default: `[]`

To activate parallax translate, you need to configure `layers`. `layers` is an object array, and each object describes how a DOM element translates. The object must be bound to a DOM element by adding a `data-hover-layer` attribute to the element with a value of the index of its corresponding object in the `layers` array. Each object has the following keys:

### multiple
- Type: `Number`
- Default: `0.2`

Describes how fast the element translates. Defined as the ratio of the distance the element travels and the distance the mouse moves.

### reverseTranslate
- Type: `Boolean`
- Default: `false`

Defines if the layer goes where your mouse leads or takes the opposite direction.
