# sequelize assosiation

__A.belongTo(B)__

A bisa mengambil data sekaligun kedalam B
persaratan : memberikan id B kedalam A


sediakan kunci b_id pada tabel A
```json
A : {
...
b_id: ""
}

B{
...
}
```


__output__
```json
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

