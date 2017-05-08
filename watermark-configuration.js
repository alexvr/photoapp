const {dialog} = require('electron'); // Usage of OS dialogs
const fs = require('fs'); // File System

/**
 * Shows a "choose file" dialog and sends the file-path of the chosen file.
 * @param event: event from ipc to send the file-path
 */
exports.getImagePath = function (event) {
  dialog.showOpenDialog({
    properties: ['openFile']

  }, selectedFiles => {
    event.sender.send('async-get-watermark-image-path', selectedFiles.toString());
  });
};

/**
 * Converts a file-path into a ImageDataURI.
 * @param path: File-path to convert.
 * @param event: Event from ipc to send the ImageDataURI.
 */
exports.getImageDataUri = function (path, event) {
  fs.readFile(path, function (err, data) {
    let base64data = 'data:image/png;base64,' + new Buffer(data).toString('base64');
    event.sender.send('async-get-watermark-image-dataURI', base64data);
  });
};
