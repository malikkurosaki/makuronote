```js
function generateRoute() {
    const fs = require('fs');
    const path = require('path');
    const _ = require('lodash');
    const beauty = require('js-beautify');

    const pt = path.parse('./xrouter');
    const dir = fs.readdirSync(path.join(pt.base));

    let listHasil = [];
    for (let itm of dir) {
        let name = path.parse(itm).name;
        let method = name.split("_").splice(-1);
        let host = "${Config.host}"
        let query = "${query ?? ''}"
        let body = ""
        let route = `Future<http.Response> ${_.camelCase(name)}({String? query ${method != 'get' ? ',Map? body' : ''}}) =>
      http.${method}(Uri.parse("${host}/${_.kebabCase(name)}?${query}"), headers: {"token": Vl.token.val}, ${method != 'get' ? 'body: body' : ''});`

        listHasil.push(route);

    }

    let temp = `
    import 'package:http/http.dart' as http;
    import 'package:src/config.dart';
    import 'package:src/vl.dart';

    class Rot {
        ${listHasil.join('\n')}
    }

    `

    fs.writeFileSync(path.join(__dirname, "./src/lib/rot.dart"), beauty(temp));
    console.log('generate route completed');

}
```
