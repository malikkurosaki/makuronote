# flutter firestore add data

```dart
tambahUser()async{
    final data = UserModel(
      nama: "malik",
      email: "email@gmail.com",
      password: "12345"
    );
    final ini = await pengguna.add(data.toJson()).then((value) => value);
    print(ini.id);
  }
```
