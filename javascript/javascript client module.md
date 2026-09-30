<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [javascript client module](#javascript-client-module)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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
