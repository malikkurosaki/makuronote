```js
import path from "path"
import fs from 'fs'
export default async function gambar(req: any, res: any) {
    const filePath = path.join(process.cwd(), 'src/uploads/gambar.png')
    const gambar = fs.readFileSync(filePath)
    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Content-Length', gambar.length)
    res.send(gambar)
}
```
