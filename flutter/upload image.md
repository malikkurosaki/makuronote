```dart
import 'dart:html';
import 'dart:io';
import 'dart:typed_data';
import 'package:client/util_http.dart';
import 'package:client/util_load.dart';
import 'package:client/util_pref.dart';
import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';
import 'package:responsive_builder/responsive_builder.dart';

class ProductCreate extends StatelessWidget {
  ProductCreate({Key? key, this.product}) : super(key: key);
  final Map? product;
  final ImagePicker _picker = ImagePicker();
  final hasilGambar = Uint8List(0).obs;
  final stock = false.obs;
  final customPrice = false.obs;
  final withImage = false.obs;
  
  final nameController = TextEditingController();
  final priceController = TextEditingController();
  final descriptionController = TextEditingController();
  final stockController = TextEditingController();
  final imageController = TextEditingController();
  final outletController = TextEditingController();
  final categoryController = TextEditingController();
  

  final body = {
    "name": "",
    "price": "0",
    "stock": "0",
    "description": "",
    "image": "",
    "outletId": "",
    "categoryId": "",

  };

  onLoad()async{

  }

  @override
  Widget build(BuildContext context) {
    return ResponsiveBuilder(
      builder: (context, sizingInformation) {
        return ListView(
          children: [
            Wrap(
              children: [
                SizedBox(
                  width: sizingInformation.isMobile ? double.infinity : 360,
                  child: Card(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Text(
                            "form create product",
                            style: TextStyle(
                              fontSize: 32,
                            ),
                          ),
                        ),
                        // name
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: TextFormField(
                            controller: nameController,
                            onChanged: (value) => body["name"] = value,
                            decoration: InputDecoration(
                                labelText: "Name",
                                hintText: "Product Name",
                                fillColor: Colors.grey[100],
                                filled: true,
                                border: OutlineInputBorder(borderSide: BorderSide.none)),
                          ),
                        ),
                        // price
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: TextFormField(
                            controller: priceController,
                            onChanged: (value) => body["price"] = value.toString(),
                            decoration: InputDecoration(
                                labelText: "Price",
                                hintText: "Product Price",
                                fillColor: Colors.grey[100],
                                filled: true,
                                border: OutlineInputBorder(borderSide: BorderSide.none)),
                          ),
                        ),
                        // description
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: TextFormField(
                            controller: descriptionController,
                            decoration: InputDecoration(
                                labelText: "Description",
                                hintText: "Product Description",
                                fillColor: Colors.grey[100],
                                filled: true,
                                border: OutlineInputBorder(borderSide: BorderSide.none)),
                          ),
                        ),

                        // dropdown choose outlet by name
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: DropdownButtonFormField<Map>(
                            decoration: InputDecoration(
                                labelText: "Outlet",
                                hintText: "Choose Outlet",
                                fillColor: Colors.grey[100],
                                filled: true,
                                border: OutlineInputBorder(borderSide: BorderSide.none)),
                            items: [
                              for (final out in UtilPref.outlets)
                                DropdownMenuItem(
                                    value: out,
                                    child: Text(
                                      out['name'],
                                    ))
                            ],
                            onChanged: (value) {
                              body['outletId'] = value!['id'];
                              outletController.text = value['name'];
                            },
                          ),
                        ),
                        // dropdown choose category by name
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: DropdownButtonFormField<Map>(
                            decoration: InputDecoration(
                                labelText: "Category",
                                hintText: "Choose Category",
                                fillColor: Colors.grey[100],
                                filled: true,
                                border: OutlineInputBorder(borderSide: BorderSide.none)),
                            items: [
                              for (final cat in UtilPref.categories)
                                DropdownMenuItem(value: cat, child: Text(cat['name'].toString()))
                            ],
                            onChanged: (value) {
                              body['categoryId'] = value!['id'];
                              categoryController.text = value['name'];
                            },
                          ),
                        ),

                        // image picker button
                      ],
                    ),
                  ),
                ),
                Obx(
                  () => SizedBox(
                    width: sizingInformation.isMobile ? double.infinity : 360,
                    child: Card(
                      child: Column(
                        children: [
                          CheckboxListTile(
                            title: Text("Image", style: TextStyle(fontSize: 32)),
                            value: withImage.value,
                            onChanged: (value) {
                              withImage.value = !withImage.value;
                            },
                          ),
                          Visibility(
                            visible: withImage.value,
                            child: Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: MaterialButton(
                                elevation: 0,
                                color: Colors.grey[100],
                                onPressed: () async {
                                  // image picker
                                  final image = await _picker.pickImage(source: ImageSource.gallery);

                                  // get file
                                  final file = http.MultipartFile.fromBytes(
                                    "image",
                                    await image!.readAsBytes(),
                                    filename: "apa lagi.png"
                                  );

                                  // try puload to server with multipart file
                                  final respons = http.MultipartRequest("POST", Uri.parse("http://localhost:3000/api/v1/upload"));
                                  respons.files.add(file);
                                  // add header
                                  respons.headers.addAll({
                                    "Authorization": "Bearer ${UtilPref.token}",
                                    "Content-Type": "multipart/form-data"
                                  });
                                  
                                  final response = await respons.send();
                                  
                                  print(response.statusCode);


                                    // set image to hasilGambar
                                    // final sementaraImage = await image.readAsBytes();
                                    // hasilGambar.value = sementaraImage;
                                  

                                },
                                child: Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Row(
                                    children: [
                                      Icon(
                                        Icons.add_a_photo,
                                        size: 32,
                                      ),
                                      Padding(
                                        padding: const EdgeInsets.all(8.0),
                                        child: Text("Pick Image"),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ),

                          // display image
                          Obx(
                            () => Visibility(
                              visible: hasilGambar.value.isNotEmpty,
                              child: Padding(
                                padding: const EdgeInsets.all(8.0),
                                child: Image.memory(hasilGambar.value),
                              ),
                            ),
                          )
                        ],
                      ),
                    ),
                  ),
                ),
                Obx(
                  () => SizedBox(
                    width: sizingInformation.isMobile ? double.infinity : 360,
                    child: Card(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          CheckboxListTile(
                            title: Text(
                              "Stock",
                              style: TextStyle(fontSize: 32),
                            ),
                            value: stock.value,
                            onChanged: (value) => stock.value = !stock.value,
                          ),
                          // Row(
                          //   children: [
                          //     Padding(
                          //       padding: const EdgeInsets.all(8.0),
                          //       child: Text(
                          //         "Stock",
                          //         style: TextStyle(
                          //           fontSize: 32,
                          //         ),
                          //       ),
                          //     ),
                          //     Spacer(),
                          //     // checkbox for stock
                          //     Padding(
                          //       padding: const EdgeInsets.all(8.0),
                          //       child: Checkbox(
                          //         value: stock.value,
                          //         onChanged: (bool? value) {
                          //           stock.value = value!;
                          //         },
                          //       ),
                          //     ),
                          //   ],
                          // ),
                          Visibility(
                            visible: stock.value,
                            child: Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: TextFormField(
                                onChanged: (value) => body['stock'] = value.toString(),
                                decoration: InputDecoration(
                                    labelText: "Stock",
                                    hintText: "Stock",
                                    fillColor: Colors.grey[100],
                                    filled: true,
                                    border: OutlineInputBorder(borderSide: BorderSide.none)),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                // Obx(
                //   () => SizedBox(
                //     width: sizingInformation.isMobile ? double.infinity : 360,
                //     child: Card(
                //       child: Column(
                //         crossAxisAlignment: CrossAxisAlignment.start,
                //         children: [
                //           CheckboxListTile(
                //             title: Text(
                //               "Custom Price",
                //               style: TextStyle(fontSize: 32),
                //             ),
                //             value: customPrice.value,
                //             onChanged: (value) => customPrice.value = !customPrice.value,
                //           ),
                //           // Row(
                //           //   children: [
                //           //     Padding(
                //           //       padding: const EdgeInsets.all(8.0),
                //           //       child: Text(
                //           //         "Custom Price",
                //           //         style: TextStyle(
                //           //           fontSize: 32,
                //           //         ),
                //           //       ),
                //           //     ),
                //           //     // checkbox for custom price
                //           //     Spacer(),
                //           //     Padding(
                //           //       padding: const EdgeInsets.all(8.0),
                //           //       child: Checkbox(
                //           //         value: customPrice.value,
                //           //         onChanged: (bool? value) {
                //           //           customPrice.value = value!;
                //           //         },
                //           //       ),
                //           //     ),
                //           //   ],
                //           // ),
                //           Visibility(
                //             visible: customPrice.value,
                //             child: Column(
                //               children: [
                //                 for (final hrg in listOtherPrice)
                //                   Column(
                //                     crossAxisAlignment: CrossAxisAlignment.start,
                //                     children: [
                //                       Padding(
                //                         padding: const EdgeInsets.symmetric(horizontal: 8.0),
                //                         child: Text(hrg['desc']!.toString()),
                //                       ),
                //                       Padding(
                //                         padding: const EdgeInsets.all(8.0),
                //                         child: TextFormField(
                //                           decoration: InputDecoration(
                //                               labelText: hrg["name"],
                //                               hintText: hrg["name"],
                //                               fillColor: Colors.grey[100],
                //                               filled: true,
                //                               border: OutlineInputBorder(borderSide: BorderSide.none)),
                //                         ),
                //                       ),
                //                     ],
                //                   )
                //               ],
                //             ),
                //           )
                //         ],
                //       ),
                //     ),
                //   ),
                // ),
                
              ],
            ),
            Align(
              alignment: Alignment.bottomLeft,
              child: SizedBox(
                width: sizingInformation.isMobile ? double.infinity : 360,
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: MaterialButton(
                    color: Colors.blue,
                    onPressed: ()async {

                      if(body['name']!.toString().isEmpty || body['price'].toString().isEmpty) {
                        EasyLoading.showError("Please fill all field Name And Price");
                        return;
                      }

                     try {
                        
                        final productCreate = await UtilHttp.productCreate(body);
                        UtilLoad.product();

                     } catch (e) {
                        print("===========================================");
                        print(e.toString());
                        print("===========================================");
                     }

                    },
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Center(
                        child: Text(
                          "Add Product",
                          style: TextStyle(
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            )
          ],
        );
      },
    );
  }
}

```


