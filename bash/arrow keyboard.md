<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [arrow keyboard](#arrow-keyboard)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# arrow keyboard

```bash
 while read -r -sn1 t; do
                case $t in
                A) printf "\rup" ;;
                B) printf "\rdown" ;;
                C) printf "\rright" ;;
                D) printf "\rleft" ;;
                esac
            done
```
