# click ritch text span text

```dart
Text.rich(
                  TextSpan(
                    text: 'silahkan register jika anda belum memilikiakun',
                    children: [
                      TextSpan(
                        text: ' register'.toUpperCase(),
                        style: TextStyle(
                          color: Colors.blue,
                          fontWeight: FontWeight.bold
                        ),
                        recognizer: new TapGestureRecognizer()..onTap = (){
                          Navigator.push(context, MaterialPageRoute(builder: (context) => AuthRegister(),));
                        }
                      )
                    ]
                  )
                )
```
