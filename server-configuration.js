// Modules to start the socket.io server.
const app = require('http').createServer(handler);
const io = require('socket.io')(app);

// Modules for the node filesystem.
const fs = require('fs');
const path = require('path');

// Modules for directory watching, IP address, image resizing, printing and cloudinary upload.
const chokidar = require('chokidar');
const internalIp = require('internal-ip');
const imageResize = require('./image-resize');
const printerConfiguration = require('./printer-configuration');
const cloudinaryConfiguration = require('./cloudinary-configuration');
const watermarkConfig = require('./watermark-configuration');

// Module for Observable
const rxjs = require('rxjs');

// Prefix for added images and width of resized image.
const imagePrefix = 'COM_';
let resizedImageWidth = 0;

// Global references.
let mainWindow = null;
let mediaDirectory = null;
let eventId = null;
let eventName = null;
let printer = null;
let imageCounter = 0;
let printCounter = 0;
let overviewLayout = null;
let detailLayout = null;
let printWatermark = null;
let useWatermark = null;
let webWatermark = null;
let useWebWatermark = null;

/**
 * Start web sockets server on current network IP4 address on port 3001.
 * @param mediaFolder
 * @param imageQuality
 * @param chosenEventId
 * @param chosenEventName
 * @param eventPrinter
 * @param overview
 * @param detail
 * @param watermark
 * @param useWatermarkParam
 * @param webWatermark
 * @param useWebWatermarkParam
 * @param window
 * @returns {number} Current network IP4 address
 */
exports.startServer = function startServer(mediaFolder, imageQuality, chosenEventId, chosenEventName, eventPrinter, overview, detail, watermark, useWatermarkParam, webWatermarkParam, useWebWatermarkParam, window) {
  // Set global main window reference.
  mainWindow = window;
  mainWindow.webContents.send('async-logs', 'Start server...');

  // Start the socket.io server on port 3001.
  app.listen(3001);
  mainWindow.webContents.send('async-logs', 'Server listening on ' + internalIp.v4() + ':3001!');

  // Set the mediafolder to the specified in the event configuration and the printer.
  mediaDirectory = mediaFolder;
  printer = eventPrinter;

  // Set eventId -and name.
  eventId = chosenEventId;
  eventName = chosenEventName;

  // Set the layout for the event.
  overviewLayout = overview;
  detailLayout = detail;

  // Set the watermark for printing.
  printWatermark = watermark;
  useWatermark = useWatermarkParam;

  // Set the watermark for sharing.
  webWatermark = webWatermarkParam;
  useWebWatermark = useWebWatermarkParam;

  // Set the compression for the client images.
  setCompressionQuality(imageQuality);

  // If there are uncompressed files in the mediafolder, compress them.
  checkUncompressedFiles();

  // Set the watcher for the mediafolder.
  initializeWatcher();

  return internalIp.v4();
};

// Socket.io functions
function handler(req, res) {
  fs.readFile(__dirname + '/index.html',
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }

      res.writeHead(200);
      res.end(data);
    });
}

function setCompressionQuality(imageQuality) {
  switch (imageQuality) {
    case 'HIGH':
      resizedImageWidth = 1200;
      break;
    case 'MEDIUM':
      resizedImageWidth = 1000;
      break;
    case 'LOW':
      resizedImageWidth = 800;
      break;
  }
}

/**
 * Callback for socket.io when a client connects for the first time.
 */
io.on('connection', function (client) {
  let clientIp = client.request.connection.remoteAddress;
  mainWindow.webContents.send('async-client-connect', clientIp);
  mainWindow.webContents.send('async-logs', 'A client device with IP ' + clientIp + ' connected!');

  client.emit('private-message', 'Yo I received your IP! You good?');
  sendEventId(client);
  sendLayout(client);
  sendExistingFiles(client);

  client.on('disconnect', function () {
    mainWindow.webContents.send('async-client-disconnect', clientIp);
    mainWindow.webContents.send('async-logs', 'A client device with IP ' + clientIp + ' disconnected!');
  });

  // Printing message with array of imageNumbers.
  client.on('print', function (imageNumbers) {
    printImages(imageNumbers);
  });
});

