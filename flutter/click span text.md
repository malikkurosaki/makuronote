# click span text flutter

```dart
child: RichText(
                        text: TextSpan(
                          text: 'atau jika anda tidak memiliki akun , anda bisa langsung register',
                          style: TextStyle(color: Colors.black),
                          children: [
                            TextSpan(
                              text: ' REGISTER',
                              style: TextStyle(color: Colors.amber),
                              recognizer: new TapGestureRecognizer()..onTap = ()=> print('apa kabar')
                            )
                          ]
                        ),
                      )
```
