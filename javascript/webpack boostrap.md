### webpack.config.js

```
const path = require('path');
const webpack = require('webpack');

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
    entry: './lib/main.js',
    output: {
        filename: 'main.js',
        // eslint-disable-next-line no-undef
        path: path.resolve(__dirname, './public'),
        publicPath: "./"
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                loader: "file-loader",
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets/images/'
                }
            }
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery'",
            "window.$": "jquery"
        })
    ],
};
```


### main.js

```

const $ = require('jquery');
require('../node_modules/tabulator-tables/src/scss/tabulator.scss');
require('../node_modules/bootstrap/scss/bootstrap.scss');
require('../node_modules/bootstrap/js/dist/popover')
require('../node_modules/bootstrap/dist/js/bootstrap.bundle.min');

// eslint-disable-next-line no-unused-vars
const App = require('./componets/app');
const Button = require('./componets/button');
const ButtonDialog = require('./componets/button_dialog');
const Table = require('./componets/tabulator');

App({
    children: [
        Table({
            url: "/user",
            autoColumn: true
        }),
        Button({
            text: "tekan saja",
            onClick: () => {
                console.log($('div').length)
                
            }
        }),
        ButtonDialog()
        
    ]
});



```

### package.js

```
{
    "dependencies": {
        "@primer/css": "^19.1.1",
        "@prisma/client": "^3.5.0",
        "bootstrap": "^5.1.3",
        "cookie-parser": "^1.4.6",
        "cors": "^2.8.5",
        "css-loader": "^6.5.1",
        "express": "^4.17.1",
        "express-async-handler": "^1.1.4",
        "html-loader": "^3.0.1",
        "jquery": "^3.6.0",
        "multer": "^1.4.4",
        "popper.js": "^1.16.1",
        "puppeteer": "^11.0.0",
        "qrcode-terminal": "^0.12.0",
        "socket.io": "^4.4.0",
        "socket.io-client": "^4.4.0",
        "style-loader": "^3.3.1",
        "tabulator-tables": "^5.0.8",
        "uuid": "^8.3.2",
        "webpack-cli": "^4.9.1",
        "whatsapp-web.js": "github:pedroslopez/whatsapp-web.js#multidevice"
    },
    "name": "wa",
    "version": "1.0.0",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "run": "webpack --mode production ",
        "dev": "webpack --mode development --watch"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "description": "",
    "devDependencies": {
        "eslint": "^8.4.0",
        "prisma": "^3.5.0",
        "sass": "^1.45.1",
        "sass-loader": "^12.4.0",
        "webpack": "^5.65.0"
    }
}

```
