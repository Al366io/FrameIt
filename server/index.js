const express = require('express');
const { startSetIntervals } = require('./controllers/controller');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const router = require('./router');
const app = express();
const port = process.env.PORT || 3000;
const http = require('http');
const server = http.createServer(app);
const socketIo = require('socket.io');
/* global io */
global.io = socketIo(server, {
  cors: {
    origin: [
      'http://localhost',
      'https://app.frameit.social', 
      'https://frame-it.vercel.app'
    ],
  },
  methods: ['GET', 'POST', 'DELETE'],
}); //in case server and client run on different urls

var whitelist = ['https://frame-it.vercel.app', 'http://localhost:3000', 'https://app.frameit.social'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    }
  },
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(
  fileUpload({
    limits: {
      fileSize: 9000000, // 9MB
    },
    abortOnLimit: true,
  })
);
app.use(router);

io.on('connection', (socket) => {
  console.log('client connected: ', socket.id);
  socket.on('join-room', (room) => {
    socket.join(room);
  });
  socket.on('disconnect', (reason) => {
    console.log(reason);
  });
});

// this is to start listening on all parties that are already created
// vital if server stops and restarts, because we trigger the setInterval only on createParty.
setTimeout(() => {
  startSetIntervals();
}, 5000);

server.listen(port, () => {
  console.log(`Server is running on port ${port} - http://localhost:${port}`);
});
