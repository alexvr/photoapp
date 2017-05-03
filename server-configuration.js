// Modules to start the socket.io server.
const app = require('http').createServer(handler);
const io = require('socket.io')(app);
const fs = require('fs');
const internalIp = require('internal-ip');

// Module to watch FTP directory.
const chokidar = require('chokidar');

// Set the FTP folder to watch for new photos.
let watcher = chokidar.watch('/Users/Alexander/Desktop/testFTP', {
  ignored: /(^|[\/\\])\../,
  persistent: true
});

// Configure watch events.
watcher
  .on('add', path => {
    console.log('File ' + path + ' has been added!');
    testSendPhotoWithUrl(path);
  })
  .on('unlink', path => {
    console.log('File ' + path + ' has been removed!');
    // Remove foto from clients.
  });

/**
 * Start web sockets server on current network IP4 address on port 3001.
 * @returns {number} Current network IP4 address
 */
exports.startServer = function startServer() {
  console.log('server-configuration.js - startServer()');

  app.listen(3001);
  console.log('server-configuration.js - Server listening on ' + internalIp.v4() + ':3001');

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

io.on('connection', function (socket) {
  console.log('A client device connected!');

  socket.on('disconnect', function(){
    console.log('A client device disconnected!');
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
 * [TEST] Sends a photo from a local directory to all connected clients.
 * @returns {string}
 */
exports.sendTestPhoto = function testPhoto() {
  let filename = './src/assets/images/photo2.jpg';
  fs.readFile(filename, function(err, data) {
    io.emit('test-image', "data:image/jpg;base64," + data.toString("base64"));
  });

  return 'main.js - Test photo sent to all clients!';
};

/**
 * Sends photo from a specific path to all connected clients.
 * @param path
 * @returns {string}
 */
function testSendPhotoWithUrl(path) {
  fs.readFile(path, function(err, data) {
    io.emit('test-image', "data:image/jpg;base64," + data.toString("base64"));
  });

  return 'main.js - Photo from FTP sent to all clients!';
}
