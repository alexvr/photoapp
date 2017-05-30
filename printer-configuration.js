const printer = require('printer'), util = require('util');
const fs = require('fs');
const path = require('path');
const Canvas = require('canvas');
const watermarkConfig = require('./watermark-configuration');

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

exports.printImage = function printImage(chosenPrinter, mediaDirectory, imagePrefix, imageNumber, watermark) {
  console.log('printer-configuration.js - printImage()');

  let usedPrinter = chosenPrinter;

  let image = null;

  // TODO: Support other file formats.
  if (process.platform !== 'win32') {
    image = mediaDirectory + '/' + imagePrefix + imageNumber + '.jpg';
  } else {
    image = mediaDirectory + '\\' + imagePrefix + imageNumber + '.jpg';
  }

  let canvas = createWatermarkPhoto(watermark, image);
  let watermarkImage = fs.createWriteStream(mediaDirectory + '/print-images/' + imagePrefix + imageNumber + '.png');
  let stream = canvas.pngStream();

  stream.on('data', function (chunk) {
    watermarkImage.write(chunk);
  });

  stream.on('end', function () {
    console.log('saved png');
  });

  console.log('printer-configuration.js - Printing image ' + image);

  if (process.platform !== 'win32') {
    printer.printFile({
      filename: watermarkImage,
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
      data: fs.readFileSync(watermarkImage),
      printer: usedPrinter, // printer name, if missing then will print to default printer
      success: function (jobID) {
        console.log('printer-configuration.js - job sent to printer (' + usedPrinter + ') with ID: ' + jobID);
      },
      error: function (err) {
        console.log(err);
      }
    });
  }


};

/**
 * Test if a photo can be send to a printer.
 * @param argumentPrinter
 */
exports.testPrintPhotoOnPrinter = function testPrintPhotoOnPrinter(argumentPrinter) {
  console.log('printer-configuration.js - testPrintPhotoOnPrinter()');

  let usedPrinter = argumentPrinter;
  let filename = './src/assets/images/photo.jpg';

  if (process.platform !== 'win32') {
    printer.printFile({
      filename: path.resolve(filename),
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
      data: fs.readFileSync(filename),
      printer: usedPrinter, // printer name, if missing then will print to default printer
      success: function (jobID) {
        console.log('printer-configuration.js - job sent to printer (' + usedPrinter + ') with ID: ' + jobID);
      },
      error: function (err) {
        console.log(err);
      }
    });
  }
};

/**
 * Creating the picture with watermark
 */

function createWatermarkPhoto(watermark, imageLocation) {
  let canvas = new Canvas(watermark.width, watermark.height);
  ctx = canvas.getContext('2d');

  // IMAGE
  let image = new Image();
  fs.readFile(imageLocation, function (err, data) {
    image.src = 'data:image/png;base64,' + new Buffer(data).toString('base64');
    if (err) {
      console.error('Error occurred while reading the image: ' + err);
    }
  });
  ctx.drawImage(image, watermark.imageX, watermark.imageY,
    (image.width / 100 * watermark.imageScale), (image.height / 100 * watermark.imageScale));

  // OVERLAY
  if (watermark.overlayLocation != null) {
    let overlay = new Image();
    overlay.src = watermark.overlayLocation;
    ctx.drawImage(overlay, watermark.overlayX, watermark.overlayY,
      (overlay.width / 100 * watermark.overlayScale), (watermark.height / 100 * watermark.overlayScale));
  }

  // LOGO
  if (watermark.logoLocation != null) {
    let logo = new Image();
    logo.src = watermark.logoLocation;
    ctx.drawImage(this.logo, watermark.logoX, watermark.logoY,
      (this.logo.width / 100 * watermark.logoScale), (this.logo.height / 100 * watermark.logoScale));
  }

  return canvas;
}
