'use client'

import { Box, Flex, Image } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import { useRef, useState } from 'react';

export default function ViewMain() {
    const videoRef: any = useRef(null);
    const [imageSrc, setImageSrc] = useState<any | null>(null);
    const interval = useInterval(() => {
        takeSnapshot()
    }, 1000)

    const startCamera = async () => {
        const stream: any = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setImageSrc("http://")
    };

    const stopCamera = () => {
        const stream = videoRef.current.srcObject;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach((track: any) => track.stop()); // Hentikan semua track
            videoRef.current.srcObject = null;
        }
    };

    const takeSnapshot = async () => {
        const canvas: any = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        canvas.getContext('2d').drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        const imageBlob: any = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        const imageUrl: any = URL.createObjectURL(imageBlob);
        setImageSrc(imageUrl);

        // Kirim gambar ke server menggunakan fetch
        const formData = new FormData();
        formData.append('image', imageBlob, 'snapshot.png');

        try {
            const response = await fetch('/api/video', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('Gambar berhasil dikirim ke server.');
            } else {
                console.error('Terjadi kesalahan saat mengirim gambar ke server.');
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat melakukan fetch:', error);
        }
    };

    return (
        <div>
            <h1>Camera Stream to Image</h1>
            {JSON.stringify(imageSrc)}
            <div>
                <button onClick={startCamera}>Buka Kamera</button>
                <button onClick={stopCamera}>Tutup Kamera</button>
                <button onClick={interval.start} >Start</button>
                <button onClick={interval.stop}>stop</button>
            </div>
            <Flex>
                <video ref={videoRef} style={{ maxWidth: '100%', display: "none" }}  />
                {imageSrc && <Box pos={"relative"}>
                    <Image width={300} src={imageSrc} alt="Snapshot" />
                </Box>}
            </Flex>
        </div>
    );
}