function sendEventId(client) {
  let clientIp = client.request.connection.remoteAddress;
  client.emit('event-id', eventId);
  mainWindow.webContents.send('async-logs', 'EventId has been sent to client with IP: ' + clientIp + '!');
}

/**
 * Sends the OverviewLayout and DetailLayout to all connected clients.
 * @param client
 * @returns {string}
 */
function sendLayout(client) {
  let clientIp = client.request.connection.remoteAddress;
  client.emit('overview-layout', overviewLayout);
  client.emit('detail-layout', detailLayout);
  mainWindow.webContents.send('async-logs', 'Layout has been sent to client with IP: ' + clientIp + '!');
}

/**
 * Sends image from a specific path to all connected clients.
 * @param imagePath
 * @returns message
 */
function broadCastImage(imagePath) {
  const imageNumber = getImageNumber(imagePath);
  const imageBuffer = 'data:image/jpg;base64,' + fs.readFileSync(imagePath, 'base64');

  io.emit('image', {imageCount: imageNumber, imageBase: imageBuffer});
  mainWindow.webContents.send('async-logs', 'Image (' + imagePath + ') from FTP sent to all clients!');
}

/**
 * Get the number of the renamed image file.
 * @param imagePath
 * @returns {string}
 */
function getImageNumber(imagePath) {
  let filename = path.basename(imagePath);
  let fileExtCheck = path.extname(filename);
  let fileNameCheck = path.basename(filename, fileExtCheck);

  return fileNameCheck.replace(imagePrefix, '');
}

/**
 * Sends image to a specific client.
 * @param client
 * @param imagePath
 * @param imageNumber
 * @returns message
 */
function sendImageToClient(client, imagePath, imageNumber) {
  const clientAddress = client.request.connection.remoteAddress;
  fs.readFile(imagePath, function (error, buf) {
    client.emit('image', {imageCount: imageNumber, imageBase: 'data:image/jpg;base64,' + buf.toString('base64')});
    mainWindow.webContents.send('async-logs', 'Image (' + imagePath + ') from FTP sent to client ' + clientAddress + '!');
  })
}

/**
 * Start watching a specific folder.
 */
function initializeWatcher() {
  // Set the FTP folder to watch for new images.
  let watcher = chokidar.watch(mediaDirectory, {
    ignored: /(^|[\/\\])\../,
    persistent: true
  });

  watcher
  // Configure add image event.
    .on('add', filePath => {
      console.log('server-configuration.js - File ' + filePath + ' has been added!');

      // Ignore print and watermark images.
      if (filePath.includes('event-photos')) {
        return;
      } else if (filePath.includes('print-images')) {
        return;
      }

      const fileName = getFileName(filePath);

      if (!fileName.includes(imagePrefix)) {

        renameUploadAndCompress(filePath);

      } else if (filePath.includes('compressed')) {
        // Send the image to all clients and increment the counter.
        broadCastImage(filePath);

        // Send the imageCounter to the event-dashboard.
        mainWindow.webContents.send('async-image-count', imageCounter);
      }
    })
    // Configure delete image event.
    .on('unlink', filePath => {
      if (filePath.includes(imagePrefix)) {
        deleteImage(filePath);
      }
    });
}

/**
 * Rename file of the given file path, compress it and then upload it.
 * @param filePath
 */
function renameUploadAndCompress(filePath) {
  // Rename image
  const renamedPath = renameFile(filePath);
  console.log('server-configuration.js - File ' + renamedPath + ' has been renamed!');

  // Upload image
  const uploadLocation = eventName + '/event-photos/' + imageCounter;

  if (useWebWatermark === 'true') {
    if (!fs.existsSync(mediaDirectory + '/share-images')) {
      fs.mkdirSync(mediaDirectory + '/share-images');
    }

    let watermarkImageCounter = imageCounter; // watermark uses observable so imageCounter may have already changed.

    /**/

    waitAndRedoWatermark({
      'renamedPath': renamedPath,
      'watermarkImageCounter': watermarkImageCounter,
      'uploadLocation': uploadLocation
    });

    /**/

  } else {
    cloudinaryConfiguration.uploadImageToServer(renamedPath, uploadLocation);
  }

  imageCounter++;

  // Compress image
  const outputPath = mediaDirectory + '/compressed/' + path.basename(renamedPath);
  console.log('server-configuration.js - Resizing image on path ' + outputPath);
  imageResize.resizeAndCompressImage(renamedPath, outputPath, resizedImageWidth);
}

