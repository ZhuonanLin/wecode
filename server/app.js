const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = 3001

const code_runner = require('./code_runnner');

app.use(require('cors')());

app.get('/check', (req, res) => {
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
  console.log(`App listening on port ${port}!`)
});
