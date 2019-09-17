const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3001;

const code_runner = require('./code_runnner');

app.use(require('cors')());

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

io.on('connection', (socket) => {
  socket.broadcast.emit('server message', 'a user connected');

  socket.on('run request', text => {
    const proc = code_runner.run_javascript(text);

    proc.stdout.on('data', (data) => {
      socket.emit('run out', data.toString());
    });

    proc.stderr.on('data', (data)=> {
      socket.emit('run err', data.toString());
    });

    proc.on('close', (code) => {
      socket.emit('run excode', code);
    });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('server message', 'a user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}!`)
});
