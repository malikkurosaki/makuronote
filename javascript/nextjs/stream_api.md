```js
import { spawn } from 'child_process'

export async function GET() {
    // Create a new ReadableStream
    const stream = new ReadableStream({
        start(controller) {
            const child = spawn('/bin/sh', ['-c', 'git add -A && git commit -m "update" && git push origin main']);
            // Handle stdout data from the child process
            child.stdout.on('data', (data) => {
                // Push data into the stream
                controller.enqueue(data);
            });

            child.stderr.on('data', (data) => {
                // Push data into the stream
                controller.enqueue(data);
            })
            // Handle the end of the child process
            child.on('close', () => {
                // Close the stream
                controller.close();
            });
        }
    });

    // Return the response with the stream
    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
        },
    });
}

async function build() {
    let log = ''
    return await new Promise(resolve => {
        const child = spawn('/bin/sh', ["-c", "ls"])
        child.stdout.on('data', (data) => {
            log += data
        })

        child.stderr.on('data', (data) => {
            log += data.toString()
        })
        child.on('close', async (code) => {
            resolve(code)
        })
    })
}
```
