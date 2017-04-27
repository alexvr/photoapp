// Modules to start the socket.io server.
const socketApp = require('http').createServer(handler);
const io = require('socket.io')(socketApp);
const fs = require('fs');

/**
 * Start web sockets server on 127.0.0.1:3001
 * @returns {boolean}
 */
exports.startServer = function startServer() {
  console.log('server-configuration.js - startServer()');
  let serverStarted = false;

  socketApp.listen(3001, function () {
    console.log('server-configuration.js - Server listening on 127.0.0.1:3001');
    serverStarted = true;
  });

  return serverStarted;
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
