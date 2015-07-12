# Perspective.js
Parallax scrolling/hovering effect. And more.

# Version updates
## 0.9.0
Function structure updated. Instead of passing multiple parameters to perspective.scroll/perspective.hover, now these two functions will look for `div` nodes with `data-perspective` attribute:
```html
<div class="stage" data-perspective="scroll">
```
or
```html
<div class="stage" data-perspective="hover">
```
1.0.0 release is coming soon.
## 0.0.5
A control panel will be automatically generated to the left edge of the stage. You can now go through each section with ease.
## 0.0.4
Now Firefox is supported. 
## 0.0.3
Comments added.
## 0.0.2
Colors in hex values are supported. They will be converted to RGB values.
## 0.0.1
Core functionalities accomplished. You can generate a parallax scrolling/hovering page by passing some parameters to perspective.scroll/perspective.hover after including Perspective.js in your HTML.
