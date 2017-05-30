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

/**
 * Upload a file to cloudinary
 * @param event: event for IPC communication
 * @param path: folders and filename you want to save as (e.g. "folder1/file1" )
 */
exports.uploadFile = function (event, path) {
  configureCloudinary();
  dialog.showOpenDialog({
    properties: ['openFile']
  }, selectedFiles => {
    if (selectedFiles != null) {
      let stream = cloudinary.uploader.upload_stream(function (result) {
        console.log(result);
        event.sender.send('async-upload-cloudinary-file', result);
      }, {public_id: path});
      fs.createReadStream(selectedFiles[0]).pipe(stream);
    } else {
      console.log("Cancelled file-upload.");
    }
  });
};

/**
 * Method for uploading an Event image to the Cloudinary directory.
 * @param uploadLocation: location of the uploaded image
 * @param imagePath location of local image
 */
exports.uploadImageFromServer = function (uploadLocation, imagePath) {
  configureCloudinary();

  cloudinary.uploader.upload(imagePath, function(result) {
    console.log(result)
  }, {
    public_id: uploadLocation
  });
};

exports.deleteFile = function (event, path) {
  configureCloudinary();
  cloudinary.uploader.destroy(path, function (result) {
    event.sender.send('async-delete-cloudinary-file', result);
  });
};
