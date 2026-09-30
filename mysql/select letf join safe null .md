<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [mysql left join safe null](#mysql-left-join-safe-null)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# mysql left join safe null 

```mysql
select listmeja.meja as list_meja,coalesce(meja_isi.meja,'') as meja_isi,coalesce(listbill.nobill,'') as nobill,coalesce(listbill.pax,'') as pax from listmeja left join meja_isi on listmeja.meja = meja_isi.meja left join listbill on listmeja.meja = listbill.meja and listbill.tanggal = curdate() and listbill.stt = 'open'
```
