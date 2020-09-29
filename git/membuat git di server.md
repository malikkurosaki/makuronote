# membuat server di git

_masuk ke ssh_

`ssh your_user@server_ip_address`

_install gitnya_

`sudo apt-get update
sudo apt-get install git`

_masuk ke web target_

`cd /var/www`

_buat git folder_

`mkdir -p /var/repo/website.git`

_masuk_

`cd /var/repo/website.git/
git init --bare`

_edit file_

`
cd hooks
nano post-receive
`

_isinya_

```bash
#!/bin/sh
git --work-tree=path_to_website_folder --git-dir=path_to_git_directory checkout -f name_of_branch
```

_buat permisinya_

`
chmod +x post-receive
`


### diclient

```
git init
```

```
git remote add name_of_repository ssh://your_user@server_ip_address/path_to_git_directory
```

contoh : git remote add prestoqr ssh://root@101.09.009/var/repositori/prestoqr.git


```
git push name_of_repository name_of_branch
```

contoh : git push prestoqr master
