# upload pertama error


open git local config with nano editor

```
sudo nano .git/config
```

untuk ambah forlder edit di 

```
.gitignore
```

```
!build/
build/*
!build/web/
```


add your username 
```
https://malik@github.com/malikkurosaki/fitri_presto.git
```

```
[core]
        repositoryformatversion = 0
        filemode = true
        bare = false
        logallrefupdates = true
        ignorecase = true
        precomposeunicode = true
[remote "origin"]
        url = https://malikkurosaki@github.com/malikkurosaki/fitri_presto.git
        fetch = +refs/heads/*:refs/remotes/origin/*
```

run git push with -f

```
git push -f origin master
```


hapus cache

```
git rm -r --cached .
```

contoh mengikutkan sebuah folder

```
!build/
build/*
!build/web/
```

