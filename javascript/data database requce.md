<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [reduce](#reduce)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# reduce

```js
app.get('/chart', expressAsyncHandler(async (req, res) => {
    let chart = await prisma.transaksi2.findMany({
        select: {
            jam_in: true,
            netto_rekon: true
        },
        orderBy: {
            jam_in: "asc"
        }
    })

    let data = chart.map((e) => {
        return {
            "jam": new Date(e.jam_in).getHours(),
            "net": e['netto_rekon']
        }
    }).sort(function(a, b) {
        return parseFloat(a.jam) - parseFloat(b.jam);
    });

    var output = data.reduce(function(accumulator, cur) {
        var jam = cur.jam;
        var found = accumulator.find(function(elem) {
            return elem.jam == jam
        });

        if (found) found.net += cur.net;
        else accumulator.push(cur);
        return accumulator;
      }, []);


    res.json(output)
}));
```
