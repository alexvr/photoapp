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

let printers = null;

app.on('ready', function () {

  // Check which OS the machine is on.
  console.log('Is OS Windows? ', isWindows);

  // Get all installed printers.
  printers = getAllPrinters();

  // Initialize the window to our specified dimensions
  window = new BrowserWindow({width: 1000, height: 700});

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

  // getAllPrinters
  if (arg === 'get-all-printers') {
    console.log('main.js - getAllPrinters()');
    event.sender.send('async-get-all-printers', printers);
  }

});

// Get a list of all installed printers.
function getAllPrinters() {
  let printersJSON = printer.getPrinters();
  let printers = [];

  for (let i = 0; i < printersJSON.length; i++) {
    printers[i] = printersJSON[i]['name'];
  }

  return printers;
}
