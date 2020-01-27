# keterangan database

__database : DBCRISPYPIZZA__

```bash
---------------------------
| acc_dept                |
| adj                     |
| aktual                  |
| ameja                   |
| aset_type               |
| bank                    |
| bb_bln                  |
| beli                    |
| belidel                 |
| bill                    | <
| bill_lama               |
| budget_fo               |
| cbb                     |
| clistjurnal             |
| coa                     |
| comp                    |
| config_tax              |
| configurasi             |
| consume                 |
| customer                |
| data_supplier           |
| dcost                   |
| dcustomer               |
| dcustomer_lama          |
| debet_card              |
| dept                    |
| dept_exp                |
| dmaster                 |
| dmenu                   |
| dpilmenu                |
| dpo                     |
| dposanur                |
| dsetting                |
| enroll                  |
| extrabox                |
| extrabox_lama           |
| extramenu               |
| folio                   |
| format_bb               |
| ftp                     |
| gjual                   |
| group_dep               |
| group_outlet            |
| group_paket             |
| groupm                  |
| groupp                  |
| groupr                  |
| groups                  |
| history_bill            |
| info_per                |
| informasi               |
| inventori               |
| jabatan                 |
| jasa                    |
| jual                    |
| kary                    |
| kasir                   | <
| kasirfinger             |
| katagori                |
| kredit_card             |
| kurs                    |
| layout_table            |
| list_aset               |
| list_po                 |
| list_pr                 |
| list_sauce              |
| listbill                | <
| listbill_lama           |
| listcost                |
| listjurnal              |
| listkode                |
| listmeja                | <
| listretur               |
| listroom                |
| log_audit               |
| log_synchron            |
| log_update              |
| logsla                  |
| lokasi                  |
| lokasi_pakai            |
| malasan                 |
| management              |
| marketing               |
| mcatat                  |
| mdiskon                 |
| meja_isi                |
| menu                    |
| menu_b                  |
| menu_lama               |
| menu_na                 |
| menuku                  |
| mkomisi                 |
| mlokasi                 |
| moutlet                 |
| mpakai                  |
| mprinter                |
| msalad                  |
| mshift                  |
| mshift1                 |
| mstatus                 |
| msub                    |
| outlet                  |
| passwordm               |
| pesan                   |
| posisi                  |
| pr                      |
| printer_order           |
| procs_priv              |
| produk                  | <
| produk_adj              |
| produk_listadj          |
| produk_listro           |
| produk_note             |
| produk_out              |
| produk_qty              |
| produk_ro               |
| promo                   |
| promo_pay               |
| public_parameter        |
| resep                   |
| resep_sauce             |
| resep_stock             |
| retur                   |
| rinci_m                 |
| salad                   |
| satuan                  |
| spoil                   |
| statusm                 |
| stock_inisial           |
| stock_out               |
| stockqty                |
| subgroup                |
| subgroupp               |
| tables_priv             |
| target                  |
| temp_aktual             |
| temp_bb                 |
| temp_beli               |
| temp_bill               |
| temp_data_supplier      |
| temp_dmenu              |
| temp_dpo                |
| temp_katagori           |
| temp_listjurnal         |
| temp_listpo             |
| temp_po                 |
| temp_spoil              |
| temp_transfer           |
| transfer                |
| uplod_file              |
| usr_gaji                |
| usr_kary                |
| waiter                  | <
---------------------------
```

### keterangan table 

__bill__

