const {dialog} = require('electron'); // Usage of OS dialogs
const fs = require('fs'); // File System
const Canvas = require('canvas');
const rxjs = require('rxjs');
const util = require('util');

/**
 * Shows a "choose file" dialog and sends the file-path of the chosen file.
 * @param event: event from ipc
 */
exports.getImagePath = function (event) {
  dialog.showOpenDialog({
    properties: ['openFile']

  }, selectedFiles => {
    if (selectedFiles != null) {
      event.sender.send('async-get-watermark-image-path', selectedFiles.toString());
    } else {
      console.log('watermark-configuration.js - cancelled getImagePath');
    }
  });
};

/**
 * Converts a file-path into a ImageDataURI.
 * @param path: File-path to convert
 * @param event: Event from ipc
 */
exports.getImageDataUri = function (path, event) {
  fs.readFile(path, function (err, data) {
    let base64data = 'data:image/png;base64,' + new Buffer(data).toString('base64');
    event.sender.send('async-get-watermark-image-dataURI', base64data);
    if (err) {
      console.error('Error occurred in getImageDataUri: ' + err);
    }
  });
};

/**
 * Creating the image with watermark.
 * @param watermarkString
 * @param imageLocation
 * @return {"../../Observable".Observable}
 */
exports.createWatermarkPhoto = function (watermarkString, imageLocation) {
  let watermark = parseWatermark(watermarkString);
  let canvas = new Canvas(watermark.width, watermark.height);
  ctx = canvas.getContext('2d');

  return new rxjs.Observable(obs => {
    // IMAGE
    fs.readFile(imageLocation, function (err, image) {
      if (err) throw err;
      img = new Canvas.Image;
      img.src = image;
      ctx.drawImage(img, watermark.imageX, watermark.imageY,
        (img.width / 100 * watermark.imageScale), (img.height / 100 * watermark.imageScale));

      // OVERLAY
      if (watermark.overlayLocation != null) {
        console.log(watermark.overlayLocation);
        fs.readFile(watermark.overlayLocation, function (err, overlayImg) {
          if (err) throw err;
          img = new Canvas.Image;
          img.src = overlayImg;
          ctx.drawImage(img, watermark.overlayX, watermark.overlayY,
            (img.width / 100 * watermark.overlayScale), (img.height / 100 * watermark.overlayScale));

          // LOGO
          if (watermark.logoLocation != null) {
            fs.readFile(watermark.logoLocation, function (err, logoImg) {
              if (err) throw err;
              img = new Canvas.Image;
              img.src = logoImg;
              ctx.drawImage(img, watermark.logoX, watermark.logoY,
                (img.width / 100 * watermark.logoScale), (img.height / 100 * watermark.logoScale));

              console.log('printer-configuration.js - watermark: logo & overlay!');
              obs.next(canvas);
              obs.complete();
            });
          } else {
            console.log('printer-configuration.js - watermark: only overlay!');
            obs.next(canvas);
            obs.complete();
          }
        });
      } else {
        // LOGO
        if (watermark.logoLocation != null) {
          fs.readFile(watermark.logoLocation, function (err, logoImg) {
            if (err) throw err;
            img = new Canvas.Image;
            img.src = logoImg;
            ctx.drawImage(img, watermark.logoX, watermark.logoY,
              (img.width / 100 * watermark.logoScale), (img.height / 100 * watermark.logoScale));

            console.log('printer-configuration.js - watermark: only logo!');
            obs.next(canvas);
            obs.complete();
          });
        } else {
          console.log('printer-configuration.js - watermark: no logo, no overlay!');
          obs.next(canvas);
          obs.complete();
        }
      }
    })
  })
}

/**
 * Turn the jsonString into an ImageWatermark
 * @param jsonString
 * @return {{}}
 */

function parseWatermark(jsonString) {
  let watermarkJson = JSON.parse(jsonString);
  let imageWatermark = {};

  if (!util.isUndefined(watermarkJson.print)) {
    imageWatermark.print = watermarkJson.print;
  }
  if (!util.isUndefined(watermarkJson.height)) {
    imageWatermark.height = watermarkJson.height;
  }
  if (!util.isUndefined(watermarkJson.width)) {
    imageWatermark.width = watermarkJson.width;
  }
  if (!util.isUndefined(watermarkJson.logoLocation)) {
    imageWatermark.logoLocation = watermarkJson.logoLocation;
  }
  if (!util.isUndefined(watermarkJson.logoX)) {
    imageWatermark.logoX = watermarkJson.logoX;
  }
  if (!util.isUndefined(watermarkJson.logoY)) {
    imageWatermark.logoY = watermarkJson.logoY;
  }
  if (!util.isUndefined(watermarkJson.logoScale)) {
    imageWatermark.logoScale = watermarkJson.logoScale;
  }
  if (!util.isUndefined(watermarkJson.overlayLocation)) {
    imageWatermark.overlayLocation = watermarkJson.overlayLocation;
  }
  if (!util.isUndefined(watermarkJson.overlayX)) {
    imageWatermark.overlayX = watermarkJson.overlayX;
  }
  if (!util.isUndefined(watermarkJson.overlayY)) {
    imageWatermark.overlayY = watermarkJson.overlayY;
  }
  if (!util.isUndefined(watermarkJson.overlayScale)) {
    imageWatermark.overlayScale = watermarkJson.overlayScale;
  }
  if (!util.isUndefined(watermarkJson.imageWidth)) {
    imageWatermark.imageWidth = watermarkJson.imageWidth;
  }
  if (!util.isUndefined(watermarkJson.imageHeight)) {
    imageWatermark.imageHeight = watermarkJson.imageHeight;
  }
  if (!util.isUndefined(watermarkJson.imageX)) {
    imageWatermark.imageX = watermarkJson.imageX;
  }
  if (!util.isUndefined(watermarkJson.imageY)) {
    imageWatermark.imageY = watermarkJson.imageY;
  }
  if (!util.isUndefined(watermarkJson.imageScale)) {
    imageWatermark.imageScale = watermarkJson.imageScale;
  }
  return imageWatermark;
}




