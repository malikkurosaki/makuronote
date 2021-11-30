```sh
#!/bin/bash

PARAM=(
    ./main 
    --output ./build/app/main
    --compact  true 
    --control-flow-flattening  false 
    --dead-code-injection  false 
    --debug-protection  false 
    --debug-protection-interval  false 
    --disable-console-output  false
    --identifier-names-generator  'hexadecimal' 
    --log  true 
    --numbers-to-expressions  false 
    --rename-globals  false 
    --rotate-string-array  true 
    --self-defending  true 
    --shuffle-string-array  true 
    --simplify  true 
    --split-strings  false 
    --string-array  true 
    --string-array-index-shift  true 
    --string-array-wrappers-count  1 
    --string-array-wrappers-chained-calls  true 
    --string-array-wrappers-parameters-max-count  2 
    --string-array-wrappers-type  'variable' 
    --string-array-threshold  1 
    --unicode-escape-sequence  false
)

javascript-obfuscator ${PARAM[@]}
cp -r prisma build/app/prisma
cp .env build/app/.env
cp package.json build/app/package.json
cp main/homes/index.html build/app/main/homes/index.html
cp /Users/probus/Documents/projects/my_flutter_projects/adipos/build/app/outputs/flutter-apk/app-armeabi-v7a-release.apk build/order_taker.apk
zip -r build/server_order_taker.zip build/app
```
