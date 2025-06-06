import os,sys
from PIL import Image, ImageOps
input_dir = "C:/Users/H/Documents/git/grow/image_shrinker/raw/"
output_dir = "C:/Users/H/Documents/git/grow/image_shrinker/resized/"
thumbnail_output_dir = "C:/Users/H/Documents/git/grow/image_shrinker/thumbnails/"
for inputfile in os.listdir(input_dir):   
    im = Image.open(f'{input_dir}{inputfile}')
    (height,width) = im.size
    output = f'{output_dir}{inputfile}'
    thumbnail_output = f'{thumbnail_output_dir}{inputfile}'
    ImageOps.contain(im, (1600,1600)).convert('RGB').save(output)
    ImageOps.contain(im, (300,300)).convert('RGB').save(thumbnail_output)