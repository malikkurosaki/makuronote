

import 'dart:io';

import 'dart:typed_data';
import 'package:sovana/makuro_helper/database/makuro_model.dart';
import 'package:sovana/makuro_helper/database/makuro_type.dart';

main() async{

 
  // final modelProduction =  MakuroHelper(
  //   title: "Production",
  //   tableName: "ModelProduction",
  //   listModel: [
  //     MakuroModel(name: "id",type: MakuroType.INTEGER, primarykey: true, autoIncrement: true),
  //     MakuroModel(name: "name"),
  //     MakuroModel(name: "customer"),
  //     MakuroModel(name: "productionCode"),
  //     MakuroModel(name: "style"),
  //     MakuroModel(name: "material"),
  //     MakuroModel(name: "color"),
  //     MakuroModel(name: "size"),
  //     MakuroModel(name: "productionPrice", type: MakuroType.INTEGER),
  //     MakuroModel(name: "tailorPrice",  type: MakuroType.INTEGER),
  //     MakuroModel(name: "cutingPrice", type: MakuroType.INTEGER),
  //     MakuroModel(name: "naskatPrice",  type: MakuroType.INTEGER),
  //     MakuroModel(name: "foto", type: MakuroType.IMAGE),
  //     MakuroModel(name: "description",  ),
  //   ]
  // );

  // await modelProduction.build();

  // final customer = MakuroHelper(
  //   title: "Employee",
  //   listModel: [
  //     MakuroModel(name: "id", primarykey: true, autoIncrement: true)
  //   ]
  // );

  final datanya = await File('xfile.dart').readAsString();
  
}



class MakuroHelper{
  final String? tableName;
  final List<MakuroModel>? listModel;
  final bool isRelationTable;
  final String? relationTableName;
  final String? title;

  MakuroHelper({required this.title, this.tableName, this.listModel, this.isRelationTable = false, this.relationTableName});

  build()async{
    var file =  await File('lib/models/${tableName!.toLowerCase()}.dart').writeAsString(classModel);
  }

  olahQuery() {
    
    String data = "";
    data += "CREATE TABLE IF NOT EXISTS $tableName (";
    for(final ls in listModel!)
    data += "${ls.hasilQuery}, ";

    data += " createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP)";
    return data.replaceAll(", )", ")");
  }

  String get classModel => 
"""
$import
class $tableName extends MakuroDb{
  $searchValue
  ${textController()}
  $relationTable
  $lsData
  ${declaration()}
  ${constructor()}
  ${fromJson()}
  ${toJson()}
  $queryBuilder
  ${listForm()}
  $createNewButton
  $loadData 
  ${onSave()}
  ${widgetSearch()}
  ${showUpdateData()}
  $deleteData
  $updateData
  $modelUpdateData
  $listWidget
  $buttonCheckList
}
""";

  String get searchValue => "final searchValue = '""'.obs;";
  String get relationTable => isRelationTable? "\tList<$relationTableName>? ${relationTableName!.toLowerCase()};\n": "";

  String textController(){
    String data = "";
    for(final d in listModel!)
    data += d.type.dbType == "BLOB"? "\n\tfinal ${d.name}Controller = <Uint8List>[].obs;" :"\n\tfinal ${d.name}Controller = TextEditingController();";
    
    return data;
  }

  String declaration(){
    String data = "";
    for(final d in listModel!)
    data += "\n\t${d.type.modelType}? ${d.name};";

    data += "\n\tString? createAt;";
    return data;
  }

  String constructor(){
    String data = "";
    data += "\n\t$tableName({";
    for(final d in listModel!)
    data += 'this.${d.name}, ';
    
    data += isRelationTable? "this.${relationTableName!.toLowerCase()}": "";
    data += "this.createAt,";
    data += "});\n\n";

    return data;
  }

  String fromJson(){
    String data = "";
    data += "$tableName.fromJson(Map<String, dynamic> json) {\n";
    for(final d in listModel!)
    data += "\t\t${d.name} = json['${d.name}'];\n";

    data += isRelationTable? "\t\t${relationTableName!.toLowerCase()} = json['${relationTableName!.toLowerCase()}'] != null? (json['${relationTableName!.toLowerCase()}'] as List).map((e) => $relationTableName.fromJson(e)).toList() : null;\n": "";
    data += "\t\tcreateAt= json['createAt'];\n";
    data += "  }\n\n";
    return data;
  }

