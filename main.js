// ./main.js
const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const printer = require("/Users/Alexander/Desktop/photoapp/node_modules/printer"), util = require('util');

require('dotenv').config();
require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

let win = null;

app.on('ready', function () {

  // Initialize the window to our specified dimensions
  win = new BrowserWindow({width: 1000, height: 700});

  // Specify entry point
  if (process.env.PACKAGE === 'true') {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  } else {
    win.loadURL(process.env.HOST);
    win.webContents.openDevTools();
  }

  // Show dev tools
  // Remove this line before distributing
  win.webContents.openDevTools();

  console.log("installed printers:\n"+util.inspect(printer.getPrinters(), {colors:true, depth:10}));

  // Remove window once app is closed
  win.on('closed', function () {
    win = null;
  });

});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
})
;

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});
