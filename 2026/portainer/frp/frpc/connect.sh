ssh -o 'ProxyCommand=ncat --proxy direct.wibudev.com:2222 --proxy-type http %h %p' bip@office1.ssh.wibudev.com
