<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [sqlite](#sqlite)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# sqlite

```javascript

// lihat semua table

select name from sqlite_master where type="table"

// describe table

PRAGMA table_info('member');

// hapus table

DROP TABLE IF EXISTS TABLE_NAME;

```
