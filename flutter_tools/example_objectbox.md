source : https://resocoder.com/2021/05/18/objectbox-fast-local-database-for-flutter-with-optional-sync-across-devices/



![](https://i2.wp.com/resocoder.com/wp-content/uploads/2021/05/objectbox_logo2.png?resize=77%2C61&ssl=1 "objectbox_logo2")

![](https://i2.wp.com/resocoder.com/wp-content/uploads/2021/05/objectbox_logo2.png?resize=77%2C61&ssl=1 "objectbox_logo2")

When you're choosing a database you're going to use in your next project, it's good to make wise and informed choices. [ObjectBox](https://objectbox.io/) is a very fast NoSQL local database for Flutter and also native Android/iOS with an intuitive API, rich support for queries and relations, plus you can _optionally_ keep the database **synced across multiple devices** without any hassle on your part.

We're going to build a "shop order app" showing orders of respective customers. You're going to learn a lot - setting up of entities, relations, ordering, and reactive queries. First, we're going to focus only on the local database functionality and then I'll show you how easy it is to sync your data across devices with ObjectBox Sync.

The finished app
----------------

The app will look and behave as on the video below. It has a `DataTable` widget which displays all of the orders in rows. A single row displays the order **ID**, **customer name** (gotten through a database relation), **price**, and lastly a **delete button**.

To keep things simple, we won't have any forms to input the data about the order and the customer. Instead, we add new orders and switch the customer associated with the order by tapping buttons in the `AppBar`. We're going to use a package called [Faker](https://pub.dev/packages/faker) to obtain things like fake customer names.

We can sort the displayed orders by their ID or price either ascendingly or descendingly by tapping on a column name in the `DataTable`.

Finally, tapping on the customer name will open up a modal bottom sheet that displays only the **respective customer's orders** - again, relations between order and customer entities will come in handy for that.

Starting out
------------

To get up and running quickly, grab the starter project from below. It contains all the widgets needed to display something on the screen, however, those widgets don't have any classes and data to work with - that will be our job to implement right now. Since we want to focus on the [ObjectBox](https://github.com/objectbox/objectbox-dart) database, we're going to use a simple `StatefulWidget` for state management.

[![](https://resocoder.com/wp-content/uploads/2020/05/starter_project_cup_flutter.svg "starter_project_cup_flutter")

![](https://resocoder.com/wp-content/uploads/2020/05/starter_project_cup_flutter.svg "starter_project_cup_flutter")

](https://resocoder.com/wp-content/uploads/2020/05/starter_project_cup_flutter.svg)

[**Starter project**](https://github.com/ResoCoder/objectbox-flutter-tutorial/tree/6e3ca39e32b4958ee9f918aa57a76d2c7ec3f612)

[**Finished project**](https://github.com/ResoCoder/objectbox-flutter-tutorial)

The `HomePage` widget that contains the `AppBar` buttons has everything prepared already so that we can immediately start writing non-boilerplate code. We're also depending on the **faker** package in the starter project.

**home\_page.dart**

    import 'package:faker/faker.dart';
    import 'package:flutter/material.dart';
    
    import 'order_data_table.dart';
    
    class HomePage extends StatefulWidget {
      @override
      _HomePageState createState() => _HomePageState();
    }
    
    class _HomePageState extends State<HomePage> {
      final faker = Faker();
    
      @override
      void initState() {
        super.initState();
        setNewCustomer();
      }
    
      @override
      Widget build(BuildContext context) {
        return Scaffold(
          appBar: AppBar(
            title: Text('Orders App'),
            actions: [
              IconButton(
                icon: Icon(Icons.person_add_alt),
                onPressed: setNewCustomer,
              ),
              IconButton(
                icon: Icon(Icons.attach_money),
                onPressed: addFakeOrderForCurrentCustomer,
              ),
            ],
          ),
          body: OrderDataTable(
            // TODO: Pass in the orders
            onSort: (columnIndex, ascending) {
              // TODO: Query the database and sort the data
            },
          ),
        );
      }
    
      void setNewCustomer() {
        // TODO: Implement properly
        print('Name: ${faker.person.name()}');
      }
    
      void addFakeOrderForCurrentCustomer() {
        // TODO: Implement properly
        print('Price: ${faker.randomGenerator.integer(500, min: 10)}');
      }
    }

The `OrderDataTable` widget also has all the boilerplate already written for you. We're using the `DataTable` widget which specifies its `columns` and, most importantly, `rows` - this is where data coming from the database will be displayed. Since `DataTable` is a core Flutter widget, I already expect you to understand how it works. If you don't, I'd recommend you to check out the [official Flutter docs](https://api.flutter.dev/flutter/material/DataTable-class.html).

Again, everything (including the sorting callback function) is already implemented, all we need is to add some actual data to be displayed.

**order\_data\_table.dart**

    import 'package:flutter/material.dart';
    
    class OrderDataTable extends StatefulWidget {
      final void Function(int columnIndex, bool ascending) onSort;
    
      const OrderDataTable({
        Key? key,
        required this.onSort,
      }) : super(key: key);
    
      @override
      _OrderDataTableState createState() => _OrderDataTableState();
    }
    
    class _OrderDataTableState extends State<OrderDataTable> {
      bool _sortAscending = true;
      int _sortColumnIndex = 0;
    
      @override
      Widget build(BuildContext context) {
        return SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: SingleChildScrollView(
            child: DataTable(
              sortColumnIndex: _sortColumnIndex,
              sortAscending: _sortAscending,
              columns: [
                DataColumn(
                  label: Text('Number'),
                  onSort: _onDataColumnSort,
                ),
                DataColumn(
                  label: Text('Customer'),
                ),
                DataColumn(
                  label: Text('Price'),
                  numeric: true,
                  onSort: _onDataColumnSort,
                ),
                DataColumn(
                  label: Container(),
                ),
              ],
              rows: [
                DataRow(
                  cells: [
                    DataCell(
                      Text('ID'),
                    ),
                    DataCell(
                      Text('CUSTOMER NAME'),
                      onTap: () {
                        // TODO: Show only tapped customer's orders in a modal bottom sheet
                      },
                    ),
                    DataCell(
                      Text(
                        '\$PRICE',
                      ),
                    ),
                    DataCell(
                      Icon(Icons.delete),
                      onTap: () {
                        // TODO: Delete the order from the database
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      }
    
      void _onDataColumnSort(int columnIndex, bool ascending) {
        setState(() {
          _sortColumnIndex = columnIndex;
          _sortAscending = ascending;
        });
        widget.onSort(columnIndex, ascending);
      }
    }

Adding dependencies
-------------------

![](https://i2.wp.com/resocoder.com/wp-content/uploads/2021/05/001-dependencies.png?resize=77%2C77&ssl=1 "001-dependencies")

![](https://i2.wp.com/resocoder.com/wp-content/uploads/2021/05/001-dependencies.png?resize=77%2C77&ssl=1 "001-dependencies")

We need to add a bunch of dependencies into the pubspec to use ObjectBox in our Flutter app - there's [objectbox](https://pub.dev/packages/objectbox), then a plugin [objectbox\_flutter\_libs](https://pub.dev/packages/objectbox_flutter_libs), and lastly a dev dependency [objectbox\_generator](https://pub.dev/packages/objectbox_generator). Apart from these three, we're also going to depend on [path\_provider](https://pub.dev/packages/path_provider) to get the directory where we can store the local database file on Android and iOS.

**pubspec.yaml**

    environment:
      sdk: '>=2.12.0 <3.0.0'
    
    dependencies:
      flutter:
        sdk: flutter
      # Version 1.0.0 is coming soon
      # It will be fully compatible with 0.15.0
      objectbox: ^0.15.0
      objectbox_flutter_libs: any
      path_provider: ^2.0.1
      faker: ^2.0.0
    
    dev_dependencies:
      flutter_test:
        sdk: flutter
      build_runner: any
      objectbox_generator: any

Learn more about the version 1.0 from an [official blogpost](https://objectbox.io/dart-flutter-database-1_0-release/).

Platform-specific setup
-----------------------

![](https://i2.wp.com/resocoder.com/wp-content/uploads/2021/05/003-platform.png?resize=77%2C77&ssl=1 "003-platform")

![](https://i2.wp.com/resocoder.com/wp-content/uploads/2021/05/003-platform.png?resize=77%2C77&ssl=1 "003-platform")

ObjectBox supports only the 64-bit architecture on iOS, which all the devices from the last few years already run on. Still, you need to indicate this in XCode. If you're on a Mac, right click on the **ios** folder in the Flutter project and choose "**Open in XCode**". Once you're there, follow the steps from the picture below to set architecture to `$ARCHS_STANDARD_64_BIT`.

![](https://i0.wp.com/resocoder.com/wp-content/uploads/2021/05/set_architecture_64bit.png?resize=779%2C349&ssl=1 "set_architecture_64bit")

![](https://i0.wp.com/resocoder.com/wp-content/uploads/2021/05/set_architecture_64bit.png?resize=779%2C349&ssl=1 "set_architecture_64bit")

Additionally, only **iOS 11** and upwards is supported, so let's make sure to set it as the minimum iOS version.

![](https://i0.wp.com/resocoder.com/wp-content/uploads/2021/05/bump_ios_version.png?resize=779%2C454&ssl=1 "bump_ios_version")

![](https://i0.wp.com/resocoder.com/wp-content/uploads/2021/05/bump_ios_version.png?resize=779%2C454&ssl=1 "bump_ios_version")

Android doesn't need any such updates to the native Android project if you're using just the local ObjectBox database. However, I'll showcase you how easy it is to add the cross-device ObjectBox Sync at the end of this tutorial, and for that I need to also bump the minimum android version to **SDK 21**. If you're not using Sync, **you don't need to do this**.

**android/app/build.gradle**

    ...
    android {
        ...
        defaultConfig {
            applicationId "com.resocoder.objectbox_prep"
            minSdkVersion 21 // 👈 bump this
            targetSdkVersion 30
            versionCode flutterVersionCode.toInteger()
            versionName flutterVersionName
        }
        ...
    }
    ...

Defining the entities
---------------------

ObjectBox works with [entities](https://docs.objectbox.io/entity-annotations). In Dart, these are simple classes annotated with the `@Entity()` annotation. Each entity needs to have an `int id;` field that will be populated by the ObjectBox package automatically, so it shouldn't be a `required` constructor parameter. Other than that, entities can have any field of a [supported type](https://docs.objectbox.io/advanced/custom-types#objectbox-supported-types). Let's create `ShopOrder` and `Customer` classes, for now, without any relation between them.

**entities.dart**

    import 'package:objectbox/objectbox.dart';
    
    @Entity()
    class ShopOrder {
      int id;
      int price;
    
      ShopOrder({
        this.id = 0,
        required this.price,
      });
    }
    
    @Entity()
    class Customer {
      int id;
      String name;
    
      Customer({
        this.id = 0,
        required this.name,
      });
    }

As you can see, the entity classes are simple - they really contain just the data we're interested in without any boilerplate. Instead, all of the boilerplate will be generated into the **objectbox.g.dart** file which is always going to be at the root of the **lib** folder. Let's run the build\_runner!

**🧑‍💻 terminal**

    flutter pub run build_runner watch --delete-conflicting-outputs 

Still, we'd like to define a relation between the `ShopOrder` and `Customer` entities to, for example, easily get all of the orders that a particular customer has made. Luckily, ObjectBox supports all kinds of relations out of the box! 🙃

When you think about it, an order will always belong only to one customer. Customers, on the other hand, can make multiple orders. The relation we're looking for here is therefore **One-to-Many**. One customer to many orders, and reversely, many orders to one customer.

Other kinds of relations such as To-One and Many-to-Many are also supported. Check out the [docs](https://docs.objectbox.io/relations).

Relations are signified by creating a field and setting it immediately equal to either `ToOne<NameOfOtherEntity>()` or `ToMany<NameOfOtherEntity>()`.  These helper classes allow us to hold a `Customer` instance inside a `ShopOrder` object in our Dart code, although in the actual database, this data will be stored completely separately.

**entities.dart**

    @Entity()
    class ShopOrder {
      int id;
      int price;
      final customer = ToOne<Customer>();
    
      ShopOrder({
        this.id = 0,
        required this.price,
      });
    }
    
    @Entity()
    class Customer {
      int id;
      String name;
      @Backlink()
      final orders = ToMany<ShopOrder>();
    
      Customer({
        this.id = 0,
        required this.name,
      });
    }

Notice the `@Backlink()` annotation on the `orders` field? This tells the entity that the orders made by the customer will be gotten (backlinked) by looking at the `ToOne` relation inside the `ShopOrder` class. 

@import url("//fonts.googleapis.com/css?family=Source+Sans+Pro:300,600,700&subset=latin");@import url("//fonts.googleapis.com/css?family=Roboto:300,500,400&subset=latin");@media (min-width:300px){\[data-css="tve-u-195fd724a7d8d9e"\]{margin-top:5px !important;margin-bottom:0px !important;}:not(#tve) \[data-css="tve-u-235fd724a7d8eb4"\]:hover button{background-color:rgb(235,174,26) !important;background-image:none !important;}:not(#tve) \[data-css="tve-u-225fd724a7d8e77"\]:hover input{background-color:rgb(204,204,204) !important;}:not(#tve) \[data-css="tve-u-215fd724a7d8e39"\]:hover input{background-color:rgb(204,204,204) !important;}\[data-css="tve-u-15fd724a7d88f0"\]{border-bottom:2px solid rgb(204,204,204);border-right:2px solid rgb(204,204,204);border-left:2px solid rgb(204,204,204);z-index:1;padding:5px 20px !important;margin-top:0px !important;}\[data-css="tve-u-45fd724a7d89c6"\]{padding-top:0px !important;padding-bottom:0px !important;}\[data-css="tve-u-75fd724a7d8a95"\]{max-width:85.6%;}\[data-css="tve-u-55fd724a7d8a0f"\]{max-width:14.4%;}:not(#tve) \[data-css="tve-u-235fd724a7d8eb4"\] button{font-size:22px;font-family:"Source Sans Pro";border-radius:0px;overflow:hidden;font-weight:bold;background-color:rgb(252,190,41) !important;background-image:none !important;}:not(#tve) \[data-css="tve-u-225fd724a7d8e77"\] input{line-height:28px;color:rgb(51,51,51);font-family:Roboto;font-weight:300;border-radius:0px;overflow:hidden;border:none;background-image:none !important;background-color:rgb(221,222,223) !important;padding:13px !important;}:not(#tve) \[data-css="tve-u-215fd724a7d8e39"\] input{line-height:28px;color:rgb(51,51,51);font-family:Roboto;font-weight:300;border-radius:0px;overflow:hidden;border:none;background-image:none !important;background-color:rgb(221,222,223) !important;padding:13px !important;}\[data-css="tve-u-165fd724a7d8ce3"\]{line-height:27px !important;}:not(#tve) \[data-css="tve-u-165fd724a7d8ce3"\]{color:rgb(255,255,255) !important;font-size:20px !important;}\[data-css="tve-u-05fd724a7d88a1"\]{background-color:rgb(255,255,255) !important;padding:0px !important;}\[data-css="tve-u-45fd724a7d89c6"\] > .tcb-flex-col > .tcb-col{justify-content:center;}\[data-css="tve-u-95fd724a7d8b10"\]{margin-bottom:0px !important;}:not(#tve) \[data-css="tve-u-215fd724a7d8e39"\] input,:not(#tve) \[data-css="tve-u-215fd724a7d8e39"\] input::placeholder,:not(#tve) \[data-css="tve-u-215fd724a7d8e39"\] select{font-weight:300 !important;}:not(#tve) \[data-css="tve-u-225fd724a7d8e77"\] input,:not(#tve) \[data-css="tve-u-225fd724a7d8e77"\] input::placeholder,:not(#tve) \[data-css="tve-u-225fd724a7d8e77"\] select{font-weight:300 !important;}:not(#tve) \[data-css="tve-u-215fd724a7d8e39"\] input,:not(#tve) \[data-css="tve-u-215fd724a7d8e39"\] select{font-family:"Source Sans Pro";background-color:rgb(255,255,255) !important;}:not(#tve) \[data-css="tve-u-225fd724a7d8e77"\] input,:not(#tve) \[data-css="tve-u-225fd724a7d8e77"\] select{font-family:"Source Sans Pro";background-color:rgb(255,255,255) !important;}:not(#tve) \[data-css="tve-u-215fd724a7d8e39"\] strong{font-weight:600;}:not(#tve) \[data-css="tve-u-225fd724a7d8e77"\] strong{font-weight:600;}:not(#tve) \[data-css="tve-u-235fd724a7d8eb4"\] strong{font-weight:600;}:not(#tve) \[data-css="tve-u-265fd724a7d8f6b"\]{font-size:13px !important;color:rgb(255,255,255) !important;}\[data-css="tve-u-255fd724a7d8f2e"\]{float:right;z-index:3;position:relative;}\[data-css="tve-u-245fd724a7d8ef2"\]::after{clear:both;}\[data-css="tve-u-65fd724a7d8a57"\]{width:80px;float:none;margin:0px auto -10px !important;}\[data-css="tve-u-25fd724a7d8938"\]{background-image:var(--tcb-gradient-2) !important;background-size:auto !important;background-position:50% 50% !important;background-attachment:scroll !important;background-repeat:no-repeat !important;}:not(#tve) \[data-css="tve-u-215fd724a7d8e39"\]:hover input,:not(#tve) \[data-css="tve-u-215fd724a7d8e39"\]:hover select{background-color:rgb(255,255,255) !important;}:not(#tve) \[data-css="tve-u-225fd724a7d8e77"\]:hover input,:not(#tve) \[data-css="tve-u-225fd724a7d8e77"\]:hover select{background-color:rgb(255,255,255) !important;}\[data-css="tve-u-145fd724a7d8c52"\]{line-height:27px !important;}:not(#tve) \[data-css="tve-u-145fd724a7d8c52"\]{color:rgb(255,255,255) !important;font-size:20px !important;}\[data-css="tve-u-175fd724a7d8d23"\]{font-size:22px !important;}\[data-css="tve-u-185fd724a7d8d60"\]{font-size:22px !important;}\[data-css="tve-u-125fd724a7d8bc9"\]{font-size:22px !important;}\[data-css="tve-u-135fd724a7d8c07"\]{font-size:22px !important;}\[data-css="tve-u-155fd724a7d8c9d"\]{font-size:22px !important;}\[data-css="tve-u-105fd724a7d8b4e"\]{line-height:27px !important;}:not(#tve) \[data-css="tve-u-105fd724a7d8b4e"\]{color:rgb(255,255,255) !important;font-size:20px !important;}\[data-css="tve-u-115fd724a7d8b8b"\]{line-height:27px !important;}:not(#tve) \[data-css="tve-u-115fd724a7d8b8b"\]{color:rgb(255,255,255) !important;font-size:20px !important;}\[data-css="tve-u-205fd724a7d8df8"\] > .tcb-flex-col > .tcb-col{justify-content:center;}}@media (max-width:1023px){:not(#tve) \[data-css="tve-u-165fd724a7d8ce3"\]{font-size:18px !important;}:not(#tve) \[data-css="tve-u-145fd724a7d8c52"\]{font-size:18px !important;}:not(#tve) \[data-css="tve-u-105fd724a7d8b4e"\]{font-size:18px !important;}:not(#tve) \[data-css="tve-u-115fd724a7d8b8b"\]{font-size:18px !important;}}@media (max-width:767px){\[data-css="tve-u-15fd724a7d88f0"\]{padding-left:14px !important;padding-bottom:14px !important;padding-right:14px !important;}\[data-css="tve-u-85fd724a7d8ad3"\]{text-align:center;}\[data-css="tve-u-95fd724a7d8b10"\]{padding-bottom:10px !important;}\[data-css="tve-u-65fd724a7d8a57"\]{margin-bottom:0px !important;}\[data-css="tve-u-45fd724a7d89c6"\]{flex-wrap:wrap !important;}\[data-css="tve-u-45fd724a7d89c6"\] .tcb-flex-col{flex-basis:390px !important;}\[data-css="tve-u-125fd724a7d8bc9"\]{font-size:22px !important;}\[data-css="tve-u-135fd724a7d8c07"\]{font-size:22px !important;}\[data-css="tve-u-155fd724a7d8c9d"\]{font-size:22px !important;}:not(#tve) \[data-css="tve-u-105fd724a7d8b4e"\]{font-size:17px !important;}:not(#tve) \[data-css="tve-u-115fd724a7d8b8b"\]{padding-top:5px !important;margin-top:0px !important;}}.tve-leads-conversion-object .thrv\_heading h1,.tve-leads-conversion-object .thrv\_heading h2,.tve-leads-conversion-object .thrv\_heading h3{margin:0;padding:0}.tve-leads-conversion-object .thrv\_text\_element p,.tve-leads-conversion-object .thrv\_text\_element h1,.tve-leads-conversion-object .thrv\_text\_element h2,.tve-leads-conversion-object .thrv\_text\_element h3{margin:0}

![](https://resocoder.com/wp-content/uploads/2019/06/flutter-letter.svg "flutter letter")

**Get tutorials, Flutter news and other exclusive content** delivered to your inbox.

Join **3000+** growth-oriented **Flutter developers**

subscribed to the newsletter.

**Get tutorials, Flutter news and other exclusive content** delivered to your inbox.

Join **15,000+** growth-oriented **Flutter developers** subscribed to the newsletter.

Insert details about how the information is going to be processed

SUBSCRIBE

100% value, 0% spam. Unsubscribe anytime.

Creating a Store
----------------

![](https://i0.wp.com/resocoder.com/wp-content/uploads/2021/05/009-open-box.png?resize=77%2C77&ssl=1 "009-open-box")

![](https://i0.wp.com/resocoder.com/wp-content/uploads/2021/05/009-open-box.png?resize=77%2C77&ssl=1 "009-open-box")

You access all ObjectBox data using a `Store`. First though, you need to initialize it and specify where the database file is going to be stored. We'll do so from `initState` of our `HomePage` state.

To get the directory where it's safe to store the database file on the user's mobile device, we call `getApplicationDocumentsDirectory()` and then continue with the value from this asynchronous call inside `then` since `initState` cannot be marked as asynchronous.

We'll put the `Store` into a `late` field and then indicate if it's already initialized with a separate boolean, so that we don't have to deal with nulls throughout our codebase.

**home\_page.dart**

    class _HomePageState extends State<HomePage> {
      final faker = Faker();
    
      late Store _store;
      bool hasBeenInitialized = false;
    
      @override
      void initState() {
        super.initState();
        getApplicationDocumentsDirectory().then((dir) {
          _store = Store(
            // This method is from the generated file
            getObjectBoxModel(),
            directory: join(dir.path, 'objectbox'),
          );
    
          setState(() {
            hasBeenInitialized = true;
          });
        });
      }
    
      @override
      void dispose() {
        _store.close();
        super.dispose();
      }
    
      ...
    }

Setting customers & adding orders
---------------------------------

The user of the app can set the "current customer" to a different `Customer` object with a new ID and a new name by pressing _"person icon"_ on the `AppBar`.

![](https://i1.wp.com/resocoder.com/wp-content/uploads/2021/05/orders_app_appbar.png?resize=420%2C79&ssl=1 "orders_app_appbar")

![](https://i1.wp.com/resocoder.com/wp-content/uploads/2021/05/orders_app_appbar.png?resize=420%2C79&ssl=1 "orders_app_appbar")

Subsequently, this `Customer` object will be the one who "makes the order" when the dollar sign button is pressed. Let's now implement the `setNewCustomer`  and `addFakeOrderForCurrentCustomer` methods inside **home\_page.dart**.

To make the current customer accessible throughout the class, we'll create a `late` field for it.

**home\_page.dart**

    class _HomePageState extends State<HomePage> {
      ...
    
      late Customer _customer;
    
      @override
      void initState() {
        super.initState();
        // We want to have a customer populated right when the app starts
        setNewCustomer();
        getApplicationDocumentsDirectory().then((dir) {
          ...
        });
      }
    
      ...
    
      void setNewCustomer() {
        _customer = Customer(name: faker.person.name());
      }
    
      void addFakeOrderForCurrentCustomer() {
        final order = ShopOrder(
          price: faker.randomGenerator.integer(500, min: 10),
        );
        order.customer.target = _customer;
        _store.box<ShopOrder>().put(order);
      }
    }

Let's now dissect the `addFakeOrderForCurrentCustomer` a bit. Creating the `ShopOrder` object is straightforward. Then, we populate the `ToOne<Customer>` relation with the current `Customer` entity inside the `_customer` field. Lastly, we persistently put the order into the database.

A single ObjectBox `Store` can have many `Box`es. In this case, there will be one for the `ShopOrder` entities and another one for `Customer`s.

Although we're only putting the data into the `ShopOrder` box, the database is smart enough to automatically put the `Customer` entity specified as the `target` of the relation into its own `Box<Customer>`. This is not always the case though, read more in the [official docs](https://docs.objectbox.io/relations#updating-relations).

Watching the data
-----------------

![](https://i1.wp.com/resocoder.com/wp-content/uploads/2021/05/012-cloud-sync-1.png?resize=77%2C77&ssl=1 "012-cloud-sync-1")

![](https://i1.wp.com/resocoder.com/wp-content/uploads/2021/05/012-cloud-sync-1.png?resize=77%2C77&ssl=1 "012-cloud-sync-1")

We now have putting the data into the database handled. This is of no use though if we cannot see it in the UI. For that, we first need to read the data from the database.

It's possible to perform a one-off read with ObjectBox, but in a reactive framework such as Flutter, it's almost always better to continuously watch the data using a `Stream` that will produce a new event whenever the data in the database is updated - for example, we add a new order.

We want to start watching the data inside `Box<ShopOrder>` immediately when the app starts so we're going to create a simple query and watch it inside `initState`. We'll also put the returned `Stream` into a state field - we'll want to use it from the `build` method.

**home\_page.dart**

    class _HomePageState extends State<HomePage> {
      ...
    
      // 👇 ADD THIS
      late Stream<List<ShopOrder>> _stream;
    
      @override
      void initState() {
        super.initState();
        setNewCustomer();
        getApplicationDocumentsDirectory().then((dir) {
          _store = Store(
            getObjectBoxModel(),
            directory: join(dir.path, 'objectbox'),
          );
    
          setState(() {
            // 👇 ADD THIS
            _stream = _store
                .box<ShopOrder>()
                // The simplest possible query that just gets ALL the data out of the Box
                .query()
                .watch(triggerImmediately: true)
                // Watching the query produces a Stream<Query<ShopOrder>>
                // To get the actual data inside a List<ShopOrder>, we need to call find() on the query
                .map((query) => query.find());
    
            hasBeenInitialized = true;
          });
        });
      }
    
      ...
    }

### Displaying the data

We have the `Stream` of `ShopOrder`s and now we need to show it inside the `OrderDataTable`. The starter project already contains all of the preparation code, so let's just come in and make it possible to pass in a `List<ShopOrder>` object. First, we of course need to create a field for the orders.

**order\_data\_table.dart**

    class OrderDataTable extends StatefulWidget {
      final List<ShopOrder> orders;
      final void Function(int columnIndex, bool ascending) onSort;
    
      const OrderDataTable({
        Key? key,
        required this.orders,
        required this.onSort,
      }) : super(key: key);
    
      @override
      _OrderDataTableState createState() => _OrderDataTableState();
    }

Once we have the List, we can display its data inside the `DataTable`. For that, we're only interested in the `rows` parameter of the `DataTable` widget's constructor. For each `ShopOrder` object inside the `orders` List, we want to map it into a `DataRow` that's going to nicely display the data to the user.

**order\_data\_table.dart**

    class _OrderDataTableState extends State<OrderDataTable> {
      ...
    
      @override
      Widget build(BuildContext context) {
        return SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: SingleChildScrollView(
            child: DataTable(
              ...
              // 👇 This is important
              rows: widget.orders.map((order) {
                return DataRow(
                  cells: [
                    DataCell(
                      Text(order.id.toString()),
                    ),
                    DataCell(
                      Text(order.customer.target?.name ?? 'NONE'),
                      onTap: () {
                        // TODO: Show only tapped customer's orders in a modal bottom sheet
                      },
                    ),
                    DataCell(
                      Text(
                        '\$${order.price}',
                      ),
                    ),
                    DataCell(
                      Icon(Icons.delete),
                      onTap: () {
                        // TODO: Delete the order from the database
                      },
                    ),
                  ],
                );
              }).toList(),
            ),
          ),
        );
      }
    
      ...
    }

Let's now pass the actual `List<ShopOrder>` into the `OrderDataTable`! Since we have a `Stream` in the `HomePage` state, we're going to use a `StreamBuilder` widget to rebuild the `OrderDataTable` whenever new a `ShopOrder` is added to the database and the stream emits a new event.

**home\_page.dart**

    class _HomePageState extends State<HomePage> {
      ...
    
      @override
      Widget build(BuildContext context) {
        return Scaffold(
          ...
          body: !hasBeenInitialized
              ? Center(
                  child: CircularProgressIndicator(),
                )
              : StreamBuilder<List<ShopOrder>>(
                  stream: _stream,
                  builder: (context, snapshot) {
                    if (!snapshot.hasData) {
                      return Center(
                        child: CircularProgressIndicator(),
                      );
                    } else {
                      return OrderDataTable(
                        orders: snapshot.data!,
                        onSort: (columnIndex, ascending) {
                          // TODO: Query the database and sort the data
                        },
                      );
                    }
                  },
                ),
        );
      }
    
      ...
    }

And the app now works! Kind of... While we can display and add new orders, we'd also like to be able to **sort the orders** based on their ID or price, **delete an order**, and lastly, **display only the orders of a specific customer in a modal bottom sheet**. Let's go one-by-one.

Sorting the orders
------------------

![](https://i1.wp.com/resocoder.com/wp-content/uploads/2021/05/019-sort.png?resize=77%2C77&ssl=1 "019-sort")

![](https://i1.wp.com/resocoder.com/wp-content/uploads/2021/05/019-sort.png?resize=77%2C77&ssl=1 "019-sort")

Sorting is very easy to accomplish. We already have an `onSort` callback on the `OrderDataTable` widget. Let's simply create a new database query in this callback function that's going to be appropriately sorted, and then reset the `Stream` that's used by the `StreamBuilder` to contain the sorted data.

Every entity like our `ShopOrder` has a generated "companion class" thats has an underscore appended to its name, in our case a `ShopOrder_`. This class is used to specify the fields based on which we'd like the query to be sorted (or ordered - but ordering `ShopOrders` sounds silly...)

The `onSort` callback receives the `columnIndex` that has been tapped by the user. We should sort the data based on this index - **index 0** is for the **ID column**, while **index 2** is for the **price column**.

Whether we sort ascendingly or descendingly is handled by the `flags` parameter. Default (0) means ascending sorting, otherwise we use a value from the `Order` (not our `ShopOrder`!!) class to specify a descending sorting.

**home\_page.dart**

    return OrderDataTable(
      orders: snapshot.data!,
      onSort: (columnIndex, ascending) {
        final newQueryBuilder = _store.box<ShopOrder>().query();
        final sortField =
            columnIndex == 0 ? ShopOrder_.id : ShopOrder_.price;
        newQueryBuilder.order(sortField,
            flags: ascending ? 0 : Order.descending);
    
        setState(() {
          _stream = newQueryBuilder
              .watch(triggerImmediately: true)
              .map((query) => query.find());
        });
      },
    );

Sorting in ObjectBox is quite powerful, read more about it in the [official docs](https://docs.objectbox.io/queries#ordering-results).

Deleting orders
---------------

![](https://i1.wp.com/resocoder.com/wp-content/uploads/2021/05/021-delete-1.png?resize=77%2C77&ssl=1 "021-delete-1")

![](https://i1.wp.com/resocoder.com/wp-content/uploads/2021/05/021-delete-1.png?resize=77%2C77&ssl=1 "021-delete-1")

Pressing the trash can button inside the `DataCell` in our `OrderDataTable` should delete the order from the database. For that, we'll need to access the `Store` even from the `OrderDataTable` so let's make sure we can pass it in.

**order\_data\_table.dart**

    class OrderDataTable extends StatefulWidget {
      ...
      final Store store;
    
      const OrderDataTable({
        Key? key,
        ...
        required this.store,
      }) : super(key: key);
    
      @override
      _OrderDataTableState createState() => _OrderDataTableState();
    }

Now inside the last `DataCell` in the mapped `DataRow`:

**orders\_data\_table.dart**

    class _OrderDataTableState extends State<OrderDataTable> {
      ...
    
      @override
      Widget build(BuildContext context) {
        return SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: SingleChildScrollView(
            child: DataTable(
              ...
              rows: widget.orders.map((order) {
                return DataRow(
                  cells: [
                    ...
                    // 👇 Edit this last DataCell's code
                    DataCell(
                      Icon(Icons.delete),
                      onTap: () {
                        widget.store.box<ShopOrder>().remove(order.id);
                      },
                    ),
                  ],
                );
              }).toList(),
            ),
          ),
        );
      }
    
      ...
    }

Removing entities from a database is just as simple as putting them in. Now we, of course, need to pass the `Store` into the widget from the `HomePage` state.

**home\_page.dart**

    return OrderDataTable(
      orders: snapshot.data!,
      onSort: (columnIndex, ascending) {
        ...
      },
      store: _store,
    );

Show orders of a specific customer
----------------------------------

Do you remember how a `Customer` is related to many `ShopOrders`? I mean, it literally has a field initialized to `ToMany<ShopOrder>`! That's precisely what we're going to use now to display all of the orders of a specific customer without having to worry about somehow finding these orders associated with a customer by ourselves. The One-to-Many relation that ObjectBox supports is going to handle all of the complexity for us and we can just use the nice Dart objects as we're used to.

Inside the `DataCell` displaying the customer's name, we're going to show a modal bottom sheet that's simply going to contain a `ListView` displaying all of the tapped customer's orders. Or, should I say, the `DataCell`'s order's customer's orders.

Yes, the previous sentence has surely confused you, but that's precisely what we're displaying in the `ListView`. Every order has a To-One relation to a customer, and then every customer has a To-Many relation to orders made by that customer. So, we're actually utilizing **two relations** to obtain the data we need.

**order\_data\_table.dart**

    DataCell(
      Text(order.customer.target?.name ?? 'NONE'),
      onTap: () {
        showModalBottomSheet(
          context: context,
          builder: (context) {
            return Material(
              child: ListView(
                children: order.customer.target!.orders
                    .map(
                      (_) => ListTile(
                        title: Text(
                          '${_.id}    ${_.customer.target?.name}    \$${_.price}',
                        ),
                      ),
                    )
                    .toList(),
              ),
            );
          },
        );
      },
    ),

Cross-device Sync
-----------------

It's very easy to synchronize data across multiple devices if you're already using ObjectBox as your local database. [ObjectBox Sync](https://objectbox.io/sync/) is a paid service that is a complete out-of-the-box data synchronization solution to always keep your data up-to-date.

If you're interested in using Sync, just contact  the people at ObjectBox and they're going to set you up with the best possible solution for your project. Once you have your ObjectBox Sync executable, you can run it on your server and begin syncing data in no time. 

You can also [try out Sync](https://objectbox.io/sync/) for free to see if it's a good fit for your app.

Sync has a very good [documentation](https://sync.objectbox.io/) that can get you running in a matter of minutes once you have your very own executable or a Docker image readily at hand.

If you'd like to see a demonstration of Sync, then make sure to check out the video tutorial accompanying this article, starting from [this timestamp](https://youtu.be/AxYbdriXKI8?t=3900).

Conclusion
----------

ObjectBox is a fast local database with a pleasant API, rich queries, relation support and you can also easily sync your data across multiple devices by using ObjectBox Sync.

How does it compare to alternatives? When it comes to performance, it [blows most of the other Flutter databases out of the water](https://objectbox.io/flutter-databases-sqflite-hive-objectbox-and-moor/). Compared to other NoSQL databases such as Sembast or even Shared Preferences, it shines with its support for relations and advanced ordering capabilities. When you add the option of easily synchronizing your data, ObjectBox should be definitely an option you consider when choosing a database for your next Flutter app.

@import url("//fonts.googleapis.com/css?family=Source+Sans+Pro:300,600,700&subset=latin");@import url("//fonts.googleapis.com/css?family=Open+Sans:400,600,&subset=latin");@import url("//fonts.googleapis.com/css?family=Roboto:300,500,400&subset=latin");@media (min-width:300px){\[data-css="tve-u-165fd724ded1b65"\]{margin-top:16px !important;margin-bottom:0px !important;}\[data-css="tve-u-95fd724ded192b"\]{margin:0px !important;box-shadow:none !important;}:not(#tve) \[data-css="tve-u-195fd724ded1c68"\]:hover button{background-color:rgb(2,86,155) !important;background-image:none !important;}:not(#tve) \[data-css="tve-u-185fd724ded1c11"\]:hover input{background-color:rgb(204,204,204) !important;}:not(#tve) \[data-css="tve-u-175fd724ded1bba"\]:hover input{background-color:rgb(204,204,204) !important;}\[data-css="tve-u-155fd724ded1b0f"\]{border-bottom:2px solid rgb(204,204,204);border-right:2px solid rgb(204,204,204);border-left:2px solid rgb(204,204,204);z-index:1;padding:30px 20px 20px !important;margin-top:-24px !important;}\[data-css="tve-u-45fd724ded17b6"\]{padding-top:0px !important;padding-bottom:0px !important;}\[data-css="tve-u-75fd724ded188b"\]{max-width:75%;}\[data-css="tve-u-55fd724ded1802"\]{max-width:25%;}\[data-css="tve-u-15fd724ded16b2"\]{z-index:6;padding:10px 20px !important;}:not(#tve) \[data-css="tve-u-195fd724ded1c68"\] button{font-size:22px;font-family:"Source Sans Pro";border-radius:0px;overflow:hidden;font-weight:bold;background-color:rgb(1,117,194) !important;background-image:none !important;}:not(#tve) \[data-css="tve-u-185fd724ded1c11"\] input{line-height:28px;color:rgb(51,51,51);font-family:Roboto;font-weight:300;border-radius:0px;overflow:hidden;border:none;background-image:none !important;background-color:rgb(221,222,223) !important;padding:13px !important;}:not(#tve) \[data-css="tve-u-175fd724ded1bba"\] input{line-height:28px;color:rgb(51,51,51);font-family:Roboto;font-weight:300;border-radius:0px;overflow:hidden;border:none;background-image:none !important;background-color:rgb(221,222,223) !important;padding:13px !important;}\[data-css="tve-u-145fd724ded1ac1"\]{line-height:27px !important;}:not(#tve) \[data-css="tve-u-145fd724ded1ac1"\]{color:rgb(255,255,255) !important;font-size:18px !important;}\[data-css="tve-u-125fd724ded1a20"\] strong{font-weight:600 !important;}\[data-css="tve-u-125fd724ded1a20"\]{line-height:40px !important;}:not(#tve) \[data-css="tve-u-125fd724ded1a20"\]{font-family:"Open Sans" !important;color:rgb(255,255,255) !important;font-size:25px !important;font-weight:400 !important;}\[data-css="tve-u-25fd724ded170d"\]{clip-path:url("#clip-bottom-htn4d559ugiry");background-color:rgb(27,94,32) !important;background-image:var(--tcb-gradient-2) !important;background-size:auto !important;background-position:50% 50% !important;background-attachment:scroll !important;background-repeat:no-repeat !important;}\[data-css="tve-u-05fd724ded1652"\]{background-color:rgb(255,255,255) !important;padding:0px !important;}\[data-css="tve-u-115fd724ded19ce"\]{margin-top:0px !important;margin-bottom:20px !important;}\[data-css="tve-u-45fd724ded17b6"\] > .tcb-flex-col > .tcb-col{justify-content:center;}\[data-css="tve-u-105fd724ded197c"\]{line-height:40px !important;}:not(#tve) \[data-css="tve-u-105fd724ded197c"\]{font-family:"Open Sans" !important;color:rgb(255,255,255) !important;font-size:36px !important;}\[data-css="tve-u-135fd724ded1a72"\]{margin-bottom:20px !important;}:not(#tve) \[data-css="tve-u-175fd724ded1bba"\] input,:not(#tve) \[data-css="tve-u-175fd724ded1bba"\] input::placeholder,:not(#tve) \[data-css="tve-u-175fd724ded1bba"\] select{font-weight:300 !important;}:not(#tve) \[data-css="tve-u-185fd724ded1c11"\] input,:not(#tve) \[data-css="tve-u-185fd724ded1c11"\] input::placeholder,:not(#tve) \[data-css="tve-u-185fd724ded1c11"\] select{font-weight:300 !important;}:not(#tve) \[data-css="tve-u-175fd724ded1bba"\] input,:not(#tve) \[data-css="tve-u-175fd724ded1bba"\] select{font-family:"Source Sans Pro";}:not(#tve) \[data-css="tve-u-185fd724ded1c11"\] input,:not(#tve) \[data-css="tve-u-185fd724ded1c11"\] select{font-family:"Source Sans Pro";}:not(#tve) \[data-css="tve-u-175fd724ded1bba"\] strong{font-weight:600;}:not(#tve) \[data-css="tve-u-185fd724ded1c11"\] strong{font-weight:600;}:not(#tve) \[data-css="tve-u-195fd724ded1c68"\] strong{font-weight:600;}:not(#tve) \[data-css="tve-u-225fd724ded1d63"\]{font-size:13px !important;}\[data-css="tve-u-215fd724ded1d0f"\]{float:right;z-index:3;position:relative;}\[data-css="tve-u-205fd724ded1cbb"\]::after{clear:both;}\[data-css="tve-u-65fd724ded1849"\]{width:120px;float:none;margin-left:auto !important;margin-right:auto !important;}}@media (max-width:767px){\[data-css="tve-u-155fd724ded1b0f"\]{padding-left:14px !important;padding-bottom:14px !important;padding-right:14px !important;}\[data-css="tve-u-15fd724ded16b2"\]{padding:14px !important;}\[data-css="tve-u-85fd724ded18db"\]{text-align:center;}\[data-css="tve-u-125fd724ded1a20"\]{line-height:1.2em !important;}:not(#tve) \[data-css="tve-u-125fd724ded1a20"\]{font-size:28px !important;}\[data-css="tve-u-135fd724ded1a72"\]{padding-bottom:10px !important;}\[data-css="tve-u-25fd724ded170d"\]{clip-path:url("#clip-mobile-bottom-htn4d559ugiry");}\[data-css="tve-u-105fd724ded197c"\]{line-height:1.2em !important;}:not(#tve) \[data-css="tve-u-105fd724ded197c"\]{font-size:28px !important;}}.tve-leads-conversion-object .thrv\_heading h1,.tve-leads-conversion-object .thrv\_heading h2,.tve-leads-conversion-object .thrv\_heading h3{margin:0;padding:0}.tve-leads-conversion-object .thrv\_text\_element p,.tve-leads-conversion-object .thrv\_text\_element h1,.tve-leads-conversion-object .thrv\_text\_element h2,.tve-leads-conversion-object .thrv\_text\_element h3{margin:0}

![](https://resocoder.com/wp-content/uploads/2019/06/flutter-letter.svg "flutter letter")

**Get more than just tutorials!**

**Join 15,000+ other Flutter developers**

Receive exclusive subscriber content, developer tips & news.

Insert details about how the information is going to be processed

SUBSCRIBE

100% value, 0% spam. Unsubscribe anytime.