```bash
+----------------+---------------+------+-----+---------------------+-------+
| Field          | Type          | Null | Key | Default             | Extra |
+----------------+---------------+------+-----+---------------------+-------+
| nobill         | varchar(20)   | NO   | PRI | 0                   |       |
| urut           | decimal(5,0)  | NO   | PRI | 0                   |       |
| kode_out       | varchar(10)   | NO   |     | NULL                |       |
| kode_pro       | varchar(15)   | NO   |     |                     |       |
| harga_pro      | decimal(14,2) | NO   |     | 0.00                |       |
| disc_sen       | decimal(14,2) | NO   |     | 0.00                |       |
| disc_nom       | decimal(14,2) | NO   |     | 0.00                |       |
| qty            | decimal(5,2)  | NO   |     | 0.00                |       |
| hpp_pro        | decimal(14,2) | YES  |     | NULL                |       |
| dial           | varchar(30)   | NO   |     | 0                   |       |
| tujuan         | varchar(50)   | NO   |     |                     |       |
| tax            | decimal(14,2) | NO   |     | 0.00                |       |
| ser            | decimal(14,2) | NO   |     | 0.00                |       |
| net            | decimal(14,2) | NO   |     | 0.00                |       |
| gross          | decimal(14,2) | NO   |     | 0.00                |       |
| vtax           | decimal(8,2)  | NO   |     | 0.00                |       |
| vser           | decimal(8,2)  | NO   |     | 0.00                |       |
| vts            | char(3)       | NO   |     |                     |       |
| note           | varchar(200)  | NO   |     |                     |       |
| sttb           | varchar(15)   | NO   |     | NONE                |       |
| stt_print      | decimal(1,0)  | NO   |     | 0                   |       |
| priority       | decimal(4,0)  | NO   |     | 0                   |       |
| cetak          | decimal(2,0)  | NO   |     | 0                   |       |
| jamor          | varchar(10)   | NO   |     | 00:00:00            |       |
| kategori       | varchar(15)   | NO   |     |                     |       |
| KD_WAITER      | varchar(10)   | NO   |     |                     |       |
| alasanku       | varchar(100)  | NO   |     |                     |       |
| kursi          | varchar(20)   | NO   |     |                     |       |
| stt_void       | int(1)        | NO   |     | 0                   |       |
| compli         | int(1)        | NO   |     | 0                   |       |
| id_compli      | varchar(10)   | NO   |     |                     |       |
| void_by        | varchar(15)   | YES  |     |                     |       |
| compli_by      | varchar(15)   | YES  |     |                     |       |
| cancel_by      | varchar(15)   | YES  |     |                     |       |
| cancel         | decimal(14,2) | NO   |     | 0.00                |       |
| id_compliment  | varchar(10)   | NO   |     |                     |       |
| userm          | varchar(30)   | YES  |     |                     |       |
| tgl_hapus      | date          | YES  |     | 2000-01-01          |       |
| user_del       | varchar(30)   | YES  |     |                     |       |
| tgl_del        | date          | YES  |     | 2000-01-01          |       |
| why_del        | varchar(100)  | YES  |     |                     |       |
| lokasi_del     | varchar(30)   | YES  |     |                     |       |
| kode_tax       | varchar(30)   | YES  |     |                     |       |
| tgl_delete     | date          | YES  |     | 2000-01-01          |       |
| user_delete    | varchar(30)   | YES  |     |                     |       |
| setmenu        | int(2)        | NO   |     | 0                   |       |
| night          | decimal(2,0)  | YES  |     | 0                   |       |
| pax            | decimal(10,0) | YES  |     | 0                   |       |
| persen         | decimal(3,0)  | YES  |     | 0                   |       |
| ccygb          | varchar(10)   | YES  |     | IDR                 |       |
| rategb         | decimal(10,0) | YES  |     | 1                   |       |
| pilmenu        | decimal(2,0)  | NO   |     | 0                   |       |
| kd_voucher     | varchar(30)   | YES  |     |                     |       |
| tanggal        | date          | YES  | MUL | 2000-01-01          |       |
| bship          | varchar(15)   | YES  |     |                     |       |
| bstt           | varchar(10)   | YES  |     |                     |       |
| blokasi        | varchar(20)   | YES  |     |                     |       |
| tanggal_delete | date          | YES  |     | 2000-01-01          |       |
| pkatagori      | varchar(10)   | YES  |     |                     |       |
| alasan_id      | varchar(10)   | YES  |     |                     |       |
| stt_cancel     | int(5)        | NO   |     | 0                   |       |
| stt_free       | decimal(14,2) | NO   |     | 0.00                |       |
| kd_promo       | varchar(10)   | NO   |     |                     |       |
| extmenu        | decimal(2,0)  | NO   |     | 0                   |       |
| tgl_action     | datetime      | YES  |     | 2001-01-01 00:00:00 |       |
| gpoint         | decimal(20,0) | YES  |     | 0                   |       |
| nomor          | decimal(20,0) | NO   |     | 0                   |       |
| sign_by        | varchar(20)   | YES  |     |                     |       |
| barcode        | varchar(200)  | YES  |     |                     |       |
| void           | decimal(14,2) | YES  |     | 0.00                |       |
+----------------+---------------+------+-----+---------------------+-------+
```

__kasir__

