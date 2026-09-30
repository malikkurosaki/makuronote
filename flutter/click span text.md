<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [click span text flutter](#click-span-text-flutter)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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
