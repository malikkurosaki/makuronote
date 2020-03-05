#catatan my.cnf v2

` mdfind -name my.cnf`

`sudo nano /usr/local/etc/my.cnf`

diistall menggunakan brew di osx , sebelumnya install ruby on rail'

```bash
# Default Homebrew MySQL server config
[mysqld]
# Only allow connections from localhost
bind-address = 127.0.0.1
mysqlx-bind-address = 127.0.0.1
#tambahan
log-bin=bin.log
log-bin-index=bin-log.index
max_binlog_size=100M
binlog_format=row
socket=mysql.sock
```


// update perbaikan 

```bash
# Default Homebrew MySQL server config
[mysqld]
# Only allow connections from localhost
bind-address = 127.0.0.1
mysqlx-bind-address = 127.0.0.1
#tambahan
log-bin=bin.log
log-bin-index=bin-log.index
max_binlog_size=100M
binlog_format=row
socket=/tmp/mysql.sock
```