```bash
+-----------+---------------+------+-----+---------------------+-------+
| Field     | Type          | Null | Key | Default             | Extra |
+-----------+---------------+------+-----+---------------------+-------+
| kd_kasir  | varchar(10)   | NO   | PRI |                     |       |
| nm_kasir  | varchar(25)   | YES  |     | NULL                |       |
| kd_sandi  | varchar(20)   | NO   |     |                     |       |
| id_kasir  | varchar(10)   | NO   |     |                     |       |
| aktif     | int(1)        | YES  |     | 1                   |       |
| user_kat  | decimal(2,0)  | NO   |     | 0                   |       |
| no_id     | varchar(10)   | NO   |     |                     |       |
| levelx    | varchar(20)   | YES  |     |                     |       |
| barcode   | varchar(200)  | YES  |     |                     |       |
| kd_dept   | varchar(10)   | YES  |     | RST                 |       |
| kd_level  | varchar(30)   | YES  |     |                     |       |
| template1 | mediumtext    | YES  |     | NULL                |       |
| kd_aktif  | int(1)        | YES  |     | 1                   |       |
| login_id  | varchar(50)   | NO   |     |                     |       |
| updateby  | varchar(50)   | NO   |     |                     |       |
| dbupdate  | datetime      | YES  |     | 2001-01-01 00:00:00 |       |
| max_disc  | decimal(10,0) | YES  |     | NULL                |       |
+-----------+---------------+------+-----+---------------------+-------+

```

__listmeja__

```bash
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| meja  | varchar(20) | NO   | PRI |         |       |
+-------+-------------+------+-----+---------+-------+

```

__lisbill__

