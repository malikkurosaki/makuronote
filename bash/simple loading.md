<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->



<!-- END doctoc generated TOC please keep comment here to allow auto update -->

```
BAR='▉▉▉▉▉▉▉▉▉▉'
for i in {0..5}; do echo -ne "\r $i% ${BAR:0:i} "; sleep .1;  done ; echo -ne "\r 100% ";

```
