```ts
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs'
import fileTypes from "@/utils/file_type";
import { headers } from 'next/headers'

export async function GET(req: NextRequest, { params }: { params: { name: string } }) {

    const nama = params.name
    const ext = nama.substring(nama.lastIndexOf('.') + 1);
    const dir = "./public/assets/files/"

    console.log(headers().get("token"))

    console.log("token")

    console.log(`${dir}/${ext}/${nama}`)
    const ada = fs.existsSync(`${dir}/${ext}/${nama}`)
    if (!ada) return new NextResponse("file tidak ditemukan")

    const file = fs.readFileSync(`${dir}/${ext}/${nama}`)
    const mime = fileTypes[ext].mimeType

    if (!mime) return new NextResponse("file tidak didukung")

    return new NextResponse(file, {
        headers: {
            "Content-Type": mime
        }
    })
}
```