```bash

+----------------+---------------+------+-----+---------------------+-------+
| Field          | Type          | Null | Key | Default             | Extra |
+----------------+---------------+------+-----+---------------------+-------+
| nobill         | varchar(20)   | NO   | PRI |                     |       |
| billx          | varchar(20)   | NO   |     |                     |       |
| paidbill       | varchar(15)   | NO   |     |                     |       |
| kode_out       | varchar(10)   | YES  | MUL | NULL                |       |
| co             | varchar(15)   | NO   |     |                     |       |
| pax            | decimal(3,0)  | YES  |     | 1                   |       |
| tanggal        | date          | YES  | MUL | 2000-01-01          |       |
| kd_cus         | varchar(15)   | NO   |     |                     |       |
| kode_wait      | varchar(10)   | YES  |     | NULL                |       |
| nama_tamu      | varchar(30)   | YES  |     | NULL                |       |
| kasir          | varchar(15)   | YES  |     |                     |       |
| stt            | varchar(10)   | NO   |     | Open                |       |
| disc           | decimal(5,2)  | YES  |     | 0.00                |       |
| discrp         | decimal(12,2) | YES  |     | 0.00                |       |
| net            | decimal(14,2) | YES  |     | 0.00                |       |
| taxrp          | decimal(14,2) | YES  |     | 0.00                |       |
| serrp          | decimal(14,2) | YES  |     | 0.00                |       |
| gtotal         | decimal(14,2) | YES  |     | 0.00                |       |
| total          | decimal(14,2) | YES  |     | 0.00                |       |
| cash           | decimal(14,2) | YES  |     | 0.00                |       |
| cc             | decimal(14,2) | YES  |     | 0.00                |       |
| voucher        | decimal(14,2) | YES  |     | 0.00                |       |
| tip            | decimal(14,2) | YES  |     | 0.00                |       |
| other          | decimal(14,2) | YES  |     | 0.00                |       |
| dc             | decimal(14,2) | NO   |     | 0.00                |       |
| gb             | decimal(14,2) | YES  |     | 0.00                |       |
| compliment     | decimal(14,2) | YES  |     | 0.00                |       |
| tgl_ubah       | date          | YES  |     | 2000-01-01          |       |
| card_fee       | decimal(14,2) | YES  |     | 0.00                |       |
| nama_cc        | varchar(25)   | YES  |     | NULL                |       |
| nama_oth       | varchar(15)   | NO   |     |                     |       |
| ket_comp       | varchar(15)   | YES  |     | NULL                |       |
| groups         | varchar(25)   | NO   |     | 1. RESTAURANT       |       |
| ket            | varchar(200)  | YES  |     | NULL                |       |
| valid_cc       | varchar(7)    | NO   |     | 00-0000             |       |
| no_cc          | varchar(10)   | YES  |     | NULL                |       |
| ccy            | varchar(10)   | YES  |     | IDR                 |       |
| rate           | decimal(10,2) | NO   |     | 1.00                |       |
| meja           | varchar(20)   | NO   |     |                     |       |
| kas_bon        | decimal(14,2) | NO   |     | 0.00                |       |
| prive          | decimal(14,2) | NO   |     | 0.00                |       |
| last_user      | varchar(30)   | NO   |     |                     |       |
| charge         | decimal(8,0)  | NO   |     | 0                   |       |
| vtax           | decimal(8,2)  | NO   |     | 0.00                |       |
| vser           | double(8,2)   | NO   |     | 0.00                |       |
| vts            | char(3)       | NO   |     |                     |       |
| cash_usd       | decimal(14,2) | NO   |     | 0.00                |       |
| forex          | decimal(14,2) | NO   |     | 0.00                |       |
| diskon         | decimal(14,2) | NO   |     | 0.00                |       |
| Diskon_sen     | decimal(14,2) | NO   |     | 0.00                |       |
| nama_dc        | varchar(20)   | NO   |     |                     |       |
| no_dc          | varchar(20)   | NO   |     |                     |       |
| valid_dc       | date          | NO   |     | 2000-01-01          |       |
| jam_order      | varchar(8)    | NO   |     | 00:00:00            |       |
| jam_payment    | varchar(10)   | NO   |     | 00:00:00            |       |
| delivery       | decimal(1,0)  | NO   |     | 0                   |       |
| kd_comp        | varchar(10)   | NO   |     |                     |       |
| avg_br         | decimal(14,2) | NO   |     | 0.00                |       |
| ship           | varchar(30)   | NO   | MUL |                     |       |
| free_ts        | decimal(14,2) | NO   |     | 0.00                |       |
| coa_comp       | varchar(10)   | NO   |     |                     |       |
| Lokasi         | varchar(30)   | NO   |     |                     |       |
| Internet       | decimal(1,0)  | NO   |     | 0                   |       |
| PREBILLING     | decimal(1,0)  | NO   |     | 0                   |       |
| PO             | decimal(1,0)  | NO   |     | 0                   |       |
| STT_PRINT      | decimal(1,0)  | NO   |     | 0                   |       |
| warna          | decimal(2,0)  | NO   |     | 0                   |       |
| mejas          | char(1)       | NO   |     |                     |       |
| no_room        | varchar(5)    | NO   |     |                     |       |
| prebill        | decimal(20,2) | NO   |     | 0.00                |       |
| bill_trx       | varchar(15)   | YES  |     | NULL                |       |
| tipe           | decimal(1,0)  | NO   |     | 0                   |       |
| reg_no         | varchar(15)   | YES  |     | NULL                |       |
| kd_staff       | varchar(10)   | YES  |     | NULL                |       |
| tgl_trx        | date          | YES  |     | NULL                |       |
| diskon_all     | int(1)        | NO   |     | 0                   |       |
| no_pajak       | varchar(20)   | NO   |     |                     |       |
| cekpajak       | int(1)        | NO   |     | 0                   |       |
| jam_lama       | varchar(8)    | NO   |     | 00:00:00            |       |
| close_cc       | varchar(15)   | NO   |     |                     |       |
| tgl_closecc    | date          | YES  |     | 2000-01-01          |       |
| stt_pkg_old    | decimal(2,0)  | YES  |     | 0                   |       |
| komisi_nom     | decimal(14,2) | YES  |     | 0.00                |       |
| tglclosecc     | date          | YES  |     | 2000-01-01          |       |
| user_del       | varchar(30)   | YES  |     |                     |       |
| bsst           | varchar(20)   | YES  |     |                     |       |
| userm          | varchar(30)   | YES  |     |                     |       |
| tgl_hapus      | date          | YES  |     | 2000-01-01          |       |
| tgl_del        | datetime      | YES  |     | 2000-01-01 00:00:00 |       |
| alasan         | varchar(50)   | YES  |     |                     |       |
| kd_voucher     | varchar(30)   | YES  |     |                     |       |
| tgl_closing    | date          | YES  |     | 2000-01-01          |       |
| stt_closing    | varchar(2)    | YES  |     | F                   |       |
| skomisi        | decimal(14,2) | YES  |     | 0.00                |       |
| akomisi        | decimal(14,2) | YES  |     | 0.00                |       |
| ikomisi        | decimal(14,2) | YES  |     | 0.00                |       |
| reg_dlive      | varchar(30)   | YES  |     |                     |       |
| cdept          | varchar(50)   | YES  |     | CRISPY PIZZA        |       |
| kd_komisi      | varchar(10)   | NO   |     |                     |       |
| why_del        | varchar(100)  | YES  |     |                     |       |
| transfer       | decimal(14,2) | YES  |     | 0.00                |       |
| nm_bank        | varchar(30)   | YES  |     |                     |       |
| discount       | decimal(14,2) | YES  |     | 0.00                |       |
| gkomisi        | int(1)        | YES  |     | 1                   |       |
| free_bf        | decimal(14,2) | YES  |     | 0.00                |       |
| biaya_dlv      | decimal(14,2) | NO   |     | 0.00                |       |
| kd_co          | int(2)        | YES  |     | 0                   |       |
| deposit        | decimal(14,2) | YES  |     | 0.00                |       |
| no_booking     | varchar(20)   | YES  |     |                     |       |
| nama_komisi    | varchar(20)   | YES  |     |                     |       |
| close_cc2      | varchar(20)   | YES  |     |                     |       |
| no_cc2         | varchar(20)   | YES  |     |                     |       |
| valid_cc2      | varchar(20)   | YES  |     | 00-0000             |       |
| cc2            | decimal(14,2) | YES  |     | 0.00                |       |
| card_fee2      | decimal(14,2) | YES  |     | 0.00                |       |
| nama_cc2       | varchar(50)   | YES  |     |                     |       |
| charge2        | decimal(14,2) | YES  |     | 0.00                |       |
| tglclosecc2    | date          | YES  |     | 2000-01-01          |       |
| tgl_closecc2   | date          | YES  |     | 2000-01-01          |       |
| alasan_id      | varchar(10)   | YES  |     |                     |       |
| reg_dive       | varchar(30)   | YES  |     |                     |       |
| CTD            | decimal(14,2) | YES  |     | 0.00                |       |
| bill_resto     | decimal(14,2) | YES  |     | 0.00                |       |
| bill_room      | decimal(14,2) | YES  |     | 0.00                |       |
| fee_lisensi    | decimal(14,2) | YES  |     | 0.00                |       |
| kd_pkg         | varchar(10)   | YES  |     |                     |       |
| stt_pkg        | int(2)        | YES  |     | 0                   |       |
| br_ctr         | decimal(14,0) | YES  |     | 0                   |       |
| nohp           | varchar(20)   | YES  |     |                     |       |
| user_delete    | varchar(30)   | NO   |     |                     |       |
| tanggal_delete | datetime      | NO   |     | 2000-01-01 00:00:00 |       |
| why_delete     | varchar(100)  | YES  |     |                     |       |
| lokasi_del     | varchar(20)   | YES  |     |                     |       |
| kode_tax       | varchar(30)   | YES  |     |                     |       |
| kode_stt       | varchar(20)   | YES  |     |                     |       |
| printerx       | decimal(2,0)  | YES  |     | NULL                |       |
| aversi         | varchar(15)   | NO   |     |                     |       |
| pc_id          | varchar(30)   | NO   |     |                     |       |
| tcp_id         | varchar(30)   | NO   |     |                     |       |
| login_id       | varchar(30)   | NO   |     |                     |       |
| dbinsert       | datetime      | YES  |     | 2000-01-01 00:00:00 |       |
| dbupdate       | datetime      | YES  |     | 2000-01-01 00:00:00 |       |
| stt_guest      | int(2)        | NO   |     | 2                   |       |
| voidbill_by    | varchar(20)   | NO   |     |                     |       |
| tgl_void       | date          | YES  |     | 2000-01-01          |       |
| why_void       | varchar(200)  | NO   |     |                     |       |
| user_kat       | varchar(30)   | YES  |     |                     |       |
| barcode        | varchar(200)  | YES  |     |                     |       |
| address        | varchar(200)  | YES  |     |                     |       |
| no_res         | varchar(50)   | NO   |     |                     |       |
| kd_tamu        | varchar(50)   | NO   |     |                     |       |
| totpoint       | decimal(20,0) | YES  |     | 0                   |       |
| phone          | varchar(200)  | YES  |     |                     |       |
| stt_upload     | decimal(5,0)  | NO   |     | 0                   |       |
| dbupload       | datetime      | NO   |     | 2001-01-01 00:00:00 |       |
+----------------+---------------+------+-----+---------------------+-------+

```

