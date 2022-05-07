### App.js

```js
import { userController } from './store';

function App() {
    return (
        <div className='container'>
            <UserSignUp></UserSignUp>
        </div>
    );
}

function UserSignUp() {
    userController.init();
    let body = "malik";

    userController.val = "apaka barna";

    return (
        <div className='container'>
            <div>{JSON.stringify(userController.val)}</div>
            <div className='row'>
                <div className='col-md-6'>
                    <div className='card'>
                        <div className='card-header'>
                            <h3>Sign Up</h3>
                        </div>
                        <div className='card-body'>
                            <div className='form-group'>
                                <label>Nama</label>
                                <input type='text' className='form-control' onChange={(e) => {body['name'] = e.target.value}} />
                            </div>
                            <div className='form-group'>
                                <label>Email</label>
                                <input type='email' className='form-control' onChange={(e) => body.email = e.target.value}/>
                            </div>
                            <div className='form-group'>
                                <label>Password</label>
                                <input type='password' className='form-control' onChange={(e) => body.password = e.target.value}/>
                            </div>
                            
                            <div className='form-group mt-4'>
                                <button className='btn btn-primary' onClick={() => {
                                    
                                    userController.val = body;
                                    
                                }}>Simpan</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { App };
```

### index.html

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <title>My Parcel App</title>
</head>

<body>
    <div id="app"></div>
    <script type="module" src="index.js"></script>
</body>

</html>
```

### index.js

```js
import ReactDOM from 'react-dom/client'
import { App } from './app';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('app')).render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />} />
            </Routes>
        </BrowserRouter>
    </Provider>
)
```

### Rx.js

```js

import { createSlice } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux';

class Rx{

    init() {
        let Dis = () => useDispatch()
        let Sel = () => useSelector((state) => state[this.name]);
        this.dis = Dis();
        this._val = Sel();
    }

    /**@type {string | {} | [] | boolean | number} */
    get val(){
        return this._val;
    }

    set val(value) {
        setTimeout(() => {
            this.dis(this.state.actions.set(value));
        },1);
    }

    /**
     * @param {string} name 
     * @param {object | string | {} | [] | boolean | number} value
     * */
    constructor(name, value) {
        this.name = name;
        this.state = createSlice({
            name: name,
            initialState: value,
            reducers: {
                set: (state, action) => state = action.payload
            },
        })

        this.reducer = this.state.reducer;

    }
}

export { Rx }


```

### Store.js

```js
import { configureStore } from '@reduxjs/toolkit'
import { Rx } from './rx'

const orang = new Rx("orang", []);
const listNama = new Rx("listNama", []);
const userController = new Rx('userController', {});

const store = configureStore({
    reducer: {
        orang: orang.reducer,
        listNama: listNama.reducer,
        userController: userController.reducer
    },
})

export { orang, store, listNama , userController}
```
