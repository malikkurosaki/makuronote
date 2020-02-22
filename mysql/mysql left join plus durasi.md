# mysql left join plus durasi

```sql
select listmeja.meja as list_meja,
coalesce(meja_isi.meja,'') as meja_isi,
coalesce(listbill.nobill,'') as nobill,
coalesce(listbill.pax,'') as pax ,
coalesce(listbill.kode_wait,'') as waiter,
coalesce(listbill.jam_order,'') as jam_order,
case when listbill.meja is null then '' else timediff(curtime(),listbill.jam_order) end as durasi
from listmeja left join meja_isi 
on listmeja.meja = meja_isi.meja 
left join listbill 
on listmeja.meja = listbill.meja 
and listbill.tanggal = curdate() 
and listbill.stt = 'open'
```
