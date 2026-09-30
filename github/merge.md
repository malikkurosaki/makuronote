<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [merge dari remote](#merge-dari-remote)
- [cara lainnya](#cara-lainnya)
- [lainnya](#lainnya)
- [lansung reset](#lansung-reset)
- [merge local](#merge-local)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# merge dari remote

```bash
# beda remoter origin
git pull -s recursive -X theirs <remoterepo or other repo>

# remote origin yang sama
git pull -X theirs

# erlanjur merge dan conflig
git checkout --theirs path/to/file
git add .

```

# cara lainnya

```sh
git fetch origin remote_branch_name

# atau
git merge origin/remote_branch_name
```

# lainnya

```sh
git merge --strategy-option theirs
```

If you're already in conflicted state, and do not want to checkout path one by one. You may try

```sh
git merge --abort
git pull -X theirs
```

# lansung reset

```sh
git fetch && git reset --hard origin/master
```

# merge local

```sh
git merge [branch] --strategy-option ours

git merge [branch] --strategy-option theirs
```

