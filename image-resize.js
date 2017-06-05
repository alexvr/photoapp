const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Resizes and compresses a given image to a given width.
 * @param imagePath
 * @param outputPath
 * @param imageWidth
 */
exports.resizeAndCompressImage = function resizeAndCompressImage(imagePath, outputPath, imageWidth) {
  console.log('Resizing image...');
  console.log('Image path: ' + imagePath);
  console.log('Output path: ' + outputPath);

  sharp(imagePath)
    .resize(imageWidth)
    .toFile(outputPath, function (error, info) {
      if (error) {
        console.error(error);
      } else if (info) {
        console.log(info);
      }
    });

  // Wait one second to make sure that the toFile method has been executed (callback does not seem to be working).
  // This fixes the problem that the OS is only able to send a reference
  // of the image to the client, and not the full image.
  wait(1000);
};

function wait(ms){
  let start = new Date().getTime();
  let end = start;
  while(end < start + ms) {
    end = new Date().getTime();
  }
}
