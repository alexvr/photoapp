// Modules to start the socket.io server.
const app = require('http').createServer(handler);
const io = require('socket.io')(app);
const fs = require('fs');
const internalIp = require('internal-ip');

let mainWindow = null;
let mediaDirectory = null;

/**
 * Start web sockets server on current network IP4 address on port 3001.
 * @returns {number} Current network IP4 address
 */
exports.startServer = function startServer(mediaFolder, window) {
  console.log('server-configuration.js - startServer()');

  mainWindow = window;

  app.listen(3001);
  console.log('server-configuration.js - Server listening on ' + internalIp.v4() + ':3001');

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

  console.log('A client device with IP ' + clientIp + ' connected!');
  client.emit('private-message', 'Yo I received your IP! You good?');
  sendExistingFiles(client);

  client.on('disconnect', function(){
    console.log('The client with IP ' + clientIp + " has disconnected!");
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
 * @param path
 * @returns {string}
 */
function sendPhotoWithPath(path) {
  fs.readFile(path, function(err, data) {
    io.emit('test-image', "data:image/jpg;base64," + data.toString("base64"));
  });

  return 'main.js - Photo from FTP sent to all clients!';
}

/**
 * Sends photo to a specific client.
 * @param client
 * @param path
 * @returns {string}
 */
function sendPhotoToClientWithPath(client, path) {
  fs.readFile(path, function(err, data) {
    client.emit('test-image', "data:image/jpg;base64," + data.toString("base64"));
  });

  return 'main.js - Photo from FTP sent to all clients!';
}

/**
 * Start watching a specific folder.
 */
function initializeWatcher() {
  // Module to watch FTP directory.
  const chokidar = require('chokidar');

  // Set the FTP folder to watch for new photos.
  let watcher = chokidar.watch(mediaDirectory, {
    ignored: /(^|[\/\\])\../,
    persistent: true
  });

  // Configure watch events.
  watcher
    .on('add', path => {
      console.log('File ' + path + ' has been added!');
      sendPhotoWithPath(path);
    })
    .on('unlink', path => {
      console.log('File ' + path + ' has been removed!');
      // Remove foto from clients.
    });
}

/**
 * If the mediaFolder already contains images, send them to the connected client.
 */
function sendExistingFiles(client) {
  fs.readdir(mediaDirectory, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function(filename) {
      const path = mediaDirectory + '/' + filename;
      console.log('server-configuration - sendExistingFiles() - ' + path);
      sendPhotoToClientWithPath(client, path);
    });
  });
}
