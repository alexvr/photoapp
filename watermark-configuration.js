const {dialog} = require('electron'); // Usage of OS dialogs
const fs = require('fs'); // File System

exports.readFile = function readFile(event) {
  readFileWithCallback(x => {
    event.sender.send('async-get-watermark-image-asset', x);
  });
};

function readFileWithCallback(callback) {
  dialog.showOpenDialog({
    properties: ['openFile']

  }, selectedFiles => {
    fs.readFile(selectedFiles.toString(), function (err, data) {
      let base64data = 'data:image/png;base64,' + new Buffer(data).toString('base64');
      callback(base64data);
    });
  });
}
