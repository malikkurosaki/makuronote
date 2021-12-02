

### webpack.config.js

```js
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, './dist'),
        publicPath: "./"
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "dist/"),
        },
        port: 3000,
        devMiddleware: {
            publicPath: "https://localhost:3000",
        },
        hot: "only",
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
        ],
    }

};
```


### package.json

```json
{
  "name": "vue",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --mode production",
    "dev": "webpack serve --mode development"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "html-loader": "^3.0.1",
    "webpack": "^5.64.4",
    "webpack-cli": "^4.9.1",
    "webpack-dev-server": "^4.6.0"
  },
  "dependencies": {
    "jquery": "^3.6.0",
    "lodash": "^4.17.21",
    "tabulator-tables": "^5.0.7"
  }
}

```

### src/index.js

```js
var Tabulator = require('tabulator-tables').Tabulator;
import drawer from './../dist/drawer.html'
import header from './../dist/header.html'
import footer from './../dist/footer.html'
import content from './../dist/content.html'
import addUser from './../dist/add_user.html'
const $ = require('jquery');


$('#sidebar').html(drawer);
$('#header').html(header);
$('#footer').html(footer);

$('#content').append(content);
$('#content').append(addUser);

$("#add_user").on('click', () => {
});

$("#user").on('click', () => {
    $('#content').html(content)
});


new Tabulator("#table", {
    data: makanan(),
    autoColumns: true
});

function makanan(){
    return [
        {
          "name": "1. Parsnip and shank casserole"
        },
        {
          "name": "2. Turkey and chicken panini"
        },
        {
          "name": "3. Barley and pesto soup"
        },
        {
          "name": "4. Treacle and cheese biscuits"
        },
        {
          "name": "5. Chickpea and cucumber bagel"
        },
        {
          "name": "6. Kiwi fruit and strawberry yoghurt"
        },
        {
          "name": "7. Rabbit and pepper stew"
        },
        {
          "name": "8. Fish sauce and hazelnut salad"
        },
        {
          "name": "9. Mozzarella and squash kebab"
        },
        {
          "name": "10. Kalonji and dragon fruit salad"
        },
        {
          "name": "11. Squash and pepper sausages"
        },
        {
          "name": "12. Ginger and cocoa cake"
        },
        {
          "name": "13. Strawberry and elderberry salad"
        },
        {
          "name": "14. Caramel and mango mousse"
        },
        {
          "name": "15. Stilton and caper penne"
        },
        {
          "name": "16. Rambutan and chickpea madras"
        },
        {
          "name": "17. Beetroot and chocolate cake"
        },
        {
          "name": "18. Feta and ricotta wontons"
        },
        {
          "name": "19. Peach and rosemary buns"
        },
        {
          "name": "20. Plumcot and mackerel salad"
        }
      ]
}


```

