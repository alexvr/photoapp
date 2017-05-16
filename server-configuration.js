// Modules to start the socket.io server.
const app = require('http').createServer(handler);
const io = require('socket.io')(app);
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const internalIp = require('internal-ip');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

let mainWindow = null;
let mediaDirectory = null;
let photoCounter = 0;

/**
 * Start web sockets server on current network IP4 address on port 3001.
 * @returns {number} Current network IP4 address
 */
exports.startServer = function startServer(mediaFolder, window) {
  mainWindow = window;
  mainWindow.webContents.send('async-logs' , 'Start server...');

  app.listen(3001);
  mainWindow.webContents.send('async-logs' , 'Server listening on ' + internalIp.v4() + ':3001!');

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
  mainWindow.webContents.send('async-client-connect' , clientIp);
  mainWindow.webContents.send('async-logs' , 'A client device with IP ' + clientIp + ' connected!');

  client.emit('private-message', 'Yo I received your IP! You good?');
  sendExistingFiles(client);

  client.on('disconnect', function(){
    mainWindow.webContents.send('async-client-disconnect' , clientIp);
    mainWindow.webContents.send('async-logs' , 'A client device with IP ' + clientIp + ' disconnected!');
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
 * Sends photo from a specific path to all connected clients.
 * @param photoPath
 * @param photoNumber
 * @returns message
 */
function broadCastPhoto(photoPath, photoNumber) {
  fs.readFile(photoPath, function(err, data) {
    io.emit('image', 'data:image/jpg;base64,' + data.toString('base64') + '%%%' + photoNumber);
    mainWindow.webContents.send('async-logs' , 'Photo (' + photoPath + ') from FTP sent to all clients!');
  });
}

/**
 * Sends photo to a specific client.
 * @param client
 * @param photoPath
 * @param photoNumber
 * @returns message
 */
function sendPhotoToClient(client, photoPath, photoNumber) {
  fs.readFile(photoPath, function(err, data) {
    client.emit('image', 'data:image/jpg;base64,' + data.toString('base64') + '%%%' + photoNumber);
    mainWindow.webContents.send('async-logs' , 'Photo (' + photoPath + ') from FTP sent to client ' + client.request.connection.remoteAddress + '!');
  });
}

/**
 * Start watching a specific folder.
 */
function initializeWatcher() {
  // Set the FTP folder to watch for new photos.
  let watcher = chokidar.watch(mediaDirectory, {
    ignored: /(^|[\/\\])\../,
    persistent: true
  });

  watcher
  // Configure add photo event.
    .on('add', filePath => {
      console.log('File ' + filePath + ' has been added!');

      const fileName = getFileName(filePath);

      if (!fileName.includes('IMG_')) {
        let newPath = renameFile(filePath);
        console.log('File ' + newPath + ' has been renamed!');
        compressImage(newPath);
      } else if (filePath.includes('compressed')) {
        broadCastPhoto(filePath, photoCounter);
        photoCounter++;
        // Send the photoCounter to the event-dashboard.
        mainWindow.webContents.send('async-photo-count' , photoCounter);
      }
    })
    // Configure delete photo event.
    .on('unlink', filePath => {
      deletePhoto(filePath);
    });
}

/**
 * Get the name of a file without heading extenstion and trailing path.
 * @param filePath
 * @returns filename
 */
function getFileName(filePath) {
  let fileExtCheck = path.extname(filePath);
  let fileNameCheck = path.basename(filePath, fileExtCheck);

  return fileNameCheck;
}

/**
 * Renames a file on a given path to 'IMG_x'.
 * @param filePath
 * @returns new filePath
 */
function renameFile(filePath) {
  // Rename added file.
  let extName = path.extname(filePath);
  let newFileName = 'IMG_' + photoCounter + extName;
  // TODO: Create fix for Windows
  let newFilePath = path.dirname(filePath) + '/' + newFileName;

  fs.rename(filePath, newFilePath, function(err) {
    if ( err ) console.log('ERROR: ' + err);
  });

  return newFilePath;
}

/**
 * Compress the given image and save it in a seperate 'compressed' folder.
 * Returns the path to the compressed image.
 * @param filePath
 */
function compressImage(filePath) {
  imagemin([filePath], mediaDirectory + '/compressed', {
    plugins: [
      imageminJpegtran(),
      imageminPngquant({quality: '65-80'})
    ]
  }).then(files => {
    console.log('Compressed file: ' + files[0].path);
  });
}

/**
 * Delete the photo on the given filePath.
 * @param filePath
 */
function deletePhoto(filePath) {
  let fileName = getFileName(filePath);

  // Delete the photo on all clients.
  if (fileName.includes('IMG_')) {
    io.emit('delete-photo', fileName.replace('IMG_', ''));
    mainWindow.webContents.send('async-logs' , 'File ' + filePath + ' has been removed!');
  }

  // Delete the photo on the OS.
  if (filePath.includes('compressed')) {
    // TODO: Delete the original photo.
  } else {
    // TODO: Delete the compressed photo.
  }
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
        console.log('server-configuration - sendExistingFiles() - ' + path);
        let fileExtCheck = path.extname(filename);
        let fileNameCheck = path.basename(filename, fileExtCheck);
        const photoNumber = fileNameCheck.replace('IMG_', '');
        sendPhotoToClient(client, filePath, photoNumber);
        // Make sure the photoCounter knows how many files are already in the mediaFolder.
        photoCounter = parseInt(photoNumber) + 1;
        // Send the photoCounter to the event-dashboard.
        mainWindow.webContents.send('async-photo-count' , photoCounter);
      });
    });
  }
}

function onError(error) {
  console.log(error);
}
