<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [sipe right swipe left](#sipe-right-swipe-left)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# sipe right swipe left

```dart
Flexible(
  child: Listener(
    onPointerMove: (event) {

    },
    child: Text("apap"),
  )
),


/// controller

static olahBulanBerjalan(PointerMoveEvent event, int idx, int index){
  if(event.delta.dx > 6 && idx == 0){
    CalendarCtrl.controller1.previousPage(duration: Duration(milliseconds: 300), curve: Curves.easeInToLinear);
  }

  if(event.delta.dx < -6 && idx == CalendarCtrl.lsCalendar[index]['week'].length - 1){
    CalendarCtrl.controller1.nextPage(duration: Duration(milliseconds: 300), curve: Curves.easeInToLinear);

  }
}
```
