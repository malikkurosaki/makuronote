# menu v2

```sh
#!/bin/bash
menu="
PILIHAN MENU :
1. run server development mode
2. install makuro_js
"
echo "${menu}"
echo -n "Masukkan Pilihannya: "

while :
do
read choice
case $choice in
  1)  echo "mulain menjalankan server"
      nodemon server.js & webpack --mode development --watch
  ;;
  2)  echo "mulain instal package makuro_js yang sudah teristall"
      cd ./node_modules/makuro_js && npm install
  ;;
  *)  echo "hemmm , lihat pilihan di menunya"
esac
  echo -n "Masukkan Pilihannya: "
done
```
