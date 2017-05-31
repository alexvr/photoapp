const printer = require('printer'), util = require('util');
const fs = require('fs');
const path = require('path');
const Canvas = require('canvas');
const rxjs = require('rxjs');

/**
 * Get a list of all installed printers.
 * @returns {Array}
 */
exports.getAllPrinters = function getAllPrinters() {
  console.log('printer-configuration.js - getAllPrinters()');

  let printersJSON = printer.getPrinters();
  let installedPrinters = [];

  for (let i = 0; i < printersJSON.length; i++) {
    installedPrinters[i] = printersJSON[i]['name'];
  }

  return installedPrinters;
};

/**
 * Test if a photo can be send to a printer.
 * @param argumentPrinter
 */
exports.testPrintPhotoOnPrinter = function testPrintPhotoOnPrinter(argumentPrinter) {
  console.log('printer-configuration.js - testPrintPhotoOnPrinter()');

  let usedPrinter = argumentPrinter;
  let filename = './src/assets/images/photo.jpg';

  print(filename, usedPrinter);
};

/**
 * Print an image (with or without watermark)
 * @param chosenPrinter
 * @param mediaDirectory
 * @param imagePrefix
 * @param imageNumber
 * @param watermark
 * @param useWatermark
 */
exports.printImage = function printImage(chosenPrinter, mediaDirectory, imagePrefix, imageNumber, watermark, useWatermark) {
  console.log('printer-configuration.js - printImage()');

  let usedPrinter = chosenPrinter;
  let image = null;

  // TODO: Support other file formats.
  if (process.platform !== 'win32') {
    image = mediaDirectory + '/' + imagePrefix + imageNumber + '.jpg';
  } else {
    image = mediaDirectory + '\\' + imagePrefix + imageNumber + '.jpg';
  }

  if (useWatermark === 'true') {
    createWatermarkPhoto(watermark, image).subscribe(val => {
      let canvas = val;
      let watermarkImageName = mediaDirectory + '/print-images/' + imagePrefix + imageNumber + '.jpeg';
      let watermarkImage = fs.createWriteStream(watermarkImageName);
      let stream = canvas.jpegStream({
        bufsize: 4096 // output buffer size in bytes, default: 4096
        , quality: 100 // JPEG quality (0-100) default: 75
        , progressive: false // true for progressive compression, default: false
      });

      console.log('printer-configuration.js - writing png');
      stream.on('data', function (chunk) {
        watermarkImage.write(chunk);
      });

      stream.on('end', function () {
        console.log('printer-configuration.js - saved png');
        console.log('printer-configuration.js - Printing image ' + watermarkImageName);

        setTimeout(() => {
          print(watermarkImageName, usedPrinter);
        }, 1000);
      });
    });
  } else {
    print(image, usedPrinter);
  }
};

/**
 * Printing logic
 * @param image
 * @param usedPrinter
 */
function print(image, usedPrinter) {
  if (process.platform !== 'win32') {
    printer.printFile({
      filename: image,
      printer: usedPrinter, // printer name, if missing then will print to default printer
      success: function (jobID) {
        console.log('printer-configuration.js - job sent to printer (' + usedPrinter + ') with ID: ' + jobID);
      },
      error: function (err) {
        console.log(err);
      }
    });
  } else {
    // not yet implemented, use printDirect and text
    let fs = require('fs');
    printer.printDirect({
      data: fs.readFileSync(image),
      printer: usedPrinter, // printer name, if missing then will print to default printer
      success: function (jobID) {
        console.log('printer-configuration.js - job sent to printer (' + usedPrinter + ') with ID: ' + jobID);
      },
      error: function (err) {
        console.log(err);
      }
    });
  }
}


/**
 * Creating the image with watermark
 * @param watermarkString
 * @param imageLocation
 */
