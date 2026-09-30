<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [bash menu](#bash-menu)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## bash menu

```sh
#!/bin/bash
info="
=============
   MAKURO
malikkurosaki
=============
MENU :
"
echo "${info}"
PS3="Pilih Menunya : "
JAM=`date +"%d-%m-%Y %T"`

select opt in "push git" "jam" "keluar"; do

  case $opt in
    "push git")
        git add .
        git commit -m "makuro ${JAM}"
        git push origin main
        echo "---------------"
        echo "     BERES     "
        echo "---------------"
        ;;
    "jam")
        echo ${JAM}
     ;;
    "keluar")
        break
     ;;
    *) 
      echo "Invalid option $REPLY"
      ;;
  esac
done


```
