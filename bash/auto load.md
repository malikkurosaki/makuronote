```sh
for file in $(find ./xproject -type f -name _*.sh); do
        . $file
    done
```
