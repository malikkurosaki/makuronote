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
