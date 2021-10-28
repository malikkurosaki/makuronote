```dart
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:get/get.dart';

class MyAuth extends StatelessWidget {
  MyAuth({ Key? key }) : super(key: key);

  FirebaseAuth auth = FirebaseAuth.instance;

  @override
  Widget build(BuildContext context) => 
  Scaffold(
   body: SafeArea(
     child: Column(
       children: [
        FutureBuilder(
          future: onLoad(),
           builder: (context, snapshot) => 
           snapshot.connectionState != ConnectionState.done
           ? Text("loading")
           : Column(
             children: [
              TextButton(
                 onPressed: (){
                   tryLogin();
                 }, 
                 child: Text("try login")
              ),
              TextButton(
                onPressed: (){
                  tryRegister();
                }, 
                child: Text("try register")
              ),
              TextButton(
                onPressed: () async => await FirebaseAuth.instance.signOut(), 
                child: Text("signout")
              ),
              TextButton(
                onPressed: (){
                  Get.to(TryToRegister());
                }, 
                child: Text("go to my register")
              )
             ],
           ),
        )
       ],
     )
    ),   
  );


  onLoad()async{
    FirebaseAuth.instance
    .authStateChanges()
    .listen((User? user) {
      if (user == null) {
        print('User is currently signed out!');

        // do something hire
      } else {
        print('User is signed in!');

        // do something hire to
      }
    });
  }

  tryLogin()async{
    try {
      UserCredential userCredential = await FirebaseAuth.instance.signInWithEmailAndPassword(
        email: "malik@gmail.com",
        password: "Makuro_9090"
      );
    } on FirebaseAuthException catch (e) {
      if (e.code == 'user-not-found') {

        print('No user found for that email.');
      } else if (e.code == 'wrong-password') {

        print('Wrong password provided for that user.');
      }
    }
  }


  tryRegister()async{
    try {
      UserCredential userCredential = await FirebaseAuth.instance.createUserWithEmailAndPassword(
        email: "malik@gmail.com",
        password: "Makuro_9090"
      );

      
    } on FirebaseAuthException catch (e) {
      if (e.code == 'weak-password') {
        print('The password provided is too weak.');

      } else if (e.code == 'email-already-in-use') {

        print('The account already exists for that email.');
      }
    } catch (e) {

      print(e);
    }
  }
}


class TryToRegister extends StatelessWidget {
  TryToRegister({ Key? key }) : super(key: key);

  final emailCon = TextEditingController();
  final passCon = TextEditingController();

  @override
  Widget build(BuildContext context) => 
  Scaffold(
    body: SafeArea(
      child: Column(
        children: [
          Text("Register",
            style: TextStyle(
              fontSize: 42
            ),
          ),
          TextFormField(
            controller: emailCon,
            decoration: InputDecoration(
              label: Text("email")
            ),
          ),
          TextFormField(
            controller: passCon,
            decoration: InputDecoration(
              label: Text("password")
            ),
          ),
          OutlinedButton(
            onPressed: (){
              tryRegister(emailCon.text, passCon.text);
            }, 
            child: Text("REGISTER")
          ),
          TextButton(
            onPressed: (){
              Get.to(UserLogin());
            }, 
            child: Text("if you have already account , just loginz")
          )
        ],
      )
    ),
  );


  tryRegister(String email, String password)async{

    try {
      UserCredential userCredential = await FirebaseAuth.instance.createUserWithEmailAndPassword(
        email: email,
        password: password
      );

      
    } on FirebaseAuthException catch (e) {
      if (e.code == 'weak-password') {
        print('The password provided is too weak.');

      } else if (e.code == 'email-already-in-use') {

        print('The account already exists for that email.');
      }
    } catch (e) {

      print(e);
    }
  }
}




class UserLogin extends StatelessWidget {
  UserLogin({ Key? key }) : super(key: key);

  final emailCon = TextEditingController();
  final passCon = TextEditingController();

  @override
  Widget build(BuildContext context) => 
  Scaffold(
    body: SafeArea(
      child: Column(
        children: [
          Text("LOGIN",
            style: TextStyle(
              fontSize: 42
            ),
          ),
          TextFormField(
            controller: emailCon,
            decoration: InputDecoration(
              label: Text("email")
            ),
          ),
          TextFormField(
            controller: passCon,
            decoration: InputDecoration(
              label: Text("password")
            ),
          ),
          OutlinedButton(
            onPressed: (){
              tryLogin(emailCon.text, passCon.text);
            }, 
            child: Text("LOGIN")
          )
        ],
      )
    ),
  );

  tryLogin(String email, String passwor)async{

    try {
      UserCredential userCredential = await FirebaseAuth.instance.signInWithEmailAndPassword(
        email: "malik@gmail.com",
        password: "Makuro_9090"
      );
    } on FirebaseAuthException catch (e) {
      if (e.code == 'user-not-found') {

        print('No user found for that email.');
      } else if (e.code == 'wrong-password') {

        print('Wrong password provided for that user.');
      }
    }
  }
}


class SuccessLoginOrRegister extends StatelessWidget {
  const SuccessLoginOrRegister({ Key? key }) : super(key: key);

  @override
  Widget build(BuildContext context) => 
  Scaffold(
    body: SafeArea(
      child: Column(
        children: [
          Text("you are already success auth",
            style: TextStyle(
              fontSize: 40
            ),
          )
        ],
      )
    ),
  );
}
```


```yaml
get: ^4.3.8
firebase_core: any
firebase_auth: ^3.1.3
```
