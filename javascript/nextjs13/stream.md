# fun_htop.ts
```ts
'use server'

import { exec } from "child_process"
const html = require('ansi-html')

function iteratorToStream(iterator: any) {
    return new ReadableStream({
        async pull(controller) {
            const { value, done } = await iterator.next()
            if (done) {
                controller.close()
            } else {
                controller.enqueue(value)
            }
        },
    })
}

async function* makeIterator() {
    const { stdout, stderr } = exec('htop');

    if (stdout) {
        for await (const chunk of stdout!) {
            yield chunk;
            // await new Promise(r => setTimeout(r, 5000))
        }
    }
}

export async function fun_htop() {
    const stream = iteratorToStream(makeIterator())
    return stream
}
```

### app/api/route.ts
```ts
import { fun_htop } from '@/app/app_modules/projects/fun/htop';

export async function GET() {
    const stream = await fun_htop()

    return new Response(stream)
}
```

### htop.tsx
```tsx
'use client'

import { useShallowEffect } from "@mantine/hooks"
import { useState } from "react"
import { Box, Text } from "@mantine/core"
const html = require('ansi-html')
import { AnsiUp } from 'ansi_up'
const AnsiToHtml = require('ansi-to-html');

export default function ViewHtop() {
    const [data, setData] = useState("")
    const ansi = new AnsiUp()
    const converter = new AnsiToHtml();

    useShallowEffect(() => {
        fetch('/api/htop').then(async (response: any) => {

            response.body.pipeTo(new WritableStream({
                write: (chunk) => {
                    const buffer = Buffer.from(new Uint8Array(chunk));
                    setData(buffer.toString())
                },
            }));
        })


    }, [])

    return <>
        {/* {JSON.stringify(data)} */}
        <Box c={"white"}>
            <pre>
                <code dangerouslySetInnerHTML={{ __html: converter.toHtml(data) }} />
            </pre>
        </Box>
    </>
}
```
