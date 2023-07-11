```py
import face_recognition
import cv2
import os


def load_known_faces(directory):
    known_faces = []
    known_names = []

    for filename in os.listdir(directory):
        if filename.endswith(".jpg") or filename.endswith(".png"):
            image_path = os.path.join(directory, filename)
            image = face_recognition.load_image_file(image_path)
            face_encoding = face_recognition.face_encodings(image)[0]
            known_faces.append(face_encoding)
            known_names.append(os.path.splitext(filename)[0])

    return known_faces, known_names


def detect_and_identify_faces(image_path, known_faces, known_names):
    # Memuat gambar
    image = cv2.imread(image_path)
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Mendeteksi lokasi wajah dalam gambar
    face_locations = face_recognition.face_locations(rgb_image)
    face_encodings = face_recognition.face_encodings(rgb_image, face_locations)

    # Memberikan tanda dan nama untuk setiap wajah terdeteksi
    for face_location, face_encoding in zip(face_locations, face_encodings):
        top, right, bottom, left = face_location

        # Mengidentifikasi wajah berdasarkan encoding
        matches = face_recognition.compare_faces(known_faces, face_encoding)
        name = "Unknown"

        # Jika ada wajah yang cocok, ambil nama yang cocok
        if True in matches:
            matched_index = matches.index(True)
            name = known_names[matched_index]

        # Memberikan tanda pada wajah dengan kotak dan nama
        cv2.rectangle(image, (left, top), (right, bottom), (0, 255, 0), 2)
        cv2.putText(image, name, (left, top - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

    # Menyimpan hasil dengan nama baru
    output_path = os.path.splitext(image_path)[0] + "_result.png"
    cv2.imwrite(output_path, image)


if __name__ == "__main__":
    # Memuat wajah yang dikenal
    known_faces, known_names = load_known_faces(
        "sumber")

    # Mendeteksi dan mengidentifikasi wajah dalam gambar
    detect_and_identify_faces("joko.jpg", known_faces, known_names)

```
