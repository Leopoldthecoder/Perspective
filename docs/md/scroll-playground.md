# Playground

With all the configurations we picked up in the last section in mind, let's try them ourselves on the [playground](). I've moved the first [example](https://perspective.js.org/examples/) (not including the SVG animation stage because animating SVGs needs tons of `items` and it takes too much space) to jsfiddle where you can modify its configurations and see how they make animations different.

<script>
  (function() {
    var createEmbedFrame;
    
    createEmbedFrame = function() {
      var currentSlug, iframe, listeners, setHeight, target, uid, uriEmbedded, uriOriginal, uriOriginalNoProtocol;
      uid = "JSFEMB_" + (~~(new Date().getTime() / 86400000));
      uriOriginal = "https://jsfiddle.net/leopoldthecuber/hkfprgrh/embed/result/";
      uriOriginalNoProtocol = uriOriginal.split("//").pop();
      uriEmbedded = "https://jsfiddle.net/leopoldthecuber/hkfprgrh/embedded/result/";
      currentSlug = "hkfprgrh";
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
<script async src="//jsfiddle.net/leopoldthecuber/hkfprgrh/embed/result/"></script>