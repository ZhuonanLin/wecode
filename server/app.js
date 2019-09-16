const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server)
const port = 3001

app.use(require('cors')());

app.get('/check', (req, res) => {
  res.send(`Server is connected on port ${port}.`)
});

io.on('connection', (socket) => {
  socket.broadcast.emit('server message', 'a user connected');
  socket.on('disconnect', () => {
    socket.broadcast.emit('server message', 'a user disconnected');
  })
});

server.listen(port, () => {
  console.log(`App listening on port ${port}!`)
});