__produk__

```bash
+----------------+---------------+------+-----+------------+-------+
| Field          | Type          | Null | Key | Default    | Extra |
+----------------+---------------+------+-----+------------+-------+
| kode_pro       | varchar(15)   | NO   | PRI | 0          |       |
| nama_pro       | varchar(100)  | NO   | MUL |            |       |
| harga_pro      | decimal(14,2) | NO   |     | 0.00       |       |
| hpp_pro        | decimal(14,2) | NO   |     | 0.00       |       |
| persentase_cos | decimal(14,2) | NO   |     | 0.00       |       |
| ccy            | varchar(5)    | NO   |     | IDR        |       |
| kode_out       | varchar(4)    | YES  |     | NULL       |       |
| coa_pen        | varchar(10)   | YES  |     | NULL       |       |
| coa_per        | varchar(10)   | YES  |     | NULL       |       |
| coa_hpp        | varchar(10)   | YES  |     | NULL       |       |
| coa_tax        | varchar(10)   | NO   |     |            |       |
| coa_ser        | varchar(10)   | NO   |     |            |       |
| ket            | mediumtext    | YES  |     | NULL       |       |
| groupp         | varchar(15)   | YES  |     | NULL       |       |
| kat            | decimal(2,0)  | YES  |     | 1          |       |
| groups         | varchar(30)   | NO   |     |            |       |
| nm_dept        | varchar(30)   | NO   |     |            |       |
| sembunyi       | decimal(1,0)  | NO   |     | 0          |       |
| persen         | decimal(3,0)  | YES  |     | 0          |       |
| groupr         | varchar(30)   | NO   |     |            |       |
| subgroupp      | varchar(100)  | NO   |     |            |       |
| cetak_ke       | varchar(30)   | NO   |     |            |       |
| priority       | decimal(4,0)  | NO   |     | 0          |       |
| HARUS          | varchar(10)   | NO   |     |            |       |
| input_by       | varchar(50)   | NO   |     |            |       |
| date_input     | date          | NO   |     | 2001-01-01 |       |
| aktif_note     | decimal(2,0)  | YES  |     | 0          |       |
| stt_disc       | decimal(2,0)  | YES  |     | 0          |       |
| resep          | decimal(1,0)  | YES  |     | 0          |       |
| stt_ap         | decimal(14,2) | YES  |     | 0.00       |       |
| auto_disc      | decimal(2,0)  | YES  |     | 0          |       |
| auto_sen       | decimal(12,0) | YES  |     | 0          |       |
| katagori       | varchar(15)   | NO   |     |            |       |
| cetak_ke2      | varchar(30)   | NO   |     |            |       |
| trewards       | int(1)        | YES  |     | 1          |       |
| harga_update   | decimal(14,2) | NO   |     | 0.00       |       |
| setmenu        | int(2)        | NO   |     | 0          |       |
| pilmenu        | decimal(2,0)  | NO   |     | 0          |       |
| no_id          | varchar(20)   | YES  |     |            |       |
| page           | int(6)        | YES  |     | 0          |       |
| happy_nom      | decimal(14,2) | YES  |     | 0.00       |       |
| happy_sen      | decimal(14,2) | YES  |     | 0.00       |       |
| happy_kat      | decimal(7,0)  | YES  |     | 0          |       |
| koreksi        | int(2)        | YES  |     | 0          |       |
| flexi          | decimal(14,2) | NO   |     | 0.00       |       |
| barcode        | varchar(30)   | YES  |     |            |       |
| extmenu        | decimal(2,0)  | NO   |     | 0          |       |
| booth          | decimal(2,0)  | YES  |     | 0          |       |
| min_pro        | decimal(14,2) | YES  |     | 0.00       |       |
| foto           | mediumtext    | YES  |     | NULL       |       |
| alkohol        | decimal(5,0)  | YES  |     | 0          |       |
| isrebate       | decimal(14,0) | YES  |     | 0          |       |
| sizem          | decimal(10,0) | YES  |     | 0          |       |
| extrabox       | decimal(10,0) | YES  |     | 0          |       |
| isredeem       | decimal(2,0)  | YES  |     | 0          |       |
| point          | decimal(20,0) | YES  |     | 0          |       |
+----------------+---------------+------+-----+------------+-------+

```

