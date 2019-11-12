# mudah membuat chart di flutter 

` chars_flutter:`

```dart

class ClicksPerYear {
  final String year;
  final int clicks;
  final charts.Color color;

  ClicksPerYear(this.year, this.clicks, Color color)
      : this.color = new charts.Color(
      r: color.red, g: color.green, b: color.blue, a: color.alpha);
}

class SimplaChart extends StatelessWidget{

  static  List<ClicksPerYear> data = [
    new ClicksPerYear('2016', 12, Colors.red),
    new ClicksPerYear('2017', 42, Colors.yellow),
    new ClicksPerYear('2018', _counter, Colors.green),
  ];

  static List<charts.Series<ClicksPerYear, String>> series = [
    new charts.Series(
      id: 'Clicks',
      domainFn: (ClicksPerYear clickData, _) => clickData.year,
      measureFn: (ClicksPerYear clickData, _) => clickData.clicks,
      colorFn: (ClicksPerYear clickData, _) => clickData.color,
      data: data,
    ),
  ];


  static charts.BarChart chart = new charts.BarChart(series);
  var chartWidget = new Padding(
    padding: new EdgeInsets.all(32.0),
    child: new SizedBox(
      height: 200.0,
      child: chart,
    ),
  );

  static int _counter;
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return chartWidget;
  }

}

```
