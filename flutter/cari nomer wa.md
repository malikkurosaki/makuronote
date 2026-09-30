<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [cari nomer wa](#cari-nomer-wa)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# cari nomer wa

dependency
```yaml
easy_permission_validator: ^2.0.1
contacts_service: ^0.4.6
```

__permisi__
```dart
_permissionRequest() async {
  final permissionValidator = EasyPermissionValidator(
    context: context,
    appName: 'Easy Permission Validator',
  );
  var result = await permissionValidator.camera();
  if (result) {
    // Do something;
  }
}
```


__cari kontak__
```dart
 Iterable<Contact> contacts = await ContactsService.getContacts(); 
 final ct = contacts.where((element) => element.androidAccountName.toLowerCase() == "whatsapp").toList();
```

