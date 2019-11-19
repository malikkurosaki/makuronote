# flutter hero layout animasi

### widget

```dart

Container(
          child: InkWell(
            child: Hero(
              tag: "satu",
              child: CircleAvatar(
                child: Icon(Icons.account_balance_wallet),
              ),
            ),
            onTap: ()=>_MyHero(context),
          ),
```

### tujuannya

```dart


void _MyHero(BuildContext context){
  Navigator.of(context).push(MaterialPageRoute(builder: (context)=>Scaffold(
    body: Center(
      child: Container(
        color: Colors.red,
        child: Hero(
          tag: "satu",
          child: CircleAvatar(
            child: Icon(Icons.account_balance_wallet),
          ),
        ),
      ),
    ),
  )));
}

```


### tambah durasi

```dart


void _MyHero(BuildContext context){
  Navigator.push(context, PageRouteBuilder(
    transitionDuration: Duration(seconds: 1),
    pageBuilder: (_,__,___)=>Scaffold(
      appBar: AppBar(
        title: Text("Presto Mobile"),
      ),
      body: Center(
        child: Container(
          color: Colors.red,
          child: Hero(
            tag: "satu",
            child: CircleAvatar(
              child: Icon(Icons.account_balance_wallet),
            ),
          ),
        ),
      ),
    )
  ));
}

```
