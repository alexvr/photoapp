// Modules to control application life, create native browser window, inter-process communication and access printers.
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const printer = require("printer"), util = require('util');

// Load environment variables in .env file and live reload when in development.
require('dotenv').config();
require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let window = null;

app.on('ready', function () {

  // Look for printers installed on this machine.
  //console.log("installed printers:\n"+util.inspect(printer.getPrinters(), {colors:true, depth:10}));

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
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// Ipc listening in main process.
ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg);  // prints "ping"
  event.sender.send('asynchronous-reply', 'async pong');
});