let watermarkInProgress = false;

/**
 * Create and upload a watermark image or wait and try again.
 * @param image
 */
function waitAndRedoWatermark(image) {
  if (watermarkInProgress) {
    setTimeout(() => {
      waitAndRedoWatermark(image);
    }, 1000);
  } else {
    console.log('doWatermark!!');
    watermarkInProgress = true;
    createAndUploadWatermarkImage(image['renamedPath'], image['watermarkImageCounter'], image['uploadLocation']).subscribe(val => watermarkInProgress = false);
  }
}

/**
 * Create and upload a watermark image.
 * @param renamedPath
 * @param watermarkImageCounter
 * @param uploadLocation
 * @return {*}
 */
function createAndUploadWatermarkImage(renamedPath, watermarkImageCounter, uploadLocation) {
  return new rxjs.Observable(observable => {
    watermarkInProgress = true;
    watermarkConfig.createWatermarkPhoto(webWatermark, renamedPath).subscribe(val => {
      let canvas = val;
      let watermarkImageName = mediaDirectory + '/share-images/' + imagePrefix + watermarkImageCounter + '.jpeg';
      let watermarkImage = fs.createWriteStream(watermarkImageName);
      let stream = canvas.jpegStream({
        bufsize: 4096 // output buffer size in bytes, default: 4096
        , quality: 100 // JPEG quality (0-100) default: 75
        , progressive: false // true for progressive compression, default: false
      });

      console.log('server-configuration.js - writing png');
      stream.on('data', function (chunk) {
        watermarkImage.write(chunk);
      });

      stream.on('end', function () {
        console.log('server-configuration.js - saved png');
        setTimeout(() => {
          cloudinaryConfiguration.uploadImageToServer(watermarkImageName, uploadLocation);
          observable.next();
          observable.complete();
        }, 1000);
      });
    });
  });
}

/**
 * Get the name of a file without heading extension and trailing path.
 * @param filePath
 * @returns filename
 */
function getFileName(filePath) {
  let fileExtCheck = path.extname(filePath);
  let fileNameCheck = path.basename(filePath, fileExtCheck);

  return fileNameCheck;
}

/**
 * Renames a file on a given path to the imagePrefix_x.
 * @param filePath
 * @returns new filePath
 */
function renameFile(filePath) {
  // Rename added file.
  let extName = path.extname(filePath);
  let newFileName = imagePrefix + imageCounter + extName;

  // Forward slash for POSIX, backward for Windows.
  let newFilePath;
  if (process.platform === 'darwin') {
    newFilePath = path.dirname(filePath) + '/' + newFileName;
  } else {
    newFilePath = path.dirname(filePath) + '\\' + newFileName;
  }

  fs.rename(filePath, newFilePath, function (err) {
    if (err) console.error('server-configuration.js - ERROR: ' + err);
  });

  return newFilePath;
}

/**
 * Delete the image on the given filePath.
 * @param filePath
 */
