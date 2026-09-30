<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [garis putus putus](#garis-putus-putus)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# garis putus putus 

```dart

class GarisPutusPutus extends StatelessWidget{

  final tinggi;
  final warna;

  const GarisPutusPutus({Key key, this.tinggi = 1.0, this.warna = Colors.grey}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // TODO: implement build

    return LayoutBuilder(
      builder: (BuildContext context,BoxConstraints constrain){

        final lebarKotak = constrain.constrainWidth();
        final lebarPutusPutus = 10.0;
        final tinggiPutusPutus = tinggi;
        final banyakPutusPutus = (lebarKotak /(2*lebarPutusPutus)).floor();


        return Flex(
          children: List.generate(banyakPutusPutus, (index) =>SizedBox(
            width: lebarPutusPutus,
            height: tinggiPutusPutus,
            child: DecoratedBox(
              decoration: BoxDecoration(
                color: warna,
              ),
            ),
          )),
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          direction: Axis.horizontal,
        );
      },
    );
  }

}

```
