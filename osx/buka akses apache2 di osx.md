# buka akses apache di osx

__sumber__

> https://medium.com/better-programming/install-apache-mysql-php-macos-mojave-10-14-b6b5c00b7de

Step 1 — Install or Restart Apache Web Sharing on Mac

To start Apache web sharing:

`sudo apachectl start`

To stop the Apache service:

`sudo apachectl stop`

To restart the Apache service:

`sudo apachectl restart`

To find the Apache version:

`httpd -v`

Create /Sites folder in username:

`sudo mkdir ~/Sites`

Open Apache folder and create username.conf in the /users directory:

`cd /etc/apache2/users`

`sudo nano username.conf`

Add the text below in username.conf and save it (CTRL+ O).

```conf
<Directory "/Users/username/Sites/">
AllowOverride All
Options Indexes MultiViews FollowSymLinks
Require all granted
</Directory>
```

Now open httpd.conf,

`sudo nano /etc/apache2/httpd.conf`

and uncomment the following module:

```conf
LoadModule authz_core_module libexec/apache2/mod_authz_core.so
LoadModule authz_host_module libexec/apache2/mod_authz_host.so
LoadModule userdir_module libexec/apache2/mod_userdir.so
LoadModule include_module libexec/apache2/mod_include.so
LoadModule rewrite_module libexec/apache2/mod_rewrite.so
```
__PHP module__

Also uncomment the PHP module:

`LoadModule php7_module libexec/apache2/libphp7.so`

And uncomment this configuration file in httpd.conf — which the allows user home directories.

`Include /private/etc/apache2/extra/httpd-userdir.conf`

Override .htaccess and allow URL rewrites

Save the file (CTRL+ O) and exit.

Open another Apache config file and uncomment another file:

`sudo nano /etc/apache2/extra/httpd-userdir.conf`

Uncomment:

`Include /private/etc/apache2/users/*.conf`

Restart Apache and open your browser. Type localhost/~username in search box.

`sudo apachectl restart`


To check whether PHP is running or not, create an index.php file in /Library/WebServer/Documents/

`sudo touch /Library/WebServer/Documents/index.php`

`sudo nano /Library/WebServer/Documents/index.php`

And add the PHP code below:

```php
<?php 
phpinfo(); 
?>
```

Save it and open your browser. Search localhost/index.php and you will get:

### Step 3 — Install MySQL
MySQL doesn’t come pre-loaded with macOS Mojave; it needs to be dowloaded from the MySQL site.

http://dev.mysql.com/downloads/mysql/

If you don’t have that file just create it using Vi or Nano:

cd ; nano .bash_profile

`export PATH="/usr/local/mysql/bin:$PATH"`
