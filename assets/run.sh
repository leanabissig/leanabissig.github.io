#!/bin/bash

# Specify the root directory containing the images
ROOT_DIR="images/"

# Find and process all JPEG and PNG images
find "$ROOT_DIR" \( -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) \) | while read file; do
    echo "Processing $file..."
    # Extract the file extension
    extension="${file##*.}"
    # Define the new filename with '_compressed' appended
    newfile="${file%.*}_original.$extension"
    # Compress and resize the image
    mv "$file" "$newfile"
    magick "$newfile"  -quality 50 "$file"
done

echo "Processing complete."
