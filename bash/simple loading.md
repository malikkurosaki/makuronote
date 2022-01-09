```
BAR='▉▉▉▉▉▉▉▉▉▉'
for i in {0..5}; do echo -ne "\r $i% ${BAR:0:i} "; sleep .1;  done ; echo -ne "\r 100% ";

```
