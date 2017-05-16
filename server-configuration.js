// Modules to start the socket.io server.
const app = require('http').createServer(handler);
const io = require('socket.io')(app);

// Modules for the node filesystem.
const fs = require('fs');
const path = require('path');

// Modules for directory watching, IP address and image compression.
const chokidar = require('chokidar');
const internalIp = require('internal-ip');
const imageCompression = require('./image-compression');

// Prefix for added images.
const imagePrefix = 'COM_';

// Global references.
let mainWindow = null;
let mediaDirectory = null;
let imageCounter = 0;

/**
 * Start web sockets server on current network IP4 address on port 3001.
 * @returns {number} Current network IP4 address
 */
exports.startServer = function startServer(mediaFolder, window) {
  mainWindow = window;
  mainWindow.webContents.send('async-logs', 'Start server...');

  app.listen(3001);
  mainWindow.webContents.send('async-logs', 'Server listening on ' + internalIp.v4() + ':3001!');

  mediaDirectory = mediaFolder;
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

/**
 * Callback for socket.io when a client connects for the first time.
 */
io.on('connection', function (client) {
  let clientIp = client.request.connection.remoteAddress;
  mainWindow.webContents.send('async-client-connect', clientIp);
  mainWindow.webContents.send('async-logs', 'A client device with IP ' + clientIp + ' connected!');

  client.emit('private-message', 'Yo I received your IP! You good?');
  sendExistingFiles(client);

  client.on('disconnect', function () {
    mainWindow.webContents.send('async-client-disconnect', clientIp);
    mainWindow.webContents.send('async-logs', 'A client device with IP ' + clientIp + ' disconnected!');
  });
});

/**
 * Sends the OverviewLayout and DetailLayout to all connected clients.
 * @param overviewLayout
 * @param detailLayout
 * @returns {string}
 */
exports.sendLayout = function sendLayout(overviewLayout, detailLayout) {
  io.emit('overview-layout', overviewLayout);
  io.emit('detail-layout', detailLayout);

  return 'main.js - OverviewLayout sent to all clients!';
};

/**
 * Sends image from a specific path to all connected clients.
 * @param imagePath
 * @param imageNumber
 * @returns message
 */
function broadCastImage(imagePath, imageNumber) {
  fs.readFile(imagePath, function (err, data) {
    io.emit('image', 'data:image/jpg;base64,' + data.toString('base64') + '%%%' + imageNumber);
    mainWindow.webContents.send('async-logs', 'Image (' + imagePath + ') from FTP sent to all clients!');
  });
}

/**
 * Sends image to a specific client.
 * @param client
 * @param imagePath
 * @param imageNumber
 * @returns message
 */
function sendImageToClient(client, imagePath, imageNumber) {
  fs.readFile(imagePath, function (err, data) {
    client.emit('image', 'data:image/jpg;base64,' + data.toString('base64') + '%%%' + imageNumber);
    mainWindow.webContents.send('async-logs', 'Image (' + imagePath + ') from FTP sent to client ' + client.request.connection.remoteAddress + '!');
  });
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
      console.log('File ' + filePath + ' has been added!');
      const fileName = getFileName(filePath);

      if (!fileName.includes(imagePrefix)) {

        renameAndCompress(filePath);

      } else if (filePath.includes('compressed')) {

        // Send the image to all clients and increment the counter.
        broadCastImage(filePath, imageCounter);
        imageCounter++;

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
 * Rename file of the given file path and compress it.
 * @param filePath
 */
function renameAndCompress(filePath) {
  let newPath = renameFile(filePath);
  console.log('File ' + newPath + ' has been renamed!');
  imageCompression.compressImage(newPath, mediaDirectory);
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
    if (err) console.log('ERROR: ' + err);
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
          console.log('Succesfully deleted ' + pathToSearch + '/' + listFileName + '!');
        }));
      }
    })
  });
}

/**
 * If the mediaFolder already contains images, send them to the connected client.
 */
function sendExistingFiles(client) {
  if (fs.existsSync(mediaDirectory + '/compressed')) {
    fs.readdir(mediaDirectory + '/compressed', function (err, filenames) {
      // Don't send hidden files. For instance .DStore
      let list = filenames.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));

      if (err) {
        onError(err);
        return;
      }

      list.forEach(function (filename) {
        const filePath = mediaDirectory + '/compressed/' + filename;
        console.log('server-configuration - sendExistingFiles() - ' + filePath);

        let fileExtCheck = path.extname(filename);
        let fileNameCheck = path.basename(filename, fileExtCheck);
        const imageNumber = fileNameCheck.replace(imagePrefix, '');
        sendImageToClient(client, filePath, imageNumber);

        // Make sure the imageCounter knows how many files are already in the mediaFolder.
        imageCounter = parseInt(imageNumber) + 1;

        // Send the imageCounter to the event-dashboard.
        mainWindow.webContents.send('async-image-count', imageCounter);
      });
    });
  }
}

function onError(error) {
  console.log(error);
}
