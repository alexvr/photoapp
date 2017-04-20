'use strict';

// Modules to control application life, create native browser window, inter-process communication and access printers.
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const printer = require("printer");

// Load environment variables in .env file and live reload when in development.
require('dotenv').config();
require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let window = null;

let isWindows = process.platform === 'win32';

app.on('ready', function () {

  // Check which OS the machine is on.
  console.log('Is OS Windows? ', isWindows);

  // Initialize the window to our specified dimensions
  window = new BrowserWindow({width: 1000, height: 900});

  // Specify entry point
  if (process.env.PACKAGE === 'true') {
    window.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  } else {
    window.loadURL(process.env.HOST);
    window.webContents.openDevTools();
  }

  // Show dev tools
  // Remove this line before distributing
  window.webContents.openDevTools();

  // Remove window once app is closed
  window.on('closed', function () {
    window = null;
  });

});

app.on('activate', () => {
  if (window === null) {
    createWindow();
  }
})
;

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Listen for async message from renderer process.
ipcMain.on('async', (event, arg) => {

  console.log("ipcMain - incoming argument: " + arg);

  // PrinterService - getAllPrinters()
  if (arg === 'get-all-printers') {
    console.log('main.js - getAllPrinters()');
    event.sender.send('async-get-all-printers', getAllPrinters());
  }

  // PrinterService - testPrintPhotoOnPrinter()
  if (arg[0] === 'test-print-photo-on-printer') {
    console.log('main.js - testPrintPhotoOnPrinter()');
    console.log("printer - " + arg[1]);
    testPrintPhotoOnPrinter(arg[1]);
    event.sender.send('async-test-print-photo-on-printer', "Photo has been sent to printer!");
  }

});

/**
 * Get a list of all installed printers.
 * @returns {Array}
 */
function getAllPrinters() {
  let printersJSON = printer.getPrinters();
  let installedPrinters = [];

  for (let i = 0; i < printersJSON.length; i++) {
    installedPrinters[i] = printersJSON[i]['name'];
  }

  return installedPrinters;
}

function testPrintPhotoOnPrinter(argumentPrinter) {
  let usedPrinter = argumentPrinter;
  let filename = "./src/assets/images/photo.jpg";

  if( process.platform !== 'win32') {
    printer.printFile({filename:filename,
      printer: usedPrinter, // printer name, if missing then will print to default printer
      success:function(jobID){
        console.log("main.js - job sent to printer (" + usedPrinter + ") with ID: " + jobID);
      },
      error:function(err){
        console.log(err);
      }
    });
  } else {
    // not yet implemented, use printDirect and text
    let fs = require('fs');
    printer.printDirect({data:fs.readFileSync(filename),
      printer: process.env[3], // printer name, if missing then will print to default printer
      success:function(jobID){
        console.log("sent to printer with ID: "+jobID);
      },
      error:function(err){
        console.log(err);
      }
    });
  }
}
