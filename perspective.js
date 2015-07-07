/*function addClass(ele, className) {
	if (ele.className.indexOf(className) === -1) {
		ele.className += " " + className;
	}
}

function removeClass(ele, className) {
	var str = ele.className, index = -1;
	if (str.indexOf(className) > -1) {
		var nameArr = str.split(/\s+/);
		for (var i = 0; i < nameArr.length; i++) {
			if (nameArr[i].toString() === className) {
				index = i;
				break;
			}
		}
		nameArr.splice(index, 1);
		ele.className = nameArr.join(' ');
	}
}*/
perspective = {};
perspective.hover = function(container, speedArr, isHoming) {	
	var layers = [];
	for (var i = 0; i < container.childNodes.length; i++) {
		if (container.childNodes[i].nodeType == 1) {
			layers.push(container.childNodes[i]);
		}
	}
	var l = layers.length, inAnim = false;
	if (speedArr.length < l) {
		for (i = speedArr.length; i < l; i++) {
			speedArr.push(0.2);
		}
	}
	isHoming = arguments[2] ? arguments[2] : true;
	function layersFunc(fn) {
		for (var i = 0; i < l; i++) {
			fn(i);
		}
	}
	function setTranslate(ele, x, y) {
		var prefix = ['webkit', 'ms', 'o', 'moz', ''];
		for (var i = 0; i < prefix.length; i++){
			ele.style[prefix[i]+'Transform'] = "translate(" + x + "px," + y + "px)";
		}
	}
	function relocate(ele, x, y, v) {
		var offsetX = Math.floor(v *(0.5 * document.body.clientWidth - x));
		var offsetY = Math.floor(v *(0.5 * document.body.clientHeight - y));
		var prefix = ['webkit', 'ms', 'o', 'moz', ''];
		setTranslate(ele, offsetX, offsetY);
	}
	container.onmousemove = function(e) {
		if (!inAnim) {
			layersFunc(function(i){
				relocate(layers[i], e.clientX, e.clientY, speedArr[i]);
			});
		}
	}
	container.onmouseout = function(e) {
		if (isHoming){
			var reg = this.compareDocumentPosition(e.relatedTarget);
			if (!(reg == 20 || reg == 0)) {
				layersFunc(function(i){
					layers[i].style.transition = "0.1s";
				})
				if (!inAnim) {
					layersFunc(function(i){
						setTranslate(layers[i], 0, 0);
					});
				}
			}
		}
	}
	container.onmouseover = function(e) {
		var reg = this.compareDocumentPosition(e.relatedTarget);
		if (!(reg == 20 || reg == 0)) {
			inAnim = true;
			layersFunc(function(i){
				layers[i].style.transition = "0.1s";
				relocate(layers[i], e.clientX, e.clientY, speedArr[i]);
			});
			setTimeout(function() {
				inAnim = false;
				layersFunc(function(i){
					layers[i].style.transition = "0s";
				});
			},100);
		}
	}
}

