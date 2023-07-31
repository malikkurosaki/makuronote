```ts
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs'
import _ from 'lodash'
import { prisma } from "@/utils/prisma";
export async function POST(req: any) {

    const alamat = './public/assets/files'
    const form = await req.formData()
    const file = form.get("file")
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const fileType = file.name.substring(file.name.lastIndexOf('.') + 1);

    const dbFile = await prisma.file.create({
        data: {
            name: file.name,
            ext: fileType,
            path: alamat
        }
    })

    if (!fs.existsSync(`${alamat}/${fileType}`)) {
        await new Promise((a, b) => {
            fs.mkdirSync(`${alamat}/${fileType}`)
            console.log(`dir dibuat ${fileType}`)
            a(true)
        })
    }

    fs.writeFileSync(`${alamat}/${fileType}/${dbFile.id}.${fileType}`, fileBuffer)

    return NextResponse.json({
        success: true,
        message: "success",
        name: dbFile.id + "." + dbFile.ext,
        path: dbFile.path
    }, {
        status: 201
    })
}
```
