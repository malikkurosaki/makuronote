```sh
_set() {
    DATA=$(cat xx.txt)
    if [[ "$DATA" == *"$1="* ]]; then
        echo -e "$DATA" | sed -e "s/$1=.*/$1=\"$2\"/" >xx.txt
    else
        echo -e "$1=\"$2\"" >>xx.txt
    fi
   echo "$(tput setaf 3)data tersimpan ...!$(tput sgr0)"
   
}

_get(){
    local DATA=$(cat xx.txt)
    if [[ "$DATA" == *"$1="* ]]; then
        # find data value
        local value=$(echo "$DATA" | grep "$1=" | cut -d "=" -f2)
        echo $value | sed -e "s/^\"//g" | sed -e "s/\"$//g"
    else
        echo "data tidak ditemukan"
    fi
}

_get nama
```
