# keterangan database

```sql
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
| listmeja                |
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

### login
```java
// menggunakan table kasir

kd_kasir "user"

kd_sandi "password"

```
