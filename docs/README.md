# Introduction
Perspective.js is designed for making dashing parallax scroll effects. Besides the good old parallax scroll, where different layers move in different speeds, it provides a far wider range of effects for you. To have an idea of what Perspective.js can do, check out this [example](https://perspective.js.org/examples/).

More than that, parallax tilt hover is also supported.

# Features
- Parallax scroll and parallax tilt hover effects
- Any CSS properties with number values are supported
- Written with vanilla JavaScript

# Installation
## npm
```shell
npm install perspective.js
# or
yarn add perspective.js
```

Than in your project
```javascript
import { PerspectiveScroll, PerspectiveHover } from 'perspective.js'
```

## CDN
```html
<script type="text/javascript" src="//unpkg.com/perspective.js"></script>
```
Once loaded, Perspective.js will register `PerspectiveScroll` and `PerspectiveHover` to the `window` object.

# PerspectiveScroll

PerspectiveScroll is in charge of parallax scroll effects. It lets you set CSS animations on DOM elements, and play them as you scroll your mouse.

## Example
Let's start with an example. Say we have the following markup:

```html
<div class="container" data-scroll-stage-id="basic">
  <p class="slow" data-scroll-item-id="slow">SLOW</p>
  <p class="fast" data-scroll-item-id="fast">FAST</p>
</div>
```

Just ignore `data-scroll-stage-id` and `data-scroll-item-id` for a minute, we'll come back for them later. Now if we want some parallax effects, we just need to:

```javascript
  import PerspectiveScroll from 'perspective.js'
  // you don't need to import PerspectiveScroll if you are using CDN

  new PerspectiveScroll('.wrap', {
    stages: [{
      id: 'basic',
      scrollNumber: 60,
      transition: 0,
      easing: 'linear',
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

You can probably see that we created a PerspectiveScroll instance with two parameters: a string `.wrap` and an object. The first parameter tells PerspectiveScroll which DOM element to apply parallax scroll effects, and the second one is a configuration of how you wish the effects should look like.

See this little example in motion here. Then let's dive deeply into how this works.

## Concepts

Tell Perspective.scroll the initial and final CSS stats of the element you want to add scrolling effects on, and how many scrolls the effects will last. It calculates corresponding CSS values of each scroll based on scroll number of that element.

So any CSS property that uses number as its value is supported, such as `height`, `top`, `transform`, `opacity` and `color`. For color values, hexadecimal notation, RGB(a) notation and HSL notation are all supported.
## HTML structure
![HTML structure](HTML structure.png)
As shown above, your HTML should look something like this:
```html
<div class="stage" data-perspective="scroll">
  <div class="wrap">
    <div class="container">...</div>
    <div class="container">...</div>
    ...
    <div class="container">...</div>
  </div>
</div>
```
Add `data-perspective="scroll"` property to `.stage` tag. This tells Perspective.scroll to perform scrolling effect on this stage.

There are two properties you can add to `.container` tag:
```html
<div class="container" data-scroll-tag="container name" data-scroll-number=5>...</div>
```
`data-scroll-tag` is used to generate a control panel with which you can go through each container. The value of `data-scroll-tag` shows what this container is about. `data-scroll-number` tells Perspective.scroll how many scrolls the effects will last.
## Javascript function call
For each `.container` element, a two dimensional array should be passed to Perspective.scroll:
```javascript
var cssArr_1 = [[CSS stats of child element 1], ..., [CSS stats of child element n]],
...,
cssArr_n = [[CSS stats of child element 1], ..., [CSS stats of child element m]];
perspective.scroll(cssArr_1, ..., cssArr_n);
```
Perspective.scroll applies each inner array to the first `n` child elements of `.container` element.
The inner array consists of a CSS property name, initial and final value of that property:
```javascript
["CSS property", "initial value", "final value"]
```
The corresponding child element changes from initial value to final value of the given CSS property as you scroll. Note that:
* For CSS property, use camel case notation, like you would always do in Javascript.
* For initial value, don't leave out `px` after number `0`.
* For final value, just write the number part of the value(you CAN write the full value, but you don't have to).

An array could be:
```javascript
["marginTop", "0px", "100"]
```
or
```javascript
["transform", "translateY(20px)", "200"]
```
The first array tells Perspective.scroll to scroll the `margin-top` property from `0` all the way to `100px`, and the second scrolls `transform` from `translateY(20px)` to `translateY(200px)`.

If more than one CSS property need to be changed, just push them into the same array:
```javascript
["CSS property 1", "initial value 1", "final value 1", ..., "CSS property n", "initial value n", "final value n"]
```

Perspective.scroll accepts another parameter which is also an array. Its elements are `transition` values(in second) of each `.container` element:
```javascript
perspective.scroll(cssArr_1, ..., cssArr_n, [transition value 1, ..., transition value m]);
```
This array is optional. All `.container` elements have a default `0.2s` for `transition` property.

## Events
| Event Name | Description | Parameters |
|---------|--------|---------|
| step-change | triggers each time current step changes | activeStage: { id of the active stage, DOM node of the active stage }, current step |
| stage-change | triggers when the active stage changes | previous: { id of the previously active stage, DOM node of the previously active stage }, current: { id of the currently active stage, DOM node of the currently active stage } |
| scroll-out | triggers when user scrolls out of all stages | detail: { direction: 'bottom' / 'top' } |

# PerspectiveHover
Perspective.hover is fairly easy to use compared to Perspective.scroll.
## HTML structure
```html
<div data-perspective="hover">
  <div data-hover-speed=0.04>...</div>
  <div data-hover-speed=0.4>...</div>
</div>
```
Simply add `data-perspective="hover"` to the parent element and all its child element will have a parallax hover effect.

`data-hover-speed` tells Perspective.hover how fast the element moves as you hover on it. This property is optional, and its default value is `0.2`.
## Javascript function call
```javascript
perspective.hover(isHoming);
```
Optional `isHoming` decided if elements go back to where they originally were when your mouse move out of them. Its default value is `true`.

# Example
HTML:
```html
<div class="stage" data-perspective="scroll">
  <div class="wrap">
    <div class="container" id="container1" data-scroll-tag="Top and Opacity" data-scroll-number=20>
      <div class="div1"></div>
      <p>Stay Still</p>
    </div>
    <div class="container" id="container2" data-scroll-tag="Background Image" data-scroll-number=4>
      <div></div>
    </div>
    <div class="container" id="container3" data-scroll-tag="Parallax Hover" data-scroll-number=0 data-perspective="hover">
      <div data-hover-speed=0.02></div>
      <div></div>
    </div>
  </div>
</div>
```
Effects we want:
* `#container1` performs a scroll effect of a `transition` of `0`:
+ `div` element changes from `top: 0; opacity: 1.0;` to `top: 100px; opactiy: 0.3;` through 20 scrolls;
+ `p` element stays still;
* `#container2` performs a scroll effect of a `transition` of `0.5s`:
+ `div` element changes from `background-image: url(bg_1.jpg);` to `background-image: url(bg_5.jpg);` through 4 scrolls;
* `#container3` performs a parallax hover effect:
+ the first `div` element moves with a speed of `0.02`;
+ the second `div` element moves with a speed of `0.2`.

For `#container1`, since `p` element stays still, `cssArr_1` should have only one element:
```javascript
var cssArr_1 = [["top", "0px", "100", "opacity", "1.0", "0.3"]];
```

For `#container2`:
```javascript
var cssArr_2 = [["backgroundImage", "url(bg_1.jpg)", "5"]];
```
Note that we used underline `_` between `bg` and `1` instead of hyphen`-`. This is because `-` will be parsed to minus rather than hyphen.

For `#container3`, we have added `data-perspective="hover"` in parent element and `data-hover-speed=0.02` in the first `div`. Since the second `div` uses the default speed of `0.2`, we don't need to add anything. However, `#container3` is a child element of `.wrap`, which means it is also a part of scroll effect. As a result, an empty array has to be passed to perspective.scroll as a placeholder. Besides, `data-scroll-number=0` and `data-scroll-tag="Parallax Hover"` are needed. If you are performing parallax hover effect on a standalone element, you don't have to do any of the above.

The complete function call is:
```javascript
var cssArr_1 = [["top", "0px", "100", "opacity", "1.0", "0.3"]],
cssArr_2 = [["backgroundImage", "url(bg_1.jpg)", "5"]];
cssArr_3 = [];
perspective.scroll(cssArr1, cssArr2, cssArr3, [0, 0.5, 0]);
perspective.hover();
```
# Notice
All class names used above are not mandatory. Use whatever class names you like.