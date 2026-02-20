# Installation
## npm
```shell
npm install perspective.js
# or
pnpm add perspective.js
# or
yarn add perspective.js
```

Then in your project:
```typescript
import { Scroll, Hover } from 'perspective.js'

// Type-only imports are also available
import type { ScrollConfig, HoverConfig } from 'perspective.js'
```

## CDN
```html
<script src="https://unpkg.com/perspective.js/dist/perspective.umd.js"></script>
```
Once loaded, Perspective.js will register `perspective` to the `window` object, and it has two attributes: `Scroll` and `Hover`.