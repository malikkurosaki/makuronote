# membuat dependency flutter

1. buat folder comtoh : makuro
2. `flutter create --template=package package_name`
3. tambah git

```bash
git init
git add --all
git commit -m "initial commit"
git remote add origin https://github.com/onatcipli/custom_alert_box.git
git push -u origin master

```
4. edit pubspec.yaml

```yaml
name: makuro
description: A new Flutter package project.
version: 0.0.1
author: malik kurosaki<kurosakiblackangel@gmail.com>
homepage: https://github.com/malikkurosaki/makuro.git
```

5. edit changelog

```bash
## [0.0.1] - 2020-10-10.

* TODO: Describe initial release.
```

6. edit lisency

```
Copyright (c) 2019 Malik Kurosaki
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```


7. import ke project

```yaml
  makuro:
    git:
      url: https://github.com/malikkurosaki/makuro.git
      ref: master
```
