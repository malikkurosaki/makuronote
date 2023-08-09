```ts
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs'
import _ from 'lodash'
import { prisma } from "@/utils/prisma";
import fileTypes from "@/utils/file_type";

export async function POST(req: any) {

    // res.setHeader('Access-Control-Allow-Origin', 'https://your-domain.com'); // Ganti dengan domain Anda
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST'); // Sesuaikan dengan metode yang diizinkan


    // res.headers.set('Access-Control-Allow-Origin', "*")
    // res.headers.set('Access-Control-Allow-Methods', "POST")

    const alamat = './public/assets/files'
    const form = await req.formData()
    const file = form.get("file")
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // ext , extention
    const ext = file.name.substring(file.name.lastIndexOf('.') + 1);

    if (!_.keys(fileTypes).includes(ext)) return NextResponse.json({
        success: false,
        message: `file tidak didukung ${ext}`
    })


    const dbFile = await prisma.file.create({
        data: {
            name: file.name,
            ext: ext,
            path: alamat
        },
        select: {
            id: true,
            name: true,
        }
    })

    if (!fs.existsSync(`${alamat}/${ext}`)) {
        await new Promise((a, b) => {
            fs.mkdirSync(`${alamat}/${ext}`)
            console.log(`dir dibuat ${ext}`)
            a(true)
        })
    }

    fs.writeFileSync(`${alamat}/${ext}/${dbFile.id}.${ext}`, fileBuffer)

    console.log("upload file", JSON.stringify(dbFile))
    return NextResponse.json({
        success: true,
        message: "success",
        data: dbFile
    }, {
        status: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
    })
}

```
