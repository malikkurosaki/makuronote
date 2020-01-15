# menangani terlau banyak auth ssh

```bash
"Too many Authentication Failures for user root" means that Your SSH server's MaxAuthTries limit was exceeded. It happens so that Your client is trying to authenticate with all possible keys stored in /home/USER/.ssh/ .

This situation can be solved by these ways:

// direset duli

greys@xps:~ $ SSH_AUTH_SOCK= 
greys@xps:~ $ env | grep SSH 
SSH_AUTH_SOCK= 
SSH_AGENT_PID=1661

// lanjut

ssh -i /path/to/id_rsa root@host
Specify Host/IdentityFile pair in /home/USER/.ssh/config .
Host host
IdentityFile /home/USER/.ssh/id_rsa
Host host2
IdentityFile /home/USER/.ssh/id_rsa2
Increase MaxAuthTries value on the SSH server in /etc/ssh/sshd_config (not recommended).

```


### restart ssh di osx

```bash
sudo launchctl stop com.openssh.sshd
sudo launchctl start com.openssh.sshd
```


### default config ssh

```bash

Host 103.207.97.143
  HostName 103.207.97.143
  User malik
  Port 2222
  ForwardAgent yes
  GSSAPIAuthentication no
```
