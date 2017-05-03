const printer = require('printer'), util = require('util');

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

  if( process.platform !== 'win32') {
    printer.printFile({filename:filename,
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