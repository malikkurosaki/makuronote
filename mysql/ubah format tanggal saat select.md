# ubah format tanggal saat select


_tanggal_
```sql
select cast(tanggal as date) from listbill where tanggal = "2020-01-14";


```

_jam_
```sql
select cast(tanggal as time) from listbill where tanggal = "2020-01-14";
```

