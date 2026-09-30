<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [ubah format tanggal saat select](#ubah-format-tanggal-saat-select)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# ubah format tanggal saat select


_tanggal_
```sql
select cast(tanggal as date) from listbill where tanggal = "2020-01-14";


```

_jam_
```sql
select cast(tanggal as time) from listbill where tanggal = "2020-01-14";
```

