# flutter membuat static class

```dart
import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:presto_mobile/helper/fb_home.dart';

class HelperApi{
  static HelperApi _instance;
  factory HelperApi()=> _instance??=new HelperApi._();
  HelperApi._();

  static String codeNya = "RST";

  static String getUrlCodeOutlet = "https://purimas.probussystem.com:4450/api/getOutlets";
  static String getUrlSalesTrafic = "https://purimas.probussystem.com:4450/api/salesTrafic/$codeNya";
  static String getUrlSalesPerformance = "https://purimas.probussystem.com:4450/api/salesPerformance/$codeNya";
  static String getUrlHomeFb = "https://purimas.probussystem.com:4450/api/homeFb/$codeNya";
  static String getPaymenFb = "https://purimas.probussystem.com:4450/api/paymentFb/$codeNya";
  static String getProductSales = "https://purimas.probussystem.com:4450/api/productSales/$codeNya";
  static String getUrlTransactionSummary = "https://purimas.probussystem.com:4450/api/transactionSummary/$codeNya";

  
  Future getFuture(String url)async{
    var response = await http.get(url);
    if (response.statusCode == 200) {
      return response.body;
    }  
  }
}

```
