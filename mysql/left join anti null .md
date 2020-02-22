# left join anti null

```mysql
select listmeja.meja as meja,if(isnull(listbill.nobill),"",listbill.nobill) as nobill from listmeja left join listbill on listmeja.meja = listbill.meja and listbill.tanggal = curdate()
```
