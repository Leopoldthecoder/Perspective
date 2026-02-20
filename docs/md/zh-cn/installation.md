# 安装
## npm
```shell
npm install perspective.js
# or
pnpm add perspective.js
# or
yarn add perspective.js
```

接下来即可：
```typescript
import { Scroll, Hover } from 'perspective.js'

// 也可以单独导入类型
import type { ScrollConfig, HoverConfig } from 'perspective.js'
```

## CDN
```html
<script src="https://unpkg.com/perspective.js/dist/perspective.umd.js"></script>
```
加载成功后，Perspective.js 会在 `window` 对象上注册 `perspective`，它有两个属性：`Scroll` 和 `Hover`。