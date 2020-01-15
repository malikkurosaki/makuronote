# catatan server git  hook

### post-receive

```bash
#!/bin/bash
while read oldrev newrev ref
do
    if [[ $ref =~ .*/master$ ]];
    then
        echo "Master ref received.  Deploying master branch to production..."
        git --work-tree=/var/www/html --git-dir=/home/demo/proj checkout -f
    else
        echo "Ref $ref successfully received.  Doing nothing: only the master branch may be deployed on this server."
    fi
done

```
`chmod +x hooks/post-receive`


### post-commit

```bash
#!/bin/bash
unset GIT_INDEX_FILE
git --work-tree=/var/www/html --git-dir=/home/demo/proj/.git checkout -f
```

`chmod +x .git/hooks/post-commit`


> contoh post-commit

```bash
#!/bin/bash
unset GIT_INDEX_FILE
git --work-tree=/home/malik/server_node --git-dir=/home/malik/repo.git checkout -f
```


### contoh 

> contoh post-receive


```bash
#!/bin/bash
while read oldrev newrev ref
do
    if [[ $ref =~ .*/master$ ]];
    then
        echo "Master ref received.  Deploying master branch to production..."
        git --work-tree=/home/malik/server --git-dir=/home/malik/repo.git checkout -f
    else
        echo "Ref $ref successfully received.  Doing nothing: only the master branch may be deployed on this server."
    fi
done


```


### remote

`git remote add origirn ssh://malik@xxx.xxx.xxx/home/malik/repo.git`
```bash
git remote add origin ssh://malik@dev.probussystem.net:2222/~/git_repo/malik.git
```


### buat git baru
```bash
$ cd /srv/git
$ mkdir project.git
$ cd project.git
$ git init --bare
Initialized empty Git repository in /srv/git/project.git/
```

### upload baru

```bash
# on John's computer
$ cd myproject
$ git init
$ git add .
$ git commit -m 'initial commit'
$ git remote add origin git@gitserver:/srv/git/project.git
$ git push origin master
```


### git hooks

```bash
malik@probus-dev:~/repo.git$ cd hooks
malik@probus-dev:~/repo.git/hooks$ ls
applypatch-msg.sample      post-commit         pre-applypatch.sample  pre-rebase.sample          update.sample
commit-msg.sample          post-receive        pre-commit.sample      pre-receive.sample
fsmonitor-watchman.sample  post-update.sample  pre-push.sample        prepare-commit-msg.sample
```

### permisi untuk repo baru

```bash
# git init --bare /opt/jupiter.git
# chown -R gituser:gituser /opt/jupiter.git
# chmod -R 770 /opt/jupiter.git
```