__waiter__

```bash

+-----------+--------------+------+-----+---------------------+-------+
| Field     | Type         | Null | Key | Default             | Extra |
+-----------+--------------+------+-----+---------------------+-------+
| kode_wait | varchar(10)  | NO   | PRI | XX                  |       |
| nama_wait | varchar(25)  | NO   | MUL | XX                  |       |
| klmn      | tinyint(1)   | YES  |     | 0                   |       |
| sandi     | varchar(10)  | NO   |     |                     |       |
| nurut     | decimal(4,0) | NO   |     | 0                   |       |
| jabatan   | varchar(20)  | NO   |     | WAITER              |       |
| lahir     | date         | YES  |     | 2001-01-01          |       |
| aktif     | int(1)       | NO   |     | 1                   |       |
| tgl_input | date         | NO   |     | 2001-01-01          |       |
| user_kat  | decimal(2,0) | NO   |     | 0                   |       |
| BARCODE   | varchar(200) | YES  |     |                     |       |
| template1 | mediumtext   | YES  |     | NULL                |       |
| login_id  | varchar(50)  | NO   |     |                     |       |
| dbupdate  | datetime     | YES  |     | 2001-01-01 00:00:00 |       |
| updateby  | varchar(50)  | NO   |     |                     |       |
| kd_dept   | varchar(30)  | YES  |     | NULL                |       |
+-----------+--------------+------+-----+---------------------+-------+

```

