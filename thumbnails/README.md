Before adding a video file to this folder, they should be compressed. One way to do this is via the command line with ffmpeg.

ffmpeg -i input.mp4 -pix_fmt yuv420p -vf scale=188:188 -profile:v baseline -level 3.0 -crf 20 -movflags +faststart output.mp4

Poster images should be 188x188, you can crop an input image that is 190x190 like so:

ffmpeg -i input.png -vf crop=188:188:1:1 output.png
