# 安装
## npm
```shell
npm install perspective.js
# or
yarn add perspective.js
```

接下来即可
```javascript
import { Scroll, Hover } from 'perspective.js'
```

## CDN
```html
<script type="text/javascript" src="//unpkg.com/perspective.js/lib/perspective.js"></script>
```
加载成功后，Perspective.js 会在 `window` 对象上注册 `perspective`，它有两个属性：`Scroll` 和 `Hover`。