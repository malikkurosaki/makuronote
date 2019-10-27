# merubah csv ke json 

```javascript
var urlNya = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQi2DOxGEP1CFWTy7RU8QkzAqF2YgvEPuv1_yWnjB42SRhYv4Cp1lR9J3lP6BqUEH4tdn7MB1m1jGh3/pub?gid=0&single=true&output=csv";
        fetch(urlNya)
            .then(
                res => res.blob()
            ).then(blob => {
                var reader = new FileReader();
                reader.onload = function (event) {
                    var data = event.target.result;
                    var workbook = XLSX.read(data, {
                        type: 'binary'
                    });
                    workbook.SheetNames.forEach(function (sheetName) {
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[
                            sheetName]);
                        var json_object = JSON.stringify(XL_row_object, null, '\t');
                        document.getElementById("jsonObject").innerHTML = json_object;
                    })
                };
                reader.readAsBinaryString(blob);
            })

```