perspective.scroll = function() {
  var c = [], cCount = arguments[0].length, regNum = /-?\d+(?:\.\d*)?/g, inAnim = false; // cCount记录container个数
  for (var i = 0; i < cCount; i++) {
    c[i] = {};
    c[i].target = arguments[0][i];
    c[i].target.style.transition = "0.5s";
    c[i].sLength = arguments[1][i];
    c[i].cssArr = arguments[2 + i];
    c[i].layers = [];
    for (var j = 0; j < c[i].target.childNodes.length; j++) {
      if (c[i].target.childNodes[j].nodeType == 1) {
        c[i].layers.push(c[i].target.childNodes[j]);
      }
    }
    c[i].childCount = c[i].cssArr.length;
    c[i].layers = c[i].layers.slice(0, c[i].childCount);
    c[i].sDuration = arguments[2 + i + arguments[0].length] ? arguments[2 + i + arguments[0].length] : 0.2;
    c[i].attr = [];
    c[i].prop = [];
    c[i].propNum = [];
    c[i].propStr = [];
    for (j = 0; j < c[i].childCount; j++) {
      c[i].layers[j].style.transition = c[i].sDuration + "s";
      c[i].attr[j] = [];c[i].prop[j] = [];
      c[i].propNum[j] = [];
      c[i].propStr[j] = [];
      for (var k = 0; k < c[i].cssArr[j].length; k++){
        switch (k % 3) {
          case 0: {
            c[i].attr[j].push(c[i].cssArr[j][k]);
            c[i].propNum[j][k / 3] = [];
            c[i].propStr[j][k / 3] = [];
            break;
          }
          case 1: {
            c[i].propNum[j][Math.floor(k / 3)][0] = c[i].cssArr[j][k].toString().match(regNum);          
            c[i].propStr[j][Math.floor(k / 3)] = c[i].cssArr[j][k].toString().split(regNum);
            break;
          }
          case 2: {
            c[i].propNum[j][Math.floor(k / 3)][1] = c[i].cssArr[j][k].toString().match(regNum);
            break;
          }
        }
      }
      for (k = 0; k < c[i].cssArr[j].length / 3; k++) {
        c[i].delta = [];
        for (var m = 0; m < c[i].propNum[j][j][0].length; m++) {
          c[i].delta[m] = (c[i].propNum[j][k][1][m] - c[i].propNum[j][k][0][m]) / c[i].sLength;
        }
        c[i].prop[j][k] = [];      
        for (var l = 0; l <= c[i].sLength; l++) {
          if (l === 0) {
            c[i].prop[j][k][l] = c[i].cssArr[j][k * 3 + 1];
          }
          else {
            c[i].prop[j][k][l] = "";
            for (var n = 0; n < c[i].propNum[j][k][0].length; n++) {
              c[i].prop[j][k][l] += c[i].propStr[j][k][n] + (parseFloat(c[i].propNum[j][k][0][n]) + c[i].delta[n] * l);
            }
            c[i].prop[j][k][l] += c[i].propStr[j][k][n];
          }
        }
      }
    }
  }
  var sCount = 0, breakPoints = [], totalLength = 0;
  for (i = 0; i < c.length - 1; i++) {
    totalLength += c[i].sLength;
    breakPoints.push(totalLength + i+ 1);
  }
  totalLength += c[c.length - 1].sLength + c.length - 1;
  function switchContainers(i, dir) {
    var curCon = {}, relCon = {};
    if (dir === 1) {
      curCon = c[i];
      relCon = c[i + 1];
    }
    else {
      curCon = c[i+1];
      relCon = c[i];
    }
    if (dir === 1) {
      i++;
    }
    inAnim = true;
    curCon.target.parentNode.style.transition = "0.5s";
    curCon.target.parentNode.style.top = "-" + i * 100 + "%";
    setTimeout(function() {
      inAnim = false;
    }, 500);
  }
  document.onmousewheel = function(e) {
    if (!inAnim) {
      if (((e.wheelDelta < 0) && (sCount === totalLength)) || ((e.wheelDelta > 0) && (sCount === 0))) {
        return false;
      }
      for (var i = 0; i < breakPoints.length; i++) {
        if ((e.wheelDelta < 0) && (sCount === breakPoints[i] - 1)) {
          console.log("向下换场");//向下换场动画
          switchContainers(i, 1);
        }
        else if ((e.wheelDelta > 0) && (sCount === breakPoints[i])) {
          console.log("向上换场");//向上换场动画
          switchContainers(i, -1);
        }
      }    
      if (e.wheelDelta < 0) {
        sCount++;
      }
      if (e.wheelDelta > 0) {
        sCount--;
      }
      var mark = 0;
      for (i = 0; i < breakPoints.length; i++) {
        if (sCount >= breakPoints[i]) {
          mark++;
        }
      }
      var curCon = c[mark], prevCountSum = 0;
      for (i = 0; i < mark; i++) {
        prevCountSum += c[i].sLength + 1;
      }
      console.log("container:"+mark);
      console.log("sCount:"+sCount);
      console.log("prevCountSum:"+prevCountSum);
      for (i = 0; i < curCon.childCount; i++){
        for (var j = 0; j < curCon.attr[i].length; j++){
          curCon.layers[i].style[curCon.attr[i][j]] = curCon.prop[i][j][sCount - prevCountSum];
        }
      }      
    }
    return false;
  }
}