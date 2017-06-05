const printer = require('printer'), util = require('util');
const fs = require('fs');
const path = require('path');
const watermarkConfig = require('./watermark-configuration');
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
  return new rxjs.Observable(observable => {
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
      watermarkConfig.createWatermarkPhoto(watermark, image).subscribe(val => {
        let canvas = val;
        let watermarkImageName = mediaDirectory + '/print-images/' + imagePrefix + imageNumber + '.jpeg';
        let watermarkImage = fs.createWriteStream(watermarkImageName);
        let stream = canvas.jpegStream({
          bufsize: 4096 // output buffer size in bytes, default: 4096
          , quality: 100 // JPEG quality (0-100) default: 75
          , progressive: false // true for progressive compression, default: false
        });

        console.log('printer-configuration.js - writing jpeg');
        stream.on('data', function (chunk) {
          watermarkImage.write(chunk);
        });

        stream.on('end', function () {
          console.log('printer-configuration.js - saved jpeg');
          console.log('printer-configuration.js - Printing image ' + watermarkImageName);

          setTimeout(() => {
            print(watermarkImageName, usedPrinter);
            observable.next();
            observable.complete();
          }, 1000);
        });
      });
    } else {
      print(image, usedPrinter);
      observable.next();
      observable.complete();
    }
  });
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
        console.error(err);
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
        console.error(err);
      }
    });
  }
}


