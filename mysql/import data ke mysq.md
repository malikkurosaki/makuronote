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
