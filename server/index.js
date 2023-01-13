const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const router = require('./router');
const app = express();
const port = process.env.PORT || 3000;
const http = require('http');
const server = http.createServer(app);
const socketIo = require('socket.io');
global.io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
}); //in case server and client run on different urls

let corsOptions = {
  origin: 'https://frame-it.vercel.app/',
  origin: 'http://localhost:3000'
}
app.use(express.json());
app.use(cors(corsOptions));
app.use(
  fileUpload({
    limits: {
      fileSize: 8000000, // 8MB
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

server.listen(port, () => {
  console.log(`Server is running on port ${port} - http://localhost:${port}`);
});
