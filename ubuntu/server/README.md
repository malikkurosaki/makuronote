### setup ip table ubuntu

`sudo apt-get install ufw`

`sudo ufw allow ssh` or `sudo ufw allow 22`






```sh
To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere                  
22                         ALLOW       Anywhere                  
2222                       ALLOW       Anywhere                  
80/tcp                     ALLOW       Anywhere                  
80                         ALLOW       Anywhere                  
443/tcp                    ALLOW       Anywhere                  
443                        ALLOW       Anywhere                  
21/tcp                     ALLOW       Anywhere                  
6000:6007/tcp              ALLOW       Anywhere                  
990/tcp                    ALLOW       Anywhere                  
40000:50000/tcp            ALLOW       Anywhere                  
22/tcp (v6)                ALLOW       Anywhere (v6)             
22 (v6)                    ALLOW       Anywhere (v6)             
2222 (v6)                  ALLOW       Anywhere (v6)             
80/tcp (v6)                ALLOW       Anywhere (v6)             
80 (v6)                    ALLOW       Anywhere (v6)             
443/tcp (v6)               ALLOW       Anywhere (v6)             
443 (v6)                   ALLOW       Anywhere (v6)             
21/tcp (v6)                ALLOW       Anywhere (v6)             
6000:6007/tcp (v6)         ALLOW       Anywhere (v6)             
990/tcp (v6)               ALLOW       Anywhere (v6)             
40000:50000/tcp (v6)       ALLOW       Anywhere (v6)  
```
