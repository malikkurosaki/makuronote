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



### update

So none of these things worked for me. I am using the current dmg install of mysql community server. ps shows that all of the most critical parameters normally in my.cnf are passed on the command line, and I couldn't figure out where that was coming from. After doing a full text search of my box I found it in:

`/Library/LaunchDaemons/com.oracle.oss.mysql.mysqld.plist`

So you can either change them there, or take them out so it will actually respect the ones you have in your my.cnf wherever you decided to put it.

Enjoy!

Example of the file info found in that file:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>             <string>com.oracle.oss.mysql.mysqld</string>
    <key>ProcessType</key>       <string>Interactive</string>
    <key>Disabled</key>          <false/>
    <key>RunAtLoad</key>         <true/>
    <key>KeepAlive</key>         <true/>
    <key>SessionCreate</key>     <true/>
    <key>LaunchOnlyOnce</key>    <false/>
    <key>UserName</key>          <string>_mysql</string>
    <key>GroupName</key>         <string>_mysql</string>
    <key>ExitTimeOut</key>       <integer>600</integer>
    <key>Program</key>           <string>/usr/local/mysql/bin/mysqld</string>
    <key>ProgramArguments</key>
        <array>
            <string>/usr/local/mysql/bin/mysqld</string>
            <string>--user=_mysql</string>
            <string>--basedir=/usr/local/mysql</string>
            <string>--datadir=/usr/local/mysql/data</string>
            <string>--plugin-dir=/usr/local/mysql/lib/plugin</string>
            <string>--log-error=/usr/local/mysql/data/mysqld.local.err</string>
            <string>--pid-file=/usr/local/mysql/data/mysqld.local.pid</string>
             <string>--keyring-file-data=/usr/local/mysql/keyring/keyring</string>
             <string>--early-plugin-load=keyring_file=keyring_file.so</string>

        </array>
    <key>WorkingDirectory</key>  <string>/usr/local/mysql</string>
</dict>
</plist>
```
