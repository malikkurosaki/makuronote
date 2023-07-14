```js
import fs from 'fs'
import { NextApiRequest } from 'next'
import { NextRequest, NextResponse } from 'next/server'


export function GET(req: Request, { params }: any) {
    const data = fs.readdirSync('./src/assets/hasil')

    try {

        // Read the image file
        const data = fs.readFileSync(`./src/assets/hasil/${params.name}`);

        // Set the appropriate response headers
        // res.setHeader('Content-Type', 'image/jpeg');
        // res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache the image for 1 hour

        // Send the image data as the response

        return new NextResponse(data, {
            status: 200,
            headers: {
                "Content-Type": "image/jpeg",
            },
        });
    } catch (error: any) {
        console.error('Error serving image:', error);

        return NextResponse.json({ error: error.message }, { status: 500, });
    }


}
```