function createWatermarkPhoto(watermarkString, imageLocation) {
  let watermark = parseWatermark(watermarkString);
  let canvas = new Canvas(watermark.width, watermark.height);
  ctx = canvas.getContext('2d');

  return new rxjs.Observable(obs => {
    // IMAGE
    fs.readFile(imageLocation, function (err, image) {
      if (err) throw err;
      img = new Canvas.Image;
      img.src = image;
      ctx.drawImage(img, watermark.imageX, watermark.imageY,
        (img.width / 100 * watermark.imageScale), (img.height / 100 * watermark.imageScale));

      // OVERLAY
      if (watermark.overlayLocation != null) {
        console.log(watermark.overlayLocation);
        fs.readFile(watermark.overlayLocation, function (err, overlayImg) {
          if (err) throw err;
          img = new Canvas.Image;
          img.src = overlayImg;
          ctx.drawImage(img, watermark.overlayX, watermark.overlayY,
            (img.width / 100 * watermark.overlayScale), (img.height / 100 * watermark.overlayScale));

          // LOGO
          if (watermark.logoLocation != null) {
            fs.readFile(watermark.logoLocation, function (err, logoImg) {
              if (err) throw err;
              img = new Canvas.Image;
              img.src = logoImg;
              ctx.drawImage(img, watermark.logoX, watermark.logoY,
                (img.width / 100 * watermark.logoScale), (img.height / 100 * watermark.logoScale));

              console.log('printer-configuration.js - watermark: logo & overlay!');
              obs.next(canvas);
              obs.complete();
            });
          } else {
            console.log('printer-configuration.js - watermark: only overlay!');
            obs.next(canvas);
            obs.complete();
          }
        });
      } else {
        // LOGO
        if (watermark.logoLocation != null) {
          fs.readFile(watermark.logoLocation, function (err, logoImg) {
            if (err) throw err;
            img = new Canvas.Image;
            img.src = logoImg;
            ctx.drawImage(img, watermark.logoX, watermark.logoY,
              (img.width / 100 * watermark.logoScale), (img.height / 100 * watermark.logoScale));

            console.log('printer-configuration.js - watermark: only logo!');
            obs.next(canvas);
            obs.complete();
          });
        } else {
          console.log('printer-configuration.js - watermark: no logo, no overlay!');
          obs.next(canvas);
          obs.complete();
        }
      }
    })
  })
}

/**
 * Turn the jsonString into an ImageWatermark
 * @param jsonString
 * @return {{}}
 */
function parseWatermark(jsonString) {
  let watermarkJson = JSON.parse(jsonString);
  let imageWatermark = {};

  if (!util.isUndefined(watermarkJson.print)) {
    imageWatermark.print = watermarkJson.print;
  }
  if (!util.isUndefined(watermarkJson.height)) {
    imageWatermark.height = watermarkJson.height;
  }
  if (!util.isUndefined(watermarkJson.width)) {
    imageWatermark.width = watermarkJson.width;
  }
  if (!util.isUndefined(watermarkJson.logoLocation)) {
    imageWatermark.logoLocation = watermarkJson.logoLocation;
  }
  if (!util.isUndefined(watermarkJson.logoX)) {
    imageWatermark.logoX = watermarkJson.logoX;
  }
  if (!util.isUndefined(watermarkJson.logoY)) {
    imageWatermark.logoY = watermarkJson.logoY;
  }
  if (!util.isUndefined(watermarkJson.logoScale)) {
    imageWatermark.logoScale = watermarkJson.logoScale;
  }
  if (!util.isUndefined(watermarkJson.overlayLocation)) {
    imageWatermark.overlayLocation = watermarkJson.overlayLocation;
  }
  if (!util.isUndefined(watermarkJson.overlayX)) {
    imageWatermark.overlayX = watermarkJson.overlayX;
  }
  if (!util.isUndefined(watermarkJson.overlayY)) {
    imageWatermark.overlayY = watermarkJson.overlayY;
  }
  if (!util.isUndefined(watermarkJson.overlayScale)) {
    imageWatermark.overlayScale = watermarkJson.overlayScale;
  }
  if (!util.isUndefined(watermarkJson.imageWidth)) {
    imageWatermark.imageWidth = watermarkJson.imageWidth;
  }
  if (!util.isUndefined(watermarkJson.imageHeight)) {
    imageWatermark.imageHeight = watermarkJson.imageHeight;
  }
  if (!util.isUndefined(watermarkJson.imageX)) {
    imageWatermark.imageX = watermarkJson.imageX;
  }
  if (!util.isUndefined(watermarkJson.imageY)) {
    imageWatermark.imageY = watermarkJson.imageY;
  }
  if (!util.isUndefined(watermarkJson.imageScale)) {
    imageWatermark.imageScale = watermarkJson.imageScale;
  }
  return imageWatermark;
}

