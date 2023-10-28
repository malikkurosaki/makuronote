### VIDEO TRANSITION

```sh
ffmpeg \
-loop 1 -t 3 -i ./assets/img1.png \
-loop 1 -t 3 -i ./assets/img2.png \
-loop 1 -t 3 -i ./assets/img3.png \
-loop 1 -t 3 -i ./assets/img4.png \
-loop 1 -t 3 -i ./assets/img5.png \
-i lagu.mp3 -f mp4 \
-filter_complex \
"[0][1]xfade=transition=slideleft:duration=0.5:offset=2.5[f0]; \
[f0][2]xfade=transition=slideleft:duration=0.5:offset=5[f1]; \
[f1][3]xfade=transition=slideleft:duration=0.5:offset=7.5[f2]; \
[f2][4]xfade=transition=slideleft:duration=0.5:offset=10[f3]" \
-map "[f3]" \
-map 5 \
-r 25 -pix_fmt yuv420p -vcodec libx264 -c:a aac -strict experimental -y output-swipe.mp4

```