```js
const express = require('express');
const { CategoryCreate, CategoryGet, CategoryUpdate, CategoryDelete } = require('./controller/category');
const { OutletCreate, OutletGet, OutletDelete, OutletUpdate } = require('./controller/outlet');
const { ProductCreate, ProductGet, ProductUpdate, ProductDelete } = require('./controller/product');
const api = express.Router();

// multer upload image
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Category
// create outlet
api.post('/outlet/create', OutletCreate);

// get outlet
api.get('/outlet/get', OutletGet);

// update outlet
api.put('/outlet/update/:id', OutletUpdate);

// delete outlet
api.delete('/outlet/delete/:id', OutletDelete);

// Category
// create category 
api.post('/category/create', CategoryCreate);

// get category
api.get('/category/get', CategoryGet);

// update category
api.put('/category/update/:id', CategoryUpdate);

// delete category
api.delete('/category/delete/:id', CategoryDelete);

// Product
// create product
api.post('/product/create', ProductCreate);

// get product
api.get('/product/get', ProductGet);

// update product
api.put('/product/update/:id', ProductUpdate);

// delete product
api.delete('/product/delete/:id', ProductDelete);


// upload image with multer
api.post('/upload', multer({ storage: storage }).single('image'), (req, res) => {
    console.log(req.file);
    res.json({
        path: req.file.path,
        success: true
    })
})


api.get('/', (req, res) => {
    res.type('html').send('<center><h1>PROPOS SERVER API</h1></center>');
})




module.exports = { api }
```
