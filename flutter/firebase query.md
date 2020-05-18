# firebase query 

```dart

// firebase
Future<String> getFbUsers(String email)async{
  final db =  FirebaseDatabase.instance.reference();
  final query = await db.child('users').orderByChild('c_email').equalTo(email).once().then((value) => value.value);
  return query.toString();
}

```
