### main.py

```py
from flask import Flask, Response, render_template
import cv2
import numpy as np

app = Flask(__name__)

camera = cv2.VideoCapture(0)  # Membuka kamera dengan nomor indeks 0

# print(cv2.data.haarcascades)


def generate_frames():

    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            face_cascade = cv2.CascadeClassifier('cascade.xml')
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
            
            for (x, y, w, h) in faces:
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/')
def index():
    return render_template('index.html')  # Ganti ini dengan template HTML Anda

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True)
```

### templates/index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Face Detection</title>
</head>
<body>
    <h1>Face Detection</h1>
    <img style="width: 300px;" src="{{ url_for('video_feed') }}" alt="Video Stream">
</body>
</html>

```