  String toJson(){
    String data = "";
    data += "Map<String, dynamic> toJson() {";
    data += "\n\tfinal Map<String, dynamic> data = new Map<String, dynamic>();\n";
    for(final d in listModel!)
    data += "\t\tdata['${d.name}'] = this.${d.name};\n";

    data += "   return data;\n";
    data += "  }\n\n";
    return data;
  }
  
  String get queryBuilder => 'String queryBuilder = "$hasilQuery";\n\n';

  String listForm(){
    String data = "";
    data += "\n\tList<Widget> get listForm => [";
    for(final d in listModel!)
    data +=  d.name == "id"? "": d.type.dbType == "BLOB"? "\n\tSelectImage(imageController: ${d.name}Controller,image: (value) => ${d.name}Controller.assignAll([value])),":  "\n${singleForm(d)}";

    data += "\n\t];";
    return data;
  }

  
  String cleanController(){
    
    String data = "";
    for(final d in listModel!)
    data += d.type.dbType == "BLOB"? "\n\t\t\t\t${d.name}Controller.clear();": "\n\t\t\t\t${d.name}Controller.text = '';";
    return data;
  }
  String get createNewButton =>
"""

  Widget createNewButton() =>
  Container(
    padding: EdgeInsets.all(8),
    child: OutlinedButton(
      onPressed: () {
        ${cleanController()}
        Get.bottomSheet(
          DraggableScrollableSheet(
            builder: (context, scrollController) => 
            Container(
              color: Colors.white,
              child: Column(
                children: [
                  Row(
                    children: [
                      BackButton(),
                      Text("create new $title")
                    ],
                  ),
                  Flexible(
                    child: ListView(
                      physics: BouncingScrollPhysics(),
                      controller: scrollController,
                      children: listForm
                    )
                  ),
                  Container(
                    width: double.infinity,
                    padding: EdgeInsets.all(8),
                    child: OutlinedButton(
                      child: Text("save"),
                      onPressed: onSave,
                    ),
                  )
                ],
              ),
            )
          ),
          isScrollControlled: true
        );
      },
      child: Container(
        width: double.infinity,
        child: Text("create new $tableName"),
      )
    ),
  );
""";



  String get lsData => "static final lsData = <$tableName>[].obs;";

  String get loadData => 
"""

  loadData()async{
    final data = await this.findAll();
    lsData.assignAll(data.map((e) => $tableName.fromJson(e)).toList());
  }
""";

  String onSave(){
    String data = "";
     data += 
"""

  onSave()async{
\t\tfinal values = $tableName(
""";
    for(final d in listModel!)
    data += d.name == "id"? "": d.type.dbType == "INTEGER"? "\n\t\t\t${d.name}: int.parse(${d.name}Controller.text)," : d.type.dbType == "BLOB"? "\n\t\t\t${d.name}: ${d.name}Controller[0],":"\n\t\t\t${d.name}: ${d.name == "id"? "null": '${d.name}Controller.text'},";

    data += "\n";
    data += "    );\n";
    data += "    final id = await this.insert(values.toJson());\n";
    data += "    await loadData();\n";
    data += "    Get.back();\n";
    data += "  }\n\n";

    return data;
  }

  String widgetSearch() {
    String data  = "";
    data += 
"""

  Widget searchWidget() =>
  Container(
    padding: EdgeInsets.all(8),
    child: TextFormField(
      onChanged: (value) => searchValue.value = value,
      decoration: InputDecoration(
        isDense: true,
        border: OutlineInputBorder(),
        prefixIcon: Icon(Icons.search),
        labelText: "search"
      ),
    ),
  );
""";

    return data;
  }

  String showUpdateData(){
    String data = "";
    data += "\n\tshowUpdateData($tableName model)async{";
    for(final d in listModel!)
    data += d.type.dbType == "INTEGER"? "\n\t\t${d.name}Controller.text = model.${d.name}.toString();":  d.type.dbType == "BLOB"? "\n\t\t${d.name}Controller.assignAll([model.${d.name}!]);"  :"\n\t\t${d.name}Controller.text = model.${d.name}!;";

    data += "\n\t\tGet.bottomSheet(modalUpdate(model),isScrollControlled: true);";
    data += "\n\t\t";
    data += "\n\t}";

    return data;
  }

  String get deleteData => 
"""

  deleteData($tableName model)async{
    final int id = await this.delete(model.id!);
    loadData();
    Get.back();
  }
""";

  String get updateData =>
"""

  updateData($tableName model)async{
    final values = $tableName(
       ${olahValueUpdate(listModel!)}
    );

    final int id = await this.update(values.toJson());
    loadData();
    Get.back();
  }
""";

