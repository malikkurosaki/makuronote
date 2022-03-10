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
