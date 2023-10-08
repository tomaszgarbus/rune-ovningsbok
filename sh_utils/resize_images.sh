mkdir output
mkdir output/thumbnails

for f in `ls images_original | grep -E 'jpg|jpeg|png'`;
  do
    echo "Convering $f to 2000x2000^";
    convert images_original/$f -resize 2000x2000^ output/$f;
done;

for f in `ls images_original | grep -E 'jpg|jpeg|png'`;
  do
    echo "Convering $f to 300x200^";
    convert images_original/$f -resize 300x200^ output/thumbnails/$f;
done;

rm -rf src/images
cp -r output src/images

rm -rf RuneDroid/images
cp -r output RuneDroid/images

rm -rf output