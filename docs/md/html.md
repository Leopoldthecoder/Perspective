## HTML structure
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