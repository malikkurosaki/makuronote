<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [menjalankan laravel dengan pm2](#menjalankan-laravel-dengan-pm2)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# menjalankan laravel dengan pm2

xartisan.json

```json
{
    "apps": [{
        "name": "api_server",
        "script": "artisan",
        "args": ["serve", "--host=0.0.0.0", "--port=9000"],
        "instances": "1",
        "wait_ready": true,
        "autorestart": false,
        "max_restarts": 1,
        "interpreter" : "php",
        "watch": true,
        "error_file": "log/err.log",
        "out_file": "log/out.log",
        "log_file": "log/combined.log",
        "time": true
    }]
}
```
