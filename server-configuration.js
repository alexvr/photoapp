// Modules to start the socket.io server.
const socketApp = require('http').createServer(handler);
const io = require('socket.io')(socketApp);
const fs = require('fs');
const internalIp = require('internal-ip');

/**
 * Start web sockets server on current network IP4 address on port 3001.
 * @returns {number} Current network IP4 address
 */
exports.startServer = function startServer() {
  console.log('server-configuration.js - startServer()');

  socketApp.listen(3001);
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
