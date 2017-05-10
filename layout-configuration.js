const cloudinary = require('cloudinary');
const {dialog} = require('electron'); // Usage of OS dialogs
const fs = require('fs'); // File System

function configureCloudinary() {
  cloudinary.config({
    cloud_name: 'globe-shanghai',
    api_key: '487671746465751',
    api_secret: '8jgQTrfU97rWk5Quqm1hP2I11hM'
  });
}

exports.uploadFile = function (event, path) {
  configureCloudinary();
  dialog.showOpenDialog({
    properties: ['openFile']

  }, selectedFiles => {
    let stream = cloudinary.uploader.upload_stream(function (result) {
      console.log(result);
      event.sender.send('async-upload-layout-asset', result);
    }, { public_id: path });
    fs.createReadStream(selectedFiles[0]).pipe(stream);
  });
};
