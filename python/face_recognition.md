```py
import face_recognition
from PIL import Image, ImageDraw, ImageFont
import numpy as np
from urllib.request import urlopen

# This is an example of running face recognition on a single image
# and drawing a box around each person that was identified.

print("load gambar")
responseObama = urlopen(
    "https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTE4MDAzNDEwNzg5ODI4MTEw/barack-obama-12782369-1-402.jpg")
responseBiden = urlopen(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Joe_Biden_presidential_portrait.jpg/1200px-Joe_Biden_presidential_portrait.jpg")
responseObamaBiden = urlopen(
    "https://www.gannett-cdn.com/presto/2022/04/05/USAT/7b7b18b6-d933-4827-bbf3-827345a0363d-ObamaBidenSOT_deskthumb.png?crop=1920,1080,x0,y0&width=1920&height=1080&format=pjpg&auto=webp")
print("load gambar success")
# # Load a sample picture and learn how to recognize it.
obama_image = face_recognition.load_image_file(responseObama)
obama_face_encoding = face_recognition.face_encodings(obama_image)[0]

# # Load a second sample picture and learn how to recognize it.
biden_image = face_recognition.load_image_file(responseBiden)
biden_face_encoding = face_recognition.face_encodings(biden_image)[0]

# # Create arrays of known face encodings and their names
known_face_encodings = [
    obama_face_encoding,
    biden_face_encoding
]
known_face_names = [
    "Barack Obama",
    "Joe Biden"
]

# # Load an image with an unknown face
unknown_image = face_recognition.load_image_file(responseObamaBiden)

# Find all the faces and face encodings in the unknown image
face_locations = face_recognition.face_locations(unknown_image)
face_encodings = face_recognition.face_encodings(unknown_image, face_locations)

# Convert the image to a PIL-format image so that we can draw on top of it with the Pillow library
# See http://pillow.readthedocs.io/ for more about PIL/Pillow
pil_image = Image.fromarray(unknown_image)
# Create a Pillow ImageDraw Draw instance to draw with
draw = ImageDraw.Draw(pil_image)

print("memproses gambar")
# Loop through each face found in the unknown image
for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
    # See if the face is a match for the known face(s)
    matches = face_recognition.compare_faces(
        known_face_encodings, face_encoding)

    name = "Unknown"

    # If a match was found in known_face_encodings, just use the first one.
    # if True in matches:
    #     first_match_index = matches.index(True)
    #     name = known_face_names[first_match_index]

    # Or instead, use the known face with the smallest distance to the new face
    face_distances = face_recognition.face_distance(
        known_face_encodings, face_encoding)
    best_match_index = np.argmin(face_distances)
    if matches[best_match_index]:
        name = known_face_names[best_match_index]

    # Draw a box around the face using the Pillow module
    draw.rectangle(((left, top), (right, bottom)), outline=(138, 8, 8), width=5)

    # Draw a label with a name below the face
    text_width, text_height = draw.textsize(name)
    draw.rectangle(((left, bottom - text_height - 20),(right, bottom)), fill=(138, 8, 8), outline=(138, 8, 8))

    font = ImageFont.truetype(font="roboto.ttf", size=24)
    draw.text((left + 6, bottom - text_height - 20),name, fill=(255, 255, 255, 255), font=font)


# Remove the drawing library from memory as per the Pillow docs
del draw

# Display the resulting image
pil_image.show()

# You can also save a copy of the new image to disk if you want by uncommenting this line
# pil_image.save("image_with_boxes.jpg")

```
