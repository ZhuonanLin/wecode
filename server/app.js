const express = require('express');
const path = require('path');
const ExpressPeerServer = require('peer').ExpressPeerServer;

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const peerserver = ExpressPeerServer(server, {});
const port = process.env.PORT || 3001;

const code_runner = require('./code_runnner');

app.use(require('cors')());
app.use('/peerjs', peerserver);

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.get('/api/check', (req, res) => {
  res.send(`Server is connected on port ${port}.`)
});

const code_default = `console.log('Hello World!');`;
let code_cache = code_default;

io.on('connection', (socket) => {
  io.emit('server message', `socket ${socket.id} connected`);

  socket.on('run request', text => {
    io.emit('server message', `code submitted by ${socket.id}`);
    const proc = code_runner.run_javascript(text);
    io.emit('server message', 'process started');

    proc.stdout.on('data', (data) => {
      io.emit('console output', data.toString());
    });

    proc.stderr.on('data', (data)=> {
      io.emit('console output', data.toString());
    });

    proc.on('close', (code) => {
      io.emit('server message', `process exited with ${code}`);
    });
  });

  socket.on('request code', () => {
    socket.emit('edit', code_cache);
  });

  socket.on('clear', () => {
    code_cache = code_default;
    io.emit('edit', code_cache);
    io.emit('server message', `code cleared by ${socket.id}`);
  });

  socket.on('edit', code => {
    code_cache = code;
    socket.broadcast.emit('edit', code_cache);
  });

  socket.on('peer', peer_id => {
    socket.broadcast.emit('call', peer_id);
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('server message', `socket ${socket.id} disconnected`);
  });
});

let connected_peers = new Set();

peerserver.on('connection', (id) => {
  connected_peers.add(id);
  io.emit('server message', `peer ${id} connected`);
});

peerserver.on('disconnect', (id) => {
  connected_peers.delete(id);
  io.emit('server message', `peer ${id} disconnected`);
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}!`)
});
