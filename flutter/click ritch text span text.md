<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [click ritch text span text](#click-ritch-text-span-text)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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
