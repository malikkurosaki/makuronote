<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [import data dari sql](#import-data-dari-sql)
    - [cara satu](#cara-satu)
    - [cara dua](#cara-dua)
    - [cara tiga](#cara-tiga)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# import data dari sql

### cara satu
```sql
mysql -u username -p database_name < /path/to/file.sql
```

### cara dua
```sql
mysql> use db_name;
mysql> source backup-file.sql
```

### cara tiga
```sql
mysql -u root -proot product < /home/myPC/Downloads/tbl_product.sql
```
