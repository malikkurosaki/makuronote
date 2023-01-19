random array string

```
=INDEX(FILTER(source!R3:R, source!R3:R<>""),RANDBETWEEN(1, COUNTA(source!R3:R)))
```
