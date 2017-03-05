# Hover
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