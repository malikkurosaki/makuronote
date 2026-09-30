<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [firebase query](#firebase-query)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# firebase query 

```dart

// firebase
Future<String> getFbUsers(String email)async{
  final db =  FirebaseDatabase.instance.reference();
  final query = await db.child('users').orderByChild('c_email').equalTo(email).once().then((value) => value.value);
  return query.toString();
}

```
