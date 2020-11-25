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
