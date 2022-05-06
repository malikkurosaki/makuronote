## React State Management

### Rx.js
```js
import { useSelector } from 'react-redux'
import { createSlice } from '@reduxjs/toolkit'


function RxString(name) {
    return {
        _State: createSlice({
            name: name,
            initialState: localStorage.getItem(name) || "",
            reducers: {
                set: (state, action) => {
                    localStorage.setItem(name, state.toString())
                    state = action.payload
                    return state
                }
            },
        }),

        _Val: () => useSelector((state) => state[name]),
        /**@param {string} value */
        set(value) {
            return this._State.actions.set(value)
        },
        /**@type {string} */
        get value() {
            return this._Val()
        },
        get reducer() {
            return this._State.reducer
        }

    }
}

function RxInt(name) {
    return {
        _State: createSlice({
            name: name,
            initialState: parseInt(localStorage.getItem(name) || "0"),
            reducers: {
                set: (state, action) => {
                    localStorage.setItem(name, state.toString())
                    state = action.payload
                    return state
                }
            },
        }),

        _Val: () => useSelector((state) => state[name]),
        /**@param {number} value */
        set(value) {
            return this._State.actions.set(value)
        },
        /**@type {number} */
        get value() {
            return this._Val()
        },
        get reducer() {
            return this._State.reducer
        }
    }
}

function RxMap(name) {
    return {
        _State: createSlice({
            name: name,
            initialState: JSON.parse(localStorage.getItem(name) || "{}"),
            reducers: {
                set: (state, action) => {
                    localStorage.setItem(name, JSON.stringify(state))
                    state = action.payload
                    return state
                }
            },
        }),

        _Val: () => useSelector((state) => state[name]),
        /**@param {Map<string, any>} value */
        set(value) {
            return this._State.actions.set(value)
        },
        /**@type {Map<string, any>} */
        get value() {
            return this._Val()
        },
        get reducer() {
            return this._State.reducer
        }
    }
}

function RxList(name) {
    return {
        _State: createSlice({
            name: name,
            initialState: JSON.parse(localStorage.getItem(name) || "[]"),
            reducers: {
                set: (state, action) => {
                    localStorage.setItem(name, JSON.stringify(state))
                    state = action.payload
                    return state
                }
            },
        }),

        _Val: () => useSelector((state) => state[name]),
        /**@param {Array<any>} value */
        set(value) {
            return this._State.actions.set(value)
        },
        /**@type {Array<any>} */
        get value() {
            return this._Val()
        },
        get reducer() {
            return this._State.reducer
        }
    }
}

function RxBoolean(name) {
    return {
        _State: createSlice({
            name: name,
            initialState: localStorage.getItem(name) === "true",
            reducers: {
                set: (state, action) => {
                    localStorage.setItem(name, state.toString())
                    state = action.payload
                    return state
                }
            },
        }),

        _Val: () => useSelector((state) => state[name]),
        /**@param {boolean} value */
        set(value) {
            return this._State.actions.set(value)
        },
        /**@type {boolean} */
        get value() {
            return this._Val()
        },
        get reducer() {
            return this._State.reducer
        }
    }
}

export { RxString, RxInt, RxMap, RxList, RxBoolean }


```

### val.js
```js
import { configureStore } from '@reduxjs/toolkit'
import { RxList, RxString } from './rx'

const orang = RxString("orang");
const listNama = RxList("listNama");

const store = configureStore({
  reducer: {
    orang: orang.reducer,
    listNama: listNama.reducer
  },
})

export { orang, store, listNama }
```


### app.js
```js
function Nama() {
  const dispatch = useDispatch()
  let l = [...listNama.value]
  const ls = listNama.value.map((item, index) => {
    return <li key={index}>{item}</li>
  })

  return (
    <div>
      <div>{orang.value}</div>
      <ul>{ls}</ul>
      <input type="text" onChange={function (val) {
        l.push(val.target.value)
        dispatch(listNama.set(l))
      }} />
      <button onClick={() => dispatch(orang.set('malik  asasa jajajajaja'))} >Tekan Aja</button>
      <button onClick={() => dispatch(listNama.set(["nama", "siapa", "namanya", "hahahah"]))}>Tamba List</button>
    </div>
  )
}

function App() {
  return (
    <div>
      <Provider store={store}>
        <Nama />
      </Provider>
    </div>
  );
}

export { App };

```

### index.js
```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import {App} from './App';

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```
