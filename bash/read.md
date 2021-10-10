# read

```bash
#!/bin/bash

# option -r untuk mencegah special carakter yang bisa menyebabkan error
# read -r var1 var2 
# printf "var1: %s \nvar2: %s\n" "$var1" "$var2"

# echo "Hello, world!" | (read; echo "$REPLY")

# echo "Linux is awesome." | (read var1 var2; echo -e "Var1: $var1 \nVar2: $var2")

## pilihan yes or not
# while true; do
#     read -r -p "Do you wish to reboot the system? (Y/N): " answer
#     case $answer in
#         [Yy]* ) echo "pilihan ya"; break;;
#         [Nn]* ) exit;;
#         * ) echo "Please answer Y or N.";;
#     esac
# done

# untuk password , text tidak muncul
# read -r -s -p "Enter your password: " password
# echo $password


# loop
# read -r -a MY_ARR <<< "Linux is awesome."
# for i in "${MY_ARR[@]}"; do 
#   echo "$i"
# done

```