### login
```java
// menggunakan table kasir

kd_kasir "user"

kd_sandi "password"

```


### alur cerita

1. login menggunakan table kasir
    - user colom kd_kasir
    - pass colom kd_sandi
2. pilih meja menggunakan table listmeja
    - colom meja
     - lihat table di meja isi ( tempory )
3. pilih menu dari table product + table listbil + bill
    - table listbil 
      - colom pax
    - table bill 
      - colom kode_pro
      - qty
      - harga_pro
      - disc_sen
      - total
      - note
      - jamor
      - waiter
    
 4. save > ke table listbill + bill
 5. print ke printer
 
 
 ### input 
 - table bill 
 - table listbill
 
 # kode 
 |No|Nama|Ket|
 |-|-|-|
 | 1 | ++ | qty x harga x service total x tax|
 | 2 | net | qty x harge - service - tax|
 | 3 | + | qty x harga - service x tax|
 
 _ambil, dari table outlet_
 
 # table listbill
 |no|Nama|ket|contoh|
 |-|-|-|-|
 |1|nobil|RST tahun bulan tanggal 5 kode unik| RST180808xxxxx|
 |2|paidbill|RST tahun bulan tanggal |RST18080800001
 |3|kode_out|kode outlet|RST|
 |4|pax|jumblah orang|1-9|
 |5|tanggal|tanggal transaksi|2018-08-08|
 |6|kd_cus|kode customer|dari tabel kostumer jika ada|
 |7|kode_wait|nama waiter dari tabel waiter
 |8|stt|status bill transaksi|open void revisi paid close|
 |9|disc| diskon presentase| 1-9 % |
 |10|discrp| diskon nominal| 10000 |
 |11|net|harga yang sudah dikurangi tax service|100.000|
 |12|taxrp|nilai tax pajak |-| 
 |13|serrp| nilai service| -|
 |14|gtotal| jumblah total| 1000000|
 |15|total| kali qty aja| -|
 |16|groups| groups revenue pendaapatan| diambil dari table outlet|
 |17|ccy| matauang | rp dolar|
 |18|rate| nilai matauang | lokal|
 |19|meja|nomer meja|1-9 takway|
 |20|vtax|persentase tax|10.5|
 |21|vser| pesentase service | 5|
 |22|vts|status | ++ net +|
 |23|jam_order| jam order jam serever default 00:00:00|000|
 |24|jam_payment|jam payment default 00:00:00|jam server |
 |25|ship|sift jadwal waiter|1.morning ambil dari table msift|
 |26|mejas|table bayangan sementara|apa|
 |27|cdept|office id dari table acc_dept|ok|
 
 
 
 ### insert table bill
 
 |no|nama|keterangan|contoh|
 |-|-|-|-|
 |1|nobil|RST tahun bulan tanggal 5 kode unik| RST180808xxxxx|
 |2|urut|2|pengurutan orderan dari urutan 1 2 3 4 5|
 |3|kode_out|kode outlet|RST|
 |4|kode_pro|kode produk ambil dari table produk|RST.001|
 |5|harga_pro|harganya per item|3.000|
 |6|qty|jumblah barangnya|3|
 |7|disc_sen|discount per item|5|
 |8|disc_nom|discon nominal rupiah nya|5000|
 |9|tax|tax pajak rupiah|5000|
 |10|ser|servicenya rupiah|2000|
 |11|net|netnya rupiah|2000|
 |12|gross|total grossnya|4000|
 |13|vtax|persentase dari tax|10.5|
 |14|vser|percentase dari service|5|
 |15|vts|kode nya|++, net ,+|
 |16|note|keterangan dari note|tambah keju|
 |17|cetak|print status print ke kitchen ataupun bar|1 / 0|
 |18|jamor|jam order|12:00:00|
 |19|kode_waiter| nama waihter|YULIA|
 |20|tanggal|tanggal order|2019-09-09|
 
 
 ### contoh input data json kedalam listbill
 
 ```javascript
 {
    "nobill": "RST180803WNFF9",
    "billx": "",
    "paidbill": "RST18080300010",
    "kode_out": "RST",
    "co": "",
    "pax": 1,
    "tanggal": "2020-01-27",
    "kd_cus": "               ",
    "kode_wait": "YULIA",
    "nama_tamu": "",
    "kasir": "ANI            ",
    "stt": "Open",
    "disc": 0,
    "discrp": 0,
    "net": 46669,
    "taxrp": 4900,
    "serrp": 2331,
    "gtotal": 49000,
    "total": 53900,
    "cash": 53900,
    "cc": 0,
    "voucher": 0,
    "tip": 0,
    "other": 0,
    "dc": 0,
    "gb": 0,
    "compliment": 0,
    "tgl_ubah": "2018-08-02",
    "card_fee": 0,
    "nama_cc": "  ",
    "nama_oth": "               ",
    "ket_comp": "",
    "groups": "RESTAURANT",
    "ket": "",
    "valid_cc": "00-0000",
    "no_cc": " ",
    "ccy": "IDR       ",
    "rate": 1,
    "meja": "9                   ",
    "kas_bon": 0,
    "prive": 0,
    "last_user": "ANI                          ",
    "charge": 0,
    "vtax": 10.5,
    "vser": 5,
    "vts": "+",
    "cash_usd": 0,
    "forex": 0,
    "diskon": 0,
    "Diskon_sen": 0,
    "nama_dc": " ",
    "no_dc": " ",
    "valid_dc": "1999-12-31",
    "jam_order": "15:14:00",
    "jam_payment": "15:16:05",
    "delivery": 0,
    "kd_comp": "",
    "avg_br": 0,
    "ship": "1. MORNING                    ",
    "free_ts": 0,
    "coa_comp": "",
    "Lokasi": "KASIR-PC",
    "Internet": 0,
    "PREBILLING": 0,
    "PO": 0,
    "STT_PRINT": 0,
    "warna": 3,
    "mejas": "",
    "no_room": "",
    "prebill": 2,
    "bill_trx": "",
    "tipe": 0,
    "reg_no": "",
    "kd_staff": "",
    "tgl_trx": "2018-08-02",
    "diskon_all": 0,
    "no_pajak": "",
    "cekpajak": 0,
    "jam_lama": "",
    "close_cc": "",
    "tgl_closecc": "1999-12-31",
    "stt_pkg_old": 0,
    "komisi_nom": 0,
    "tglclosecc": "1999-12-31",
    "user_del": "",
    "bsst": "",
    "userm": "",
    "tgl_hapus": "1999-12-31",
    "tgl_del": "1999-12-31",
    "alasan": "",
    "kd_voucher": "",
    "tgl_closing": "2018-08-06",
    "stt_closing": "T",
    "skomisi": 0,
    "akomisi": 0,
    "ikomisi": 0,
    "reg_dlive": "",
    "cdept": "CRISPY PIZZA",
    "kd_komisi": "          ",
    "why_del": "",
    "transfer": 0,
    "nm_bank": "",
    "discount": 0,
    "gkomisi": 1,
    "free_bf": 0,
    "biaya_dlv": 0,
    "kd_co": 0,
    "deposit": 0,
    "no_booking": "                    ",
    "nama_komisi": "",
    "close_cc2": "",
    "no_cc2": " ",
    "valid_cc2": "00-0000             ",
    "cc2": 0,
    "card_fee2": 0,
    "nama_cc2": "  ",
    "charge2": 0,
    "tglclosecc2": "1999-12-31",
    "tgl_closecc2": "1999-12-31",
    "alasan_id": "",
    "reg_dive": "",
    "CTD": 0,
    "bill_resto": 0,
    "bill_room": 0,
    "fee_lisensi": 0,
    "kd_pkg": "",
    "stt_pkg": 1,
    "br_ctr": 1,
    "nohp": "",
    "user_delete": "",
    "tanggal_delete": "1999-12-31",
    "why_delete": "",
    "lokasi_del": "",
    "kode_tax": "",
    "kode_stt": "",
    "printerx": 0,
    "aversi": "18.6.2",
    "pc_id": "KASIR-PC ",
    "tcp_id": "127.0.0.1",
    "login_id": "KASIR     ",
    "dbinsert": "2018-08-03",
    "dbupdate": "2018-08-03",
    "stt_guest": 2,
    "voidbill_by": "",
    "tgl_void": "1999-12-31",
    "why_void": "",
    "user_kat": "",
    "barcode": "",
    "address": "",
    "no_res": "",
    "kd_tamu": "",
    "totpoint": 0,
    "phone": "",
    "stt_upload": 1,
    "dbupload": "2019-12-26"
  }
 ```
