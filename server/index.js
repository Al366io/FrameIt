const express = require('express');
const { startSetIntervals } = require("./controllers/controller");
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
    origin: 'https://frame-it.vercel.app',
  },
}); //in case server and client run on different urls
const corsOptions = {
  origin: 'https://frame-it.vercel.app',
}
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

// DELETE THIS IN FINAL PRODUCTION DEPLOY
setTimeout(() => {
  startSetIntervals()
}, 5000);

server.listen(port, () => {
  console.log(`Server is running on port ${port} - http://localhost:${port}`);
});
