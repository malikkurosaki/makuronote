<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [input form next focus](#input-form-next-focus)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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
