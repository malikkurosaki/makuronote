```js
import { hookstate, useHookstate } from '@hookstate/core'

export const useState = () => useHookstate((hookstate([]))())
export const scoreState = () => useHookstate((() => (hookstate([]))))



```
