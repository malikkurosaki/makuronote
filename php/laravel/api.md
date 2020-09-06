# api

```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

// route customer
Route::get('/lihat-customer','CustomerController@index');
Route::post('/tambah-customer','CustomerController@store'); 
Route::post('/update-customer','CustomerController@update');
Route::post('/hapus-customer/{id}','CustomerController@destroy');


// route product
Route::get('/lihat-product','ProductController@index');
Route::post('/tambah-product','ProductController@store'); 
Route::post('/update-product','ProductController@update');
Route::post('/hapus-product/{id}','ProductController@destroy');


// route pegawai
Route::get('/lihat-pegawai','PegawaiController@index');
Route::post('/tambah-pegawai','PegawaiController@store'); 
Route::post('/update-pegawai','PegawaiController@update');
Route::post('/hapus-pegawai/{id}','PegawaiController@destroy');


// route warna
Route::get('/lihat-warna','WarnaController@index');
Route::post('/tambah-warna','WarnaController@store'); 
Route::post('/update-warna','WarnaController@update');
Route::post('/hapus-warna/{id}','WarnaController@destroy');
Route::get('/warna','WarnaController@show');


// route ukuran
Route::get('/lihat-ukuran','UkuranController@index');
Route::post('/tambah-ukuran','UkuranController@store'); 
Route::post('/update-ukuran','UkuranController@update');
Route::post('/hapus-ukuran/{id}','UkuranController@destroy');
Route::get('/ukuran','UkuranController@show');

// route jenis
Route::get('/lihat-jenis','JenisController@index');
Route::post('/tambah-jenis','JenisController@store'); 
Route::post('/update-jenis','JenisController@update');
Route::post('/hapus-jenis/{id}','JenisController@destroy');
Route::get('/ukuran','JenisController@show');

// route production
Route::get('/lihat-production','ProductionController@index');
Route::post('/tambah-production','ProductionController@store'); 
Route::post('/update-production','ProductionController@update');
Route::post('/hapus-production/{id}','ProductionController@destroy');
Route::get('/production','ProductionController@show');
Route::get('/lihat/{id}','ProductionController@edit');

Route::get('/clear', function () {
    // Artisan::call('cache:clear');
    return "All cache cleared";
});

```
