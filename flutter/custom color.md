<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [flutter custom color](#flutter-custom-color)
    - [keterangan](#keterangan)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# flutter custom color

```dart

static Map<int,Color> theColor = {
    50:new Color(0xff273574).withOpacity(0.1),
    100:new Color(0xff273574).withOpacity(0.2),
    200:new Color(0xff273574).withOpacity(0.3),
    300:new Color(0xff273574).withOpacity(0.4),
    400:new Color(0xff273574).withOpacity(0.5),
    500:new Color(0xff273574).withOpacity(0.6),
    600:new Color(0xff273574).withOpacity(0.7),
    700:new Color(0xff273574).withOpacity(0.8),
    //800:Colors.red.withOpacity(.9),
    //900:Colors.red.withOpacity(1)
  };
  
  // untuk primary swatch
   MaterialColor customColor = new MaterialColor(0xff273574,theColor);
   
```

### keterangan

> #273574 / 273574 menjadi 0Xff273574
