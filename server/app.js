const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ExpressPeerServer = require('peer').ExpressPeerServer;

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const peerserver = ExpressPeerServer(server, {});
const port = process.env.PORT || 3001;

const code_runner = require('./code_runnner');

// set up email
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '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'
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
let connected_peers = new Set();

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

