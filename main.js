// Modules to control application life, create native browser window and inter-process communication.
const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const {dialog} = require('electron');

// Custom requires for the photapplication.
const printerConfiguration = require('./printer-configuration');
const serverConfiguration = require('./server-configuration');
const watermarkConfiguration = require('./watermark-configuration');
const cloudinaryConfiguration = require('./cloudinary-configuration');

// Load environment variables in .env file and live reload when in development.
require('dotenv').config();
require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let window = null;

app.on('ready', function () {

  // Check which OS the machine is on.
  console.log('Is OS Windows? ', process.platform === 'win32');

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
  console.log('ipcMain - incoming argument: ' + arg);

  // PrinterService - getAllPrinters()
  if (arg === 'get-all-printers') {
    let allPrinters = printerConfiguration.getAllPrinters();
    event.sender.send('async-get-all-printers', allPrinters);
  }

  // PrinterService - testPrintPhotoOnPrinter()
  if (arg[0] === 'test-print-photo-on-printer') {
    printerConfiguration.testPrintPhotoOnPrinter(arg[1]);
    event.sender.send('async-test-print-photo-on-printer', 'Photo has been sent to printer!');
  }

  // PrinterService - testPrintPhotoOnPrinter()
  if (arg[0] === 'test-print-photo-on-printer-with-name') {
    printerConfiguration.testPrintPhotoOnPrinter(arg[1]);
    event.sender.send('async-test-print-photo-on-printer-with-name', 'Photo has been sent to printer!');
  }

  // PrinterService - printWatermarkPhoto()
  if (arg[0] === 'print-watermark-photo') {
    printerConfiguration.printWatermarkPhoto(arg[1]);
    event.sender.send('async-print-watermark-photo', 'Watermark has been sent to printer!');
  }

  // PrinterService - createWatermarkPhoto()
  if (arg[0] === 'draw-watermark-photo') {
    printerConfiguration.createWatermarkPhoto(arg[1]);
    event.sender.send('async-draw-watermark-photo', 'Watermark is created!');
  }

  // ServerService - startServer()
  if (arg[0] === 'start-server') {
    let serverHost = serverConfiguration.startServer(arg[1], arg[2], arg[3], arg[4], window);
    event.sender.send('async-start-server', serverHost);
  }

  // Get watermark image path
  if (arg === 'get-watermark-image-path') {
    watermarkConfiguration.getImagePath(event);
  }

  // Get watermark image dataURI
  if (arg[0] === 'get-watermark-image-dataURI') {
    let dataURI = watermarkConfiguration.getImageDataUri(arg[1], event);
  }

  // Get directory path
  if (arg === 'get-directory-path') {
    dialog.showOpenDialog({
      properties: ['openDirectory']
    }, selectedDirectory => {
      if (selectedDirectory !== null) {
        event.sender.send('async-get-directory-path', selectedDirectory.toString());
      } else {
        console.log('cancelled get-directory-path');
      }
    });
  }

  // Get file path
  if (arg === 'get-file-path') {
    dialog.showOpenDialog({
      properties: ['openFile']
    }, selectedFile => {
      if (selectedFile !== null) {
        event.sender.send('async-get-file-path', selectedFile.toString());
      } else {
        console.log('cancelled get-file-path');
      }
    });
  }

  // Upload cloudinary-file
  if (arg[0] === 'upload-cloudinary-file') {
    cloudinaryConfiguration.uploadFile(event, arg[1]);
  }

  // Delete cloudinary-file
  if (arg[0] === 'delete-cloudinary-file') {
    cloudinaryConfiguration.deleteFile(event, arg[1]);
  }
});
