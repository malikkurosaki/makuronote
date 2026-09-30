<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->



<!-- END doctoc generated TOC please keep comment here to allow auto update -->

```ts
import { NextApiResponse } from 'next';
// pages/api/upload.ts
import multer from 'multer';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs'

export const config = {
    api: {
        bodyParser: false, // nonaktifkan built-in body parsing Next.js agar multer dapat menangani unggahan
    },
};


// Handler untuk menangani endpoint /api/upload
export async function POST(req: any, res: any) {
    const form = await req.formData()
    const file = form.get("file")

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(`./public/assets/files/${file.name}`, fileBuffer)

    return new NextResponse("success")
};


```
