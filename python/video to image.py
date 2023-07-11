### split.py

```py
import cv2


def split_video_to_images(video_path, output_folder):
    # Open the video file
    video = cv2.VideoCapture(video_path)

    # Check if the video file was successfully opened
    if not video.isOpened():
        print("Error opening video file")
        return

    # Get some information about the video
    frame_count = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = video.get(cv2.CAP_PROP_FPS)
    width = int(video.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(video.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # Read and save each frame as an image
    for frame_number in range(frame_count):
        # Read the next frame
        ret, frame = video.read()

        # Check if the frame was successfully read
        if not ret:
            print("Error reading frame {}".format(frame_number))
            break

        # Generate the output image file path
        output_path = "{}/frame_{:04d}.jpg".format(output_folder, frame_number)

        # Save the frame as an image
        cv2.imwrite(output_path, frame)

        # Display the progress
        print("Saved frame {} / {}".format(frame_number + 1, frame_count))

    # Release the video file
    video.release()

    print("Splitting complete")


# Example usage
split_video_to_images("Fear.mov", "train_directory/Fear")

```
