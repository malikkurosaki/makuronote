<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [left join anti null](#left-join-anti-null)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# left join anti null

```mysql
select listmeja.meja as meja,if(isnull(listbill.nobill),"",listbill.nobill) as nobill from listmeja left join listbill on listmeja.meja = listbill.meja and listbill.tanggal = curdate()
```