function deleteImage(filePath) {
  let fileName = getFileName(filePath);
  let pathToSearch;

  // Delete the image on all clients.
  if (fileName.includes(imagePrefix)) {
    io.emit('delete-image', fileName.replace(imagePrefix, ''));
    mainWindow.webContents.send('async-logs', 'File ' + filePath + ' has been removed!');
  }

  if (filePath.includes('compressed')) {
    pathToSearch = mediaDirectory;
  } else {
    if (process.platform === 'darwin') {
      pathToSearch = mediaDirectory + '/compressed';
    } else {
      pathToSearch = mediaDirectory + '\\compressed';
    }
  }

  fs.readdir(pathToSearch, function (err, filenames) {
    let list = filenames.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));

    list.forEach(function (listFileName) {
      const listFileNameWithoutExtension = getFileName(listFileName);
      if (fileName === listFileNameWithoutExtension) {
        fs.unlink(pathToSearch + '/' + listFileName, (error => {
          if (error) throw error;
          console.log('server-configuration.js - Succesfully deleted ' + pathToSearch + '/' + listFileName + '!');
        }));
      }
    })
  });
}

/**
 * If there are uncompressed files in the mediafolder, compress them.
 */
function checkUncompressedFiles() {
  let fileCounter = 0;
  // If the compressed folder doesn't exist, create it.
  if (!fs.existsSync(mediaDirectory + '/compressed')) {
    fs.mkdirSync(mediaDirectory + '/compressed');
  }

  // Make sure the imageCounter knows how many files are already in the mediaFolder.
  fs.readdir(mediaDirectory + '/compressed', function (err, filenames) {
    let list = filenames.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));

    list.forEach(function (filename) {
      fileCounter++;

      const listItemPath = mediaDirectory + '/compressed/' + filename;
      if (fs.lstatSync(listItemPath).isFile()) {
        const itemNumber = parseInt(getImageNumber(listItemPath));
        if (itemNumber > imageCounter) {
          imageCounter = itemNumber;
          console.log("server-configuration.js - ImageCounter after check uncompressed files: " + imageCounter);
        }
      }
    });

    // So that you don't override the last image.
    if (fileCounter > 0) {
      imageCounter++;
    }
  });

  fs.readdir(mediaDirectory, function (err, filenames) {
    let list = filenames.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));

    list.forEach(function (filename) {
      if (fs.lstatSync(mediaDirectory + '/' + filename).isFile()) {
        if (!filename.includes(imagePrefix)) {
          renameUploadAndCompress(mediaDirectory + '/' + filename);
        }
      }
    });
  });
}

/**
 * If the mediaFolder already contains images, send them to the connected client.
 */
function sendExistingFiles(client) {
  if (fs.existsSync(mediaDirectory + '/compressed')) {
    fs.readdir(mediaDirectory + '/compressed', function (err, filenames) {
      if (err) {
        console.error('server-configuration.js - ' + error);
        return;
      }

      // Don't send hidden files. For instance .DStore
      let list = filenames.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));

      list.forEach(function (filename) {
        const filePath = mediaDirectory + '/compressed/' + filename;
        console.log('server-configuration.js - sendExistingFiles() - ' + filePath);

        let fileExtCheck = path.extname(filename);
        let fileNameCheck = path.basename(filename, fileExtCheck);
        const imageNumber = fileNameCheck.replace(imagePrefix, '');
        sendImageToClient(client, filePath, imageNumber);
      });
    });
  }
}

/**
 * Print one or more images.
 * @param imageNumbers
 */
function printImages(imageNumbers) {
  if (!fs.existsSync(mediaDirectory + '/print-images')) {
    fs.mkdirSync(mediaDirectory + '/print-images');
  }

  forEachPromise(imageNumbers, printImageHelper).then(() => {
    console.log('server-configuration.js - done');
  });
}

/**
 * function to loop over an array with promises (used to print images serially)
 * @param items
 * @param fn
 */
function forEachPromise(items, fn) {
  return items.reduce((promise, item) => {
    return promise.then(() => {
      return fn(item);
    });
  }, Promise.resolve());
}

/**
 * Print images serially
 * @param imageNr
 */
function printImageHelper(imageNr) {
  return new Promise((resolve, reject) => {
    process.nextTick(() => {
      printerConfiguration.printImage(printer, mediaDirectory, imagePrefix, imageNr, printWatermark, useWatermark).subscribe(val =>
        resolve()
      );
      printCounter++;
      mainWindow.webContents.send('async-print-count', printCounter);
    })
  });
}
