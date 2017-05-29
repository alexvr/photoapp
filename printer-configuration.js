const printer = require('printer'), util = require('util');
const fs = require('fs');
const path = require('path');

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

exports.printImage = function printImage(chosenPrinter, mediaDirectory, imagePrefix, imageNumber) {
  console.log('printer-configuration.js - printImage()');

  let usedPrinter = chosenPrinter;

  let image = null;

  // TODO: Support other file formats.
  if (process.platform !== 'win32') {
    image = mediaDirectory + '/' + imagePrefix + imageNumber + '.jpg';
  } else {
    image = mediaDirectory + '\\' + imagePrefix + imageNumber + '.jpg';
  }

  console.log('printer-configuration.js - Printing image ' + image);

  if(process.platform !== 'win32') {
    printer.printFile({filename:image,
      printer: usedPrinter, // printer name, if missing then will print to default printer
      success:function(jobID){
        console.log('printer-configuration.js - job sent to printer (' + usedPrinter + ') with ID: ' + jobID);
      },
      error:function(err){
        console.log(err);
      }
    });
  } else {
    // not yet implemented, use printDirect and text
    let fs = require('fs');
    printer.printDirect({data:fs.readFileSync(image),
      printer: usedPrinter, // printer name, if missing then will print to default printer
      success:function(jobID){
        console.log('printer-configuration.js - job sent to printer (' + usedPrinter + ') with ID: ' + jobID);
      },
      error:function(err){
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

  if(process.platform !== 'win32') {
    printer.printFile({filename: path.resolve(filename),
      printer: usedPrinter, // printer name, if missing then will print to default printer
      success:function(jobID){
        console.log('printer-configuration.js - job sent to printer (' + usedPrinter + ') with ID: ' + jobID);
      },
      error:function(err){
        console.log(err);
      }
    });
  } else {
    // not yet implemented, use printDirect and text
    let fs = require('fs');
    printer.printDirect({data:fs.readFileSync(filename),
      printer: usedPrinter, // printer name, if missing then will print to default printer
      success:function(jobID){
        console.log('printer-configuration.js - job sent to printer (' + usedPrinter + ') with ID: ' + jobID);
      },
      error:function(err){
        console.log(err);
      }
    });
  }
};

exports.printWatermarkPhoto = function printWatermarkPhoto(watermark) {
  console.log('printer-configuration.js - printWatermarkPhoto()');

  let usedPrinter = null;
  let data = watermark;

  if( process.platform !== 'win32') {
    printer.printFile({filename:data,
      printer: usedPrinter, // printer name, if missing then will print to default printer
      success:function(jobID){
        console.log('printer-configuration.js - job sent to printer (' + usedPrinter + ') with ID: ' + jobID);
      },
      error:function(err){
        console.log(err);
      }
    });
  } else {
    // not yet implemented, use printDirect and text
    let fs = require('fs');
    printer.printDirect({data:fs.readFileSync(data),
      printer: usedPrinter, // printer name, if missing then will print to default printer
      success:function(jobID){
        console.log('printer-configuration.js - job sent to printer (' + usedPrinter + ') with ID: ' + jobID);
      },
      error:function(err){
        console.log(err);
      }
    });
  }
};
