# flutter swipe increment 

```dart
Flexible(
  child: Listener(
    onPointerMove: (event){
      if(event.delta.dx > 6) CalendarCtrl.kemana.value = 1;
      if(event.delta.dx < -6) CalendarCtrl.kemana.value = 2;
    },
    onPointerDown: (event) => CalendarCtrl.kemana.value = 0,
    onPointerUp: (event){
      if(CalendarCtrl.kemana.value == 1) CalendarCtrl.contoh.value --;
      if(CalendarCtrl.kemana.value == 2) CalendarCtrl.contoh.value ++; 
      if(CalendarCtrl.contoh.value >= 12) CalendarCtrl.contoh.value = 0;
      if(CalendarCtrl.contoh.value < 0) CalendarCtrl.contoh.value = 12;
    },
    child: Center(
      child: Container(
        height: double.infinity,
        width: double.infinity,
        child: Obx( () => 
          Text(CalendarCtrl.contoh.value.toString(),
            style: TextStyle(
              fontSize: 24,
              color: Colors.white
            ),
          )
        )
      ),
    ),
  )
),
```
                              
