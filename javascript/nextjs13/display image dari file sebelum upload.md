```tsx
import { Box, Center, Group, Image, Stack, Text } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone';
import { useState } from 'react';
import { MdImage } from 'react-icons/md'

export default function ViewDrop() {
    const [gambar, setGambar] = useState<string>()
    return <>
        <Group position='center'>
            <Stack >
                <Dropzone accept={IMAGE_MIME_TYPE} onDrop={async (file) => {
                    const bf = Buffer.from(await file[0].arrayBuffer())
                    const blob = new Blob([bf], { type: "image/png" })
                    const imageUrl = URL.createObjectURL(blob)
                    setGambar(imageUrl)
                }}>
                    <Center w={200} h={200}>
                        <Image src={gambar} />
                        <MdImage size={52} color='grey' />
                    </Center>
                </Dropzone>
            </Stack>
        </Group>
    </>
}
```
