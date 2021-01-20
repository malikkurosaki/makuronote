# javascript client module 

index.html
```html
<script type="module" src="./malik.js"></script>
```

malik.js
```js

import {alamat} from './malik2.js'

console.log(alamat);

export const siapa = "malik"
```

malik2.js
```js
const alamat = "denpasar"
export {alamat}
```
