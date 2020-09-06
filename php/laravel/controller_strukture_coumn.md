# controller strukture column

```php
<?php

namespace App\Http\Controllers;

use App\Production;
use Illuminate\Http\Request;

class ProductionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(Production::all(), 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = Production::create($request->all());
        return response()->json(['res'=>$data?true:false], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Production  $production
     * @return \Illuminate\Http\Response
     */
    public function show(Production $production)
    {
        $table = new Production();
        return response()->json(\DB::getSchemaBuilder()->getColumnListing($table->getTable()), 200);
    }

    public function lihat($id){
        $data = Production::whereId($id);
        return response()->json($data, 200);
    }
    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Production  $production
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $data = \DB::table('productions')->where('id_cus',$id)->get();
        return response()->json($data, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Production  $production
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        unset($request['created_at']);
        unset($request['updated_at']);

        $data = Production::whereId($request->id)->update($request->all());
        return response()->json(['res'=>$data?true:false], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Production  $production
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return response()->json(['res'=>Production::findOrFail($id)->delete()?true:false], 200);
    }
}

```
