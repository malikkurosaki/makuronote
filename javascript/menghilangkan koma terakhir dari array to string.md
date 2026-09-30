<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [menghilangkan koma terakhir dari array to string](#menghilangkan-koma-terakhir-dari-array-to-string)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# menghilangkan koma terakhir dari array to string

```javascript
pisah.toString().replace(/,(?=[^,]*$)/, '')
```
