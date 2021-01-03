# sequelize assosiation

__A.belongTo(B)__

A bisa mengambil data sekaligun kedalam B
persaratan : memberikan id B kedalam A


sediakan kunci b_id pada tabel A
```js
A : {
nama: "",
b_id: ""
}

B{
name: "",
}
```


__output__
```js
A : {
  "id": 1,
  "name": "20j64fk",
  "email": "5m47kj",
  "password": "bcl982j",
  "b_id": 2,
  "BId": 2,
  "B": {
    "id": 2,
    "nama": "pria"
  }
}


// implementasi


console.log(JSON.stringify(await A.findAll({
    include: {
        model: B
    }
}), null, 2));
```

__A.hasOne(B)__

kebalikan dari belongTo() , yaitu menaruh kunci a_id pada tabel B



