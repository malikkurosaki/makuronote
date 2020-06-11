# input form next focus

```dart
Form(
                  key: _keyForm,
                  child: Column(
                    children: List.generate(_lsTitleForm.length, (index)
                     => TextFormField(
                       textInputAction: TextInputAction.next,
                       onFieldSubmitted: (value) => FocusScope.of(context).nextFocus(),
                       validator: (val) => val.isEmpty?'jangan ada yang kosong':null,
                       controller: _lsControler[index],
                       decoration: InputDecoration(
                         labelText: _lsTitleForm[index]
                       ),
                     )
                    ),
                  ),
                ),
```
