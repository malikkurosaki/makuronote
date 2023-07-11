```py
import cv2
import requests
from io import BytesIO
from keras.models import load_model
import numpy as np
from PIL import Image

# Load model
model = load_model('./model_v6_23.hdf5')

# Load haarcascade for face detection
face_cascade = cv2.CascadeClassifier('./haarcascade_frontalface_default.xml')

# Download image from URL
url = 'https://www.scienceofpeople.com/wp-content/uploads/2013/09/faces-small.jpg'
response = requests.get(url)
image = Image.open(BytesIO(response.content))

# Convert image to OpenCV format
open_cv_image = np.array(image)
image_rgb = open_cv_image.copy()

# Convert image to grayscale
gray = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2GRAY)

# Detect faces in the image
faces = face_cascade.detectMultiScale(gray, 1.3, 5)

# Iterate over detected faces
for (x, y, w, h) in faces:
    # Extract face region of interest
    roi_gray = gray[y:y + h, x:x + w]
    roi_gray = cv2.resize(roi_gray, (48, 48), interpolation=cv2.INTER_AREA)

    # Normalize and preprocess the face image
    roi_gray = roi_gray / 255.0
    roi_gray = np.reshape(roi_gray, (1, 48, 48, 1))

    # Predict emotion
    emotions = model.predict(roi_gray)[0]
    emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']
    max_index = np.argmax(emotions)
    emotion = emotion_labels[max_index]

    # Determine color for bounding box and emotion text
    color = (0, 255, 0)  # Green color for example
    if emotion == 'Angry':
        color = (255, 0, 0)  # Red color
    elif emotion == 'Happy':
        color = (255, 255, 0)  # Yellow color

    # Draw bounding box and emotion label on the image
    cv2.rectangle(image_rgb, (x, y), (x + w, y + h), color, 2)
    cv2.putText(image_rgb, emotion, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)

# Convert OpenCV image back to PIL format
result_image = Image.fromarray(image_rgb)

# Save the result image
result_image.save('result.png')

```
