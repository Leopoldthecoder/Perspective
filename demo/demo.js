window.onload = function() {
  var cssArr1 = [["transform", "translateY(0px)", "-100"], ["transform", "translateY(0px)", "-180"], ["transform", "translateY(0px)", "-700"]],
      cssArr2 = [["backgroundImage", "url('images/cube_1.png')", "5"]],
      cssArr3 = [[], ["opacity", "0", "0.9", "transform", "translateY(0px)", "-50"]],
      cssArr4 = [["transform", "rotateX(0deg)", "288"]],
      cssArr5 = [];
  perspective.scroll(cssArr1, cssArr2, cssArr3, cssArr4, cssArr5, [0, 0.5, 2, 0.5, 0]);
  perspective.hover();
}