# catatan project

1. runtype ( jenis data yang berbeda. )
    - tidak konsisten pada response data , parameter success tidak selalu ada disetiap response, yang bisa digunakan sebagai detektor parameter keberhasilan atau kegagalan serponse , malahan menghasilkan null
       __jika user telah terdaftar__
       
       `{success: false, message: User Sudah Terdafar, data: []}`
       
       _jika user berhasil mendaftar_
       
       `{token_type: Bearer, expires_in: 604800, access_token: token}`
       
       _yang seharusnya_
       
       `{success: true, token_type: Bearer, expires_in: 604800, access_token: token}`
       
       ### peruntukan
       
       ```dart
       
       if(!res.body['success']){
        Get.dialog(
          AlertDialog(
            title: Text("ALERT"),
            content: Text(res.body['message']),
            actions: [
              TextButton(
                onPressed: () => Get.back(), 
                child: Text("OK")
              )
            ],
          )
        );

        return;
      }

      print(res.body);
      
    }
    
    ```
    
### tambahan dari bagas
    
```js
    //pengolahan stage managemen
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

        console.log(value)
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

### store

```js
//store untuk daftar stage managemen
import { configureStore } from '@reduxjs/toolkit'
import { Rx } from './rx'

const orang = new Rx("orang", []);
const user = new Rx('user', {});

const store = configureStore({
    reducer: {
        orang: orang.reducer,
        user: user.reducer
    },
})

export { orang, store, user}

```

### app

```js
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


// import { Link, Outlet } from 'react-router-dom';
// import { LandingPage } from './login/landingpage';
// import { HalamanAbout } from './halaman_about';

import {useNavigate} from 'react-router-dom'
import { TampilanHome } from './frontend/home';

function cek(navigate){
  console.log("cek login")
  if(localStorage.getItem('user') == null){
    navigate('/landing');
  }else{
    navigate('/halamanprofile')
  }
}

function App() {
  let navigate = useNavigate();
  
  return (
    <div className='container'>
      
     <TampilanHome />
    </div>
  );
}


export { App };

```
