# catatan tentang my.cnf di mac os / osx

If you are using macOS Sierra and the file doesn't exists, run

`mysql --help or mysql --help | grep my.cnf`

to see the possible locations and loading/reading sequence of my.cnf for mysql then create my.cnf file in one of the suggested directories then add the following line

```bash
[mysqld]
sql_mode = STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
```

You can sudo touch /{preferred-path}/my.cnf then edit the file to add sql mode by

```bash
sudo nano /{preferred-path}/my.cnf
```

Then restart mysql, voilaah you are good to go. happy coding

sumber : https://stackoverflow.com/a/49034772/6089443


### start stop mysql 

To restart, start or stop MySQL server from the command line, type the following at the shell prompt…

 #### On Linux start/stop/restart from the command line:
 
 ```javascript
 /etc/init.d/mysqld start
 /etc/init.d/mysqld stop
 /etc/init.d/mysqld restart
 ```
Some Linux flavors offer the service command too

```bahs
 service mysqld start
 service mysqld stop
 service mysqld restart
 ```
or

```bash
 service mysql start
 service mysql stop
 service mysql restart
 ```
On macOS Sierra & OSX to start/stop/restart MySQL post 5.7  from the command line:
sudo launchctl load -F /Library/LaunchDaemons/com.oracle.oss.mysql.mysqld.plist
sudo launchctl unload -F /Library/LaunchDaemons/com.oracle.oss.mysql.mysqld.plist
On OS X to start/stop/restart MySQL pre 5.7  from the command line:

```javascript
 sudo /usr/local/mysql/support-files/mysql.server start
 sudo /usr/local/mysql/support-files/mysql.server stop
 sudo /usr/local/mysql/support-files/mysql.server restart
 ```


sumber : https://coolestguidesontheplanet.com/start-stop-mysql-from-the-command-line-terminal-osx-linux/
