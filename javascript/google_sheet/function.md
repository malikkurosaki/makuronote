random array string=

```
=INDEX(FILTER(source!R3:R, source!R3:R<>""),RANDBETWEEN(1, COUNTA(source!R3:R)))
```


if empty randome

```bash
=if(ISBLANK(C2:C)=true, "", INDEX(FILTER(source!$R$3:$R$8, source!$R$3:$R$8<>""),RANDBETWEEN(1, COUNTA(source!$R$3:$R$8))))
```
