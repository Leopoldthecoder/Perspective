# An example

`Scroll` is in charge of parallax scroll effects. It lets you set CSS animations on DOM elements, and play them as you scroll your mouse.

## Example
Let's start with an example. Say we have the following markup:

```html
<div class="wrap">
  <div data-scroll-stage-id="basic">
    <p data-scroll-item-id="slow">SLOW</p>
    <p data-scroll-item-id="fast">FAST</p>
  </div>
</div>
```

Just ignore `data-scroll-stage-id` and `data-scroll-item-id` for a minute, we'll come back for them later. Now if we want some parallax effects, we just need to:

```javascript
// using npm
import { Scroll } from 'perspective.js'

// using CDN
const Scroll = perspective.Scroll

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

See this little example in motion:

<script>
  (function() {
    var createEmbedFrame;
    
    createEmbedFrame = function() {
      var currentSlug, iframe, listeners, setHeight, target, uid, uriEmbedded, uriOriginal, uriOriginalNoProtocol;
      uid = "JSFEMB_" + (~~(new Date().getTime() / 86400000));
      uriOriginal = "https://jsfiddle.net/leopoldthecuber/tqeakbsm/embed/result/";
      uriOriginalNoProtocol = uriOriginal.split("//").pop();
      uriEmbedded = "https://jsfiddle.net/leopoldthecuber/tqeakbsm/embedded/result/";
      currentSlug = "tqeakbsm";
      target = document.querySelector("script[src*='" + uriOriginalNoProtocol + "']");
      iframe = document.createElement("iframe");
      iframe.src = uriEmbedded;
      iframe.id = uid;
      iframe.width = "100%";
      iframe.height = "0";
      iframe.frameBorder = "0";
      iframe.allowtransparency = true;
      iframe.sandbox = "allow-modals allow-forms allow-scripts allow-same-origin allow-popups";
      target.parentNode.insertBefore(iframe, target.nextSibling);
      setHeight = function(data) {
        var height;
        if (data.slug === currentSlug) {
          height = data.height <= 0 ? 400 : data.height + 50;
          return iframe.height = height;
        }
      };
      listeners = function(event) {
        var data, eventName;
        eventName = event.data[0];
        data = event.data[1];
        switch (eventName) {
          case "embed":
            return setHeight(data);
          case "resultsFrame":
            return setHeight(data);
        }
      };
      return window.addEventListener("message", listeners, false);
    };
    
    setTimeout(createEmbedFrame, 5);
    
  }).call(this);
</script>
<script async src="//jsfiddle.net/leopoldthecuber/tqeakbsm/embed/result/"></script>