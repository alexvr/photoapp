const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

/**
 * Compress the given image and save it in a seperate 'compressed' folder.
 * Returns the path to the compressed image.
 * @param filePath
 * @param mediaDirectory
 */
exports.compressImage = function compressImage(filePath, mediaDirectory, compressionQuality) {
  let quality;

  switch(compressionQuality) {
    case 'HIGH':
      quality = '80-99';
      break;
    case 'MEDIUM':
      quality = '65-80';
      break;
    case 'LOW':
      quality = '50-65';
      break;
  }

  imagemin([filePath], mediaDirectory + '/compressed', {
    plugins: [
      imageminJpegtran(),
      imageminPngquant({quality: quality})
    ]
  }).then(files => {
    console.log('Compressed file: ' + files[0].path);
  });
};