  String olahValueUpdate(List<MakuroModel> lsModel){
    String data = "";
    for(final d in lsModel)
    data += d.type.dbType == "INTEGER"? "\n\t\t\t${d.name}: int.parse(${d.name}Controller.text),":  d.type.dbType == "BLOB"? "\n\t\t\t${d.name}: ${d.name}Controller[0]," : d.name == "id"? "\n\t\t\t${d.name}: model.id!," :"\n\t\t\t${d.name}: ${d.name}Controller.text,";
    return data;
  }

  String get modelUpdateData =>
"""

  modalUpdate($tableName model) =>
  DraggableScrollableSheet(
    builder: (context, scrollController) => 
    Container(
      color: Colors.white,
      child: Column(
        children: [
          Row(
            children: [
              BackButton(),
              Text("edit $title")
            ],
          ),
          Flexible(
            child: ListView(
              physics: BouncingScrollPhysics(),
              controller: scrollController,
              children: listForm,
            )
          ),
          Container(
            padding: EdgeInsets.all(8),
            child: Row(
              children: [
                Expanded(
                  child: TextButton(
                    child: Text("delete"),
                    onPressed: () =>  deleteData(model),
                  )
                ),
                Expanded(
                  child: OutlinedButton(
                    child: Text("update"),
                    onPressed: () => updateData(model),
                  )
                )
              ],
            ),
          )
        ],
      ),
    ),
  );
""";

  String get listWidget =>
"""

  Widget get listWidget =>
  FutureBuilder(
    future: loadData(),
    builder: (context, snapshot) => 
    snapshot.connectionState != ConnectionState.done?
    Center(child: CircularProgressIndicator(),)
    : Column(
      children: [
        Flexible(
          child: Obx(
            () => 
            ListView(
              physics: BouncingScrollPhysics(),
              children: [
                for(final model in lsData)
                Visibility(
                  visible: model.name!.contains(searchValue.value),
                  child: ListTile(
                    onTap: () => showUpdateData(model),
                    title: Text(model.name!),
                  ),
                )
              ],
            )
          )
        )
      ],
    ),
  );
""";


String import = 
"""
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:sovana/components/select_image.dart';
import 'package:sovana/components/single_form.dart';
import 'package:flutter/widgets.dart';
import 'dart:typed_data';
import 'package:sovana/makuro_helper/database/makuro_db.dart';
import 'package:image_picker/image_picker.dart';
""";
  
  
  String singleForm(MakuroModel d) =>
"""
    SingleForm(
      controller: ${d.name}Controller,
      inputType: ${d.type.dbType == "NUMERIC"? "TextInputType.number": d.type.dbType == "INTEGER" ? "TextInputType.number": "TextInputType.text"},
      lable: "${d.name}",
    ),
""";

  String get buttonCheckList => 
  """

  final checkListComparasi = <$tableName>[].obs;
  Widget checkListButton() =>
  FutureBuilder(
    future: loadData(),
    builder: (context, snapshot) => 
    snapshot.connectionState != ConnectionState.done?
    Center(child: CircularProgressIndicator(),)
    : Container(
      child: OutlinedButton(
        child: Text("choose"),
        onPressed: () => Get.bottomSheet(
          DraggableScrollableSheet(
            builder: (context, scrollController) => 
            Container(
              color: Colors.white,
              child: Column(
                children: [
                  Row(
                    children: [
                      BackButton(),
                      Text("select $title")
                    ],
                  ),
                  Flexible(
                    child: Obx(
                      () =>
                      ListView(
                        controller: scrollController,
                        physics: BouncingScrollPhysics(),
                        children: [
                          for(final model in lsData)
                          ListTile(
                            onTap: () {
                              if(checkListComparasi.map((element) => element.name).toList().contains(model.name)){
                                checkListComparasi.removeWhere((element) => element.id == model.id);
                              }else{
                                checkListComparasi.add(model);
                              }
                              
                            },
                            leading: Stack(
                              alignment: Alignment.center,
                              children: [
                                Icon(Icons.crop_square, size: 34,),
                                Visibility(
                                  visible: checkListComparasi.map((element) => element.name).toList().contains(model.name),
                                  child: Icon(Icons.check, size: 24,)
                                )
                              ],
                            ),
                            title: Text(model.name!),
                          )
                        ],
                      )
                    )
                    
                  )
                ],
              ),
            )
          ),
          isScrollControlled: true
        ),
      ),
    ),
  );
  """;  



  // String get hasilModel => olahModel();
  String get hasilQuery => olahQuery();
}









