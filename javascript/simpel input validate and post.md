# simpel input validate and post 

__HTML__

```html
<input class="usr" name="nama_depan" placeholder="nama depan">
<input class="usr" name="nama_belakang" placeholder="nama belakang"> 
<input class="usr" name="email" placeholder="nama email"> 
<input class="usr" name="password" placeholder="nama password">
<button id="tambah-user" class=" border">tambah</button>
```

__js__

```js
 $('INPUT').keydown( e => e.which === 13?$(e.target).next().focus():"");
  $('#tambah-user').click(() => {
      const usr = $('.usr')
      const paket = {}
      if(usr.val() == "") {alert('no kosong'); return;}
      for(let i of usr) paket[i.name] = i.value
      console.log(paket)
 })
 
```

### update

```js
function tambahUser(){
     const lsUsr = ['nama_depan','nama_belakang','email','password']
     let con = `<div class="p-3 bg-light">tambah user `
     for(let u of lsUsr)con += `<input class="usr" name="${u}" placeholder="${u}">`
     con +=`<button id="tambah-user" class="btn border">SIMPAN</button></div>`
     return con
 }
 $(document.body).append(tambahUser)

 $('INPUT').keydown( e => e.which === 13?$(e.target).next().focus():"");
 $('#tambah-user').click(() => {
     const usr = $('.usr')
     const paket = {}
     if(usr.val() == "") {alert('no kosong'); return;}
     for(let i of usr) paket[i.name] = i.value
     console.log(paket)
     $('.usr').val('')
 })
```
