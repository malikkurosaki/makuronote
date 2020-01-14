# metode provider baru

```dart
class _MyHome extends State<MyHome> {

  GetContent getContent;
  GetContact getContact;
  Aktifitas aktifitas;
  final ValueNotifier<bool> _loading = ValueNotifier<bool>(false);
  final ValueNotifier<String> _namaContact = ValueNotifier<String>("Pilih Contact");
  final ValueNotifier<String> _emailContact = ValueNotifier<String>("");

  var _kunciScafold = GlobalKey<ScaffoldState>();
  var _kunciScafoldKirim = GlobalKey<ScaffoldState>();

  List<PojoGetContent> lsContent;
  List<PojoGetContact> lsContact;

  @override
  void didChangeDependencies() {
    // TODO: implement didChangeDependencies
    super.didChangeDependencies();
    final getContent = Provider.of<GetContent>(context);
    final getContact = Provider.of<GetContact>(context);
    final aktifitas = Provider.of<Aktifitas>(context);

    // get content
    if(this.getContent != getContent){
      this.getContent = getContent;
      Future.microtask(()=>getContent.getDataContent());
    }

    // get contact
    if(this.getContact != getContact){
      this.getContact = getContact;
      Future.microtask(()=>getContact.getDataContact());
    }

    if(this.aktifitas != aktifitas){
      this.aktifitas = aktifitas;
    }
  }

```
