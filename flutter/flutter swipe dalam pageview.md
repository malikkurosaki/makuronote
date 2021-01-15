# flutter swipe dalam pageview

```js
class SetahunView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      child: GetX(
        initState: (_) => CalendarCtrl.init(),
        builder: (controller) => CalendarCtrl.lsCalendar.isEmpty? Text('loading ...'):
        PageView(
          controller: CalendarCtrl.controller1,
          children: List.generate(CalendarCtrl.lsCalendar.length, (index) => 
            PageView(
              controller: CalendarCtrl.controller2,
              physics: ScrollPhysics(),
              pageSnapping: true,
              children: List.generate(CalendarCtrl.lsCalendar[index].length, (idx) => 
                Listener(
                  onPointerMove: (event) {
                    if(event.delta.dx > 6 && idx == 0){
                      CalendarCtrl.controller1.previousPage(duration: Duration(milliseconds: 100), curve: Curves.easeInToLinear);
                      
                    }

                    if(event.delta.dx < -6 && idx == CalendarCtrl.lsCalendar[index].length - 1){
                      CalendarCtrl.controller1.nextPage(duration: Duration(milliseconds: 100), curve: Curves.easeInToLinear);
                    }
                  },
                  child: Container(
                    alignment: Alignment.topLeft,
                    child: Column(
                      children: [
                        Container(
                          margin: EdgeInsets.only(bottom: 1),
                          color: Colors.white,
                          padding: EdgeInsets.all(8),
                          child: Row(
                            children: List.generate(7, (i) => 
                              Expanded(
                                child: Text(CalendarCtrl.lsCalendar[index][idx][i]['value'].toString(),
                                  style: TextStyle(
                                    color: CalendarCtrl.lsCalendar[index][idx][i]['jenis'] == 1? Colors.black : Colors.grey[300],
                                    fontWeight: FontWeight.w700
                                  ),
                                )
                              )
                            )
                          ),
                        ),
                        Flexible(
                          child: Container(
                            color: Colors.white,
                            height: double.infinity,
                            width: double.infinity,
                            child: Text("apa")
                          )
                        )
                      ],
                    ),
                  ),
                )
              ),
            )
          ),
        )
      )
    );
  }
}

```
