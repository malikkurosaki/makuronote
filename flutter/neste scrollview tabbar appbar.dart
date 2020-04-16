# neste scrollview tabbar appbar

```dart
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:prestopos/the_controller/the_controller_configurasi.dart';
import 'package:prestopos/the_controller/the_controller_moutlet.dart';
import 'package:prestopos/the_controller/the_controller_printer_order.dart';
import 'package:prestopos/the_controller/the_controller_table.dart';
import 'package:prestopos/the_controller/the_controller_waiter.dart';
import 'package:prestopos/the_model/the_model_device_info.dart';
import 'package:prestopos/the_model/the_model_host.dart';
import 'package:prestopos/the_model/the_model_moutlet.dart';
import 'package:prestopos/the_model/the_model_waiter_token.dart';
import 'package:prestopos/the_view/the_view_open_table.dart';
import 'package:prestopos/the_view/the_view_setting.dart';
import 'package:prestopos/the_view/the_view_setup_table.dart';
import 'package:prestopos/the_view/view_coba.dart';
import 'package:provider/provider.dart';

class ViewHalamanUtama extends StatefulWidget{
  @override
  _ViewHalamanUtamaState createState() => _ViewHalamanUtamaState();
}

class _ViewHalamanUtamaState extends State<ViewHalamanUtama> with SingleTickerProviderStateMixin{
  ScrollController _scrollController;
  TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _scrollController = ScrollController(initialScrollOffset: 0.0);
  }

  @override
  void dispose() {
    this._tabController.dispose();
    this._scrollController.dispose();
    super.dispose();
  }
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        FutureProvider(create: (context)async => TheControllerTable().getListLihatTable(),),
        FutureProvider(create: (context)async => TheControllerPrinterOrder().getListPrinterOrder(),),
        FutureProvider(create: (context)async => TheControllerMOutlet().getModelOutlet(),),
        FutureProvider(create: (context)async => TheControllerWaiter().getWaiter(),),
        FutureProvider(create: (context)async => TheControllerConfigurasi().getModelConfigurasi(),),
        ChangeNotifierProvider(create: (context) => TheControllerPrinterOrder(),),
        ChangeNotifierProvider(create: (context) => TheControllerTable(),),
      ],
      
      child: Scaffold(
        appBar: AppBar(
          title: Image.asset("assets/images/probus.png",color: Colors.white,),
          elevation: 0.0,
          actions: [
            PopupMenuButton(
              itemBuilder: (context) => <PopupMenuItem<String>>[
                PopupMenuItem(
                  child: Row(
                    children: [
                      Icon(Icons.exit_to_app,color: Colors.black,),
                      Text("logout".toUpperCase())
                    ],
                  ),
                )
              ],
            ),
            
          ],
        ),
        body: NestedScrollView(
          controller: _scrollController,
          headerSliverBuilder: (context, innerBoxIsScrolled) => [
            SliverAppBar(
              floating: true,
              pinned: true,
              excludeHeaderSemantics: true,
              flexibleSpace: FlexibleSpaceBar(
                background: Container(
                  child: Column(
                    children: [
                      Text("presto pos".toUpperCase(),
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 5,
                          color: Colors.white.withOpacity(0.5)
                        ),
                      ),
                      Text(Provider.of<TheModelMOutlet>(context).nmOut,
                        style: TextStyle(fontSize: 32,color: Colors.orange),
                      ),
                      Text(Provider.of<TheModelHost>(context).nama,
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.5)
                        ),
                      ),
                      Text(Provider.of<TheModelWaiterToken>(context).kodeWait,
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.5)
                        ),
                      ),
                      Text(Provider.of<TheModelDeviceInfo>(context).nama,
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.5)
                        ),
                      )
                    ],
                  ),
                ),
              ),
              expandedHeight: 200,
              bottom: TabBar(
                indicatorColor: Colors.orange,
                controller: _tabController,
                tabs: [
                  Tab(text: "Open Table",),
                  Tab(text: "Setting",)
                ],
              ),
            )
          ], 
          body: TabBarView(
            controller: _tabController,
            children: [
              SingleChildScrollView(child: TheViewOpenTable(),),
              TheViewSetting()
            ]
          ),
        ),
      )
    );
  }
}

```
