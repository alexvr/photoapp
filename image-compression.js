const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

/**
 * Compress the given image and save it in a seperate 'compressed' folder.
 * Returns the path to the compressed image.
 * @param filePath
 */
exports.compressImage = function compressImage(filePath, mediaDirectory) {
  imagemin([filePath], mediaDirectory + '/compressed', {
    plugins: [
      imageminJpegtran(),
      imageminPngquant({quality: '65-80'})
    ]
  }).then(files => {
    console.log('Compressed file: ' + files[0].path);
  });
};
