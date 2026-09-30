<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [auto login](#auto-login)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

### auto login

```
#!/bin/bash
sshpass -p passwornya ssh -t root@hostnya "cd ..; cd home/mobile_report; pm2 status;"
```
