# Persamaan setState di stateless wwidget

```dart

void main(){
    runApp(MaterialApp(home: TestPage(),));
}

class TestPage extends StatelessWidget {
    // final because a Widget is immutable (remember?)
    final bag = {"first": true};

    @override
    Widget build(BuildContext context){
        return Scaffold(
            appBar: AppBar(title: Text('Stateless ??')),
            body: Container(
                child: Center(
                    child: GestureDetector(
                        child: Container(
                            width: 50.0,`enter code here`
                            height: 50.0,
                            color: bag["first"] ? Colors.red : Colors.blue,
                        ),
                        onTap: (){
                            bag["first"] = !bag["first"];
                            //
                            // This is the trick
                            //
                            (context as Element).markNeedsBuild();
                        }
                    ),
                ),
            ),
        );
    }
}


```
