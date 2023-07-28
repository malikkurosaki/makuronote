```ts
import fs from 'fs'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const name = req.nextUrl.searchParams.get("name")
    if (!fs.existsSync(`./public/assets/files/${name}`)) return new NextResponse("404", {
        status: 400
    })

    const file = fs.readFileSync(`./public/assets/files/${name}`)

    return new NextResponse(file, {
        status: 200,
        headers: {
            "Content-Type": "text/plain"
        }
    })
}
```
