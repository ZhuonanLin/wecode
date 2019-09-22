const express = require('express');
const proxy = require('http-proxy-middleware');
const bodyParser = require('body-parser');
const path = require('path');
const ExpressPeerServer = require('peer').ExpressPeerServer;

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const peerserver = ExpressPeerServer(server, { debug: true });
const port = process.env.PORT || 3001;

const code_runner = require('./code_runnner');

// set up email
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.SENDGRID_KEY
  }
}));

app.use(require('cors')());
app.use('/peerjs', peerserver);

// For sending Email
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/send-invitation-email', (req, res, next) => {
  const { interviewerName, email } = req.body;


  const invitationBody = `<p> Hi, </p> <p><i>${interviewerName}</i> is sending an interview invitation through<b> WeCode </b>! </p>
<p> Click the click below to join the interview: </p> <br>
<a href="http://demo-wecode.herokuapp.com/interview"> Join the Interivew on WeCode </a>
<p> Regards, <br> WeCode Team - Zhuonan Lin & Bili Dong </p>
`

  const mailOptions = {
    to: email,
    from: 'WeCode',
    subject: 'Interview Invitation From WeCode',
    html: invitationBody
  };
  transporter.sendMail(mailOptions, (error, into) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
    }
  );
  res.redirect('/interview');
  next();
});

app.get('/api/check', (req, res) => {
  res.send(`Express server is running on port ${port}.`);
});

const code_default = {
  javascript: "console.log('Hello World!');",
  python: "print('Hello World!')"
}
let code_cache = Object.assign({}, code_default);
let connected_peers = new Set();

io.on('connection', (socket) => {
  io.emit('server message', `socket ${socket.id} connected`);

  socket.on('chat window ready', () => {
    socket.emit('peer create', port);
  });

  socket.on('run request', (language, text) => {
    io.emit('server message', `code submitted by ${socket.id}`);
    const proc = code_runner.run_code(language, text);

    io.emit('console output', '-----> starting process\n\n');

    proc.stdout.on('data', (data) => {
      io.emit('console output', data.toString());
    });

    proc.stderr.on('data', (data)=> {
      io.emit('console output', data.toString());
    });

    proc.on('close', (code) => {
      io.emit('console output', `\n-----> process exited with ${code}\n`);
    });
  });

  socket.on('request code', language => {
    socket.emit('edit', language, code_cache[language]);
  });

  socket.on('clear', language => {
    code_cache[language] = code_default[language];
    io.emit('edit', language, code_cache[language]);
    io.emit('server message', `code cleared by ${socket.id}`);
  });

  socket.on('edit', (language, code) => {
    code_cache[language] = code;
    socket.broadcast.emit('edit', language, code_cache[language]);
  });

  socket.on('peer open', peer_id => {
    socket.broadcast.emit('peer call', peer_id);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('server message', `socket ${socket.id} disconnected`);
  });
});

peerserver.on('connection', peer_id => {
  connected_peers.add(peer_id);
  io.emit('server message', `peer ${peer_id} connected`);
});

peerserver.on('disconnect', peer_id => {
  connected_peers.delete(peer_id);
  io.emit('server message', `peer ${peer_id} disconnected`);
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}!`)
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });

  // Set up proxy
  app.use(proxy('/peerjs', {
    target: `http://localhost:${port}`,
    changeOrigin: true,
    ws: true,
  }));
}
