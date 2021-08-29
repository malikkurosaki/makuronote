sudo vim /etc/nginx/conf.d/app.conf 

sudo ln -s /usr/share/phpmyadmin /var/www/your_domain/phpmyadmin

/usr/share/phpmyadmin/

sudo nano /etc/nginx/snippets/phpmyadmin.conf
```
location /phpmyadmin {
    root /usr/share/;
    index index.php index.html index.htm;
    location ~ ^/phpmyadmin/(.+\.php)$ {
        try_files $uri =404;
        root /usr/share/;
        fastcgi_pass unix:/run/php/php7.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include /etc/nginx/fastcgi_params;
    }

    location ~* ^/phpmyadmin/(.+\.(jpg|jpeg|gif|css|png|js|ico|html|xml|txt))$ {
        root /usr/share/;
    }
}
```

include snippets/phpmyadmin.conf;

```
server {

    # . . . other code

    include snippets/phpmyadmin.conf;

    # . . . other code 

}
```


permition

sudo chown -R $USER:$USER /var/www/example.com/html
sudo chown -R $USER:$USER /var/www/test.com/html

sudo chmod -R 755 /var/www

### memantau penggunaan memory

```
watch -n 5 free -m
```
