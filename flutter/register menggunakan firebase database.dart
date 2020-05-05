# register menggunakan firebase database

```yaml
sqflite:
firebase_core: ^0.2.5
firebase_database:
```

_login_

```dart
import 'dart:convert';

import 'package:firebase_database/firebase_database.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:netbook/controller/c_database.dart';
import 'package:netbook/model/m_users.dart';
import 'package:provider/provider.dart';

class VHalamanLogin extends StatelessWidget{

  static final lsTitle = ['email','pass'];
  final lsController = List.generate(lsTitle.length, (index) => TextEditingController());
  final _keyForm = GlobalKey<FormState>();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: Card(
            child: Container(
              padding: EdgeInsets.all(8),
              child: Column(
                children: [
                  Text('login'.toUpperCase()),
                  Form(
                    key: _keyForm,
                    child: Column(
                      children: List.generate(lsTitle.length, (index) => TextFormField(
                        controller: lsController[index],
                        validator: (value) => value.isEmpty?'no field empty':null,
                        decoration: InputDecoration(
                          labelText: lsTitle[index]
                        ),
                      )),
                    ),
                  ),
                  SizedBox(
                    height: 50,
                  ),
                  Container(
                    width: double.infinity,
                    child: FlatButton(
                      child: Text('login'.toUpperCase()),
                      color: Colors.blue,
                      onPressed: () async{
                        if(_keyForm.currentState.validate()){
                          FirebaseDatabase fdb = FirebaseDatabase.instance;
                          Query qr = fdb.reference().child('users').orderByChild('c_email').equalTo(lsController[0].text);
                          DataSnapshot snap = await qr.once();
                          if(snap.value == null){
                            showDialog(
                              context: context,
                              child: AlertDialog(
                                title: Text('info'),
                                content: Text('no data with your email, or create one'),
                                actions: [
                                  FlatButton(
                                    child: Text('NO'),
                                    onPressed: () => Navigator.of(context,rootNavigator: true).pop('dialog'),
                                  ),
                                  FlatButton(
                                    child: Text('YES'),
                                    onPressed: () {
                                     Navigator.pushNamed(context, '/register');
                                    },
                                  )
                                ],
                              )
                            );
                            return;
                          }
                          
                          MUsers mUsers = new MUsers();
                          Map<dynamic,dynamic> dataNya = snap.value;
                          dataNya.forEach((key, value) {
                            mUsers = MUsers.fromJson(jsonDecode(jsonEncode(value)));
                          });
                          if(lsController[1].text != mUsers.cPassword){
                            showDialog(
                              context: context,
                              child: AlertDialog(
                                title: Text('info'),
                                content: Text('email or passwor not match'),
                                actions: [
                                  FlatButton(
                                    child: Text('OK'),
                                    onPressed: () => Navigator.of(context,rootNavigator: true).pop('dialog'),
                                  )
                                ],
                              )
                            );
                            return;
                          }
                          CDatabase cDb = Provider.of<CDatabase>(context,listen: false);
                          int berapa = await cDb.insertLocalUser(mUsers);
                          if(berapa != null) Navigator.pushReplacementNamed(context, '/myhome');
                        }
                      },
                    ),
                  )
                ],
              ),
            ),
          ),
        ),
      )
    );
  }
}
```

_register_

```dart
import 'package:firebase_database/firebase_database.dart';
import 'package:flutter/material.dart';
import 'package:netbook/controller/c_database.dart';
import 'package:netbook/model/m_users.dart';
import 'package:provider/provider.dart';

class VHalamanRegister extends StatelessWidget{
  final _keyForm = GlobalKey<FormState>();
  static final _lsTitleRegister = ['user name','email','phone','address','password'];
  final _lsFornRegister = List.generate(_lsTitleRegister.length, (index) => TextEditingController());
  @override
  Widget build(BuildContext context) {
    print('register');
    return Scaffold(
      backgroundColor: Colors.blueGrey[100],
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Text('register'.toUpperCase(),
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 5
                  ),
                ),
              ),
              Card(
                child: Container(
                  padding: EdgeInsets.all(32),
                  child: Form(
                    key: _keyForm,
                    child: Column(
                      children: List.generate(_lsTitleRegister.length, (index) => Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: TextFormField(
                          controller: _lsFornRegister[index],
                          validator: (value) => value.isEmpty?'em empty field':null,
                          decoration: InputDecoration(
                            contentPadding: EdgeInsets.all(8),
                            labelText: _lsTitleRegister[index]
                          ),
                        ),
                      )),
                    ),
                  ),
                ),
              ),
              Container(
                padding: EdgeInsets.all(8),
                width: double.infinity,
                child: FlatButton(
                  color: Colors.blue,
                  child: Text('register'.toUpperCase()),
                  onPressed: () async{
                    if(_keyForm.currentState.validate()){
                      MUsers mUsers = MUsers(
                        cName: _lsFornRegister[0].text,
                        cEmail: _lsFornRegister[1].text,
                        cPhone: _lsFornRegister[2].text,
                        cAddress: _lsFornRegister[3].text,
                        cPassword: _lsFornRegister[3].text
                      );

                      FirebaseDatabase fDB = FirebaseDatabase.instance;
                      Query qr = fDB.reference()
                      .child('users')
                      .orderByChild('c_email')
                      .equalTo(mUsers.cEmail);

                      DataSnapshot snp = await qr.once();
                      if(snp.value != null){
                        showDialog(
                          context: context,
                          child: AlertDialog(
                            title: Text('info'),
                            content: Text('your email has already registered, create new one or just login'),
                            actions: [
                              FlatButton(
                                child: Text('no'.toUpperCase()),
                                onPressed: () => Navigator.of(context,rootNavigator: true).pop('dialog'),
                              ),
                              FlatButton(
                                child: Text('ok'.toUpperCase()),
                                onPressed: () {
                                  Navigator.of(context,rootNavigator: true).pop('dialog');
                                  Navigator.pushReplacementNamed(context, '/login');
                                },
                              )
                            ],
                          )
                        );

                        return;
                      }
                      await fDB.reference().child('users').push().set(mUsers.toJson());
                      CDatabase db =  Provider.of<CDatabase>(context,listen: false);
                      int berapa = await db.insertLocalUser(mUsers);
                      if(berapa != null){
                        Navigator.pushReplacementNamed(context, '/myhome');
                      }
                      
                    }
                  },
                ),
              )
            ],
          ),
        ),
      )
    );
  }
}
```
