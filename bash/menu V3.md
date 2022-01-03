# menu v3

```bash
#!/bin/bash

# Warna
BLACK=$(tput setaf 0)
RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
BLUE=$(tput setaf 4)
MAGENTA=$(tput setaf 5)
CYAN=$(tput setaf 6)
WHITE=$(tput setaf 7)
BOLD=$(tput bold)
RESET=$(tput sgr0)

MENU() {
    ITEM_MENU="
PILIH MENU: ${YELLOW}
1. jalankan local server
2. db migrate
3. db generate
4. git
0. keluar
${WHITE}"
    echo "${ITEM_MENU}"
    echo -n "${GREEN}pilih Menunya: ${WHITE}"
}
MENU
WAKTU=$(date +"%d-%m-%Y %T")
GitCommand() {
    GIT_MENU="

PILIHAN GIT: 
${YELLOW}
1. push
2. pull
0. keluar
${WHITE}
"

    echo "${GIT_MENU}" && echo -n "${GREEN}Pilih : ${WHITE}"
    while :; do
        read GITNYA
        case $GITNYA in
        1) git add . && git commit -m "${WAKTU}" && git push origin main ;;
        0) exit ;;
        esac
        echo "${GIT_MENU}" && echo -n "${GREEN}Pilih : ${WHITE}"
    done
}

while :; do
    read PILIHAN
    case $PILIHAN in
    1) nodemon . ;;
    2) prisma migrate ;;
    3) prisma generate ;;
    4) GitCommand ;;
    0) exit ;;
    *) printf "${Yellow} Hemmm , pilih yang ada aja ${White}" ;;
    esac
    MENU
done

```
