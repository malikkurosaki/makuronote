
### App.py

```py
import cv2
import numpy as np
# from tensorflow.keras.models import load_model
from flask import Flask, render_template, Response
import tensorflow as tf
from tensorflow import keras
emotion_model = keras.models.load_model('emotion_model.h5')

app = Flask(__name__)
app = Flask(__name__, template_folder='./')


def detect_faces_and_emotions(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    for (x, y, w, h) in faces:
        roi = gray[y:y + h, x:x + w]
        roi = cv2.resize(roi, (48, 48))
        roi = np.reshape(roi, (1, 48, 48, 1)).astype('float32') / 255.0
        emotion_labels = ['Angry', 'Disgust', 'Fear',
                          'Happy', 'Sad', 'Surprise', 'Neutral']
        emotion_prediction = emotion_model.predict(roi)
        emotion_index = np.argmax(emotion_prediction)
        emotion = emotion_labels[emotion_index]

        # Tambahkan kotak dan keterangan emosi pada frame
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
        cv2.putText(frame, emotion, (x, y - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

    return frame


def detect_emotion(frame):
    # Preprocessing gambar
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    # Jika wajah ditemukan, lakukan prediksi emosi
    if len(faces) > 0:
        (x, y, w, h) = faces[0]
        roi = gray[y:y + h, x:x + w]
        roi = cv2.resize(roi, (48, 48))
        roi = np.reshape(roi, (1, 48, 48, 1)).astype('float32') / 255.0
        emotion_labels = ['Angry', 'Disgust', 'Fear',
                          'Happy', 'Sad', 'Surprise', 'Neutral']
        emotion_prediction = emotion_model.predict(roi)
        emotion_index = np.argmax(emotion_prediction)
        emotion = emotion_labels[emotion_index]
        return emotion
    else:
        return None


def generate_frames():
    video_capture = cv2.VideoCapture(0)
    while True:
        ret, frame = video_capture.read()
        if not ret:
            break

        # tambahan detext emotion and face
        frame = detect_faces_and_emotions(frame)
        emotion = detect_emotion(frame)
        if emotion:
            cv2.putText(frame, emotion, (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    video_capture.release()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
    app.run(debug=True)

```

### index.html

```html
<!DOCTYPE html>
<html>
<head>
    <title>Deteksi Emosi</title>
</head>
<body>
    <h1>Deteksi Emosi Seseorang dari Kamera</h1>
    <div>
        <img src="{{ url_for('video_feed') }}">
    </div>
</body>
</html>
```



