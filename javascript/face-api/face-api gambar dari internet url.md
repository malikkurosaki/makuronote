```js
const { Canvas, Image, ImageData, loadImage } = require('canvas');
const faceapi = require('face-api.js');
const fs = require('fs');
const fetch = require('node-fetch2')

// Jalur ke folder model Face-API.js
const MODELS_PATH = './models';

// Menyiapkan model deteksi wajah dan ekspresi emosi
async function loadModels() {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_PATH);
    await faceapi.nets.faceExpressionNet.loadFromDisk(MODELS_PATH);
}

// Mendeteksi ekspresi emosi dari gambar
async function detectEmotion(imagePath) {

    const response = await fetch('https://cdn.antaranews.com/cache/800x533/2017/11/0409.jpg');
    const buffer = await response.buffer();

    // Memuat gambar menggunakan Canvas dan Face-API.js
    loadImage(buffer).then(async (img) => {


        faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
        faceapi.createCanvasFromMedia(img);

        const detections = await faceapi.detectAllFaces(img).withFaceExpressions();

        // Menggambar kotak dan label pada wajah yang terdeteksi
        const out = faceapi.createCanvasFromMedia(img);
        faceapi.draw.drawDetections(out, detections);
        faceapi.draw.drawFaceExpressions(out, detections);

        // Menyimpan gambar hasil deteksi ke file PNG
        const resultPath = './hasil_deteksi.png';
        fs.writeFileSync(resultPath, out.toBuffer('image/png'));
        console.log('Hasil deteksi ekspresi emosi tersimpan sebagai hasil_deteksi.png');
    });


}

// Menjalankan fungsi deteksi ekspresi emosi
async function run() {
    // Memuat model
    await loadModels();

    // Gambar yang akan dideteksi ekspresi emosinya
    const imagePath = './joko.jpg';

    // Melakukan deteksi ekspresi emosi
    await detectEmotion(imagePath);
}

// Menjalankan program
run();

```
