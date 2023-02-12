import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import router from './router';
import { createServer } from 'http';
import { Server } from 'socket.io';

import {
  ServerToClientEvents,
  ClientToServerEvents,
} from './types/socketio.types';

const app = express();
const port = process.env.PORT || 3030;
const httpServer = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: ['https://app.frameit.social', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'DELETE'],
  },
});

const whitelist = ['http://localhost:3000', 'http://localhost:3030', 'https://app.frameit.social'];

const corsOptions = {
  origin: function (origin: string, callback: Function) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, origin);
    }
  },
};

app.use(express.json());
app.use(cors());
app.use(router);

io.on('connection', (socket) => {
  console.log('client connected: ', socket.id);
  socket.on('joinRoom', (room) => {
    console.log({ room });
    // adds the socket to the given room
    socket.join(room);
  });
  socket.on('disconnect', (reason) => {
    console.log(reason);
  });
});

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port} - http://localhost:${port}`);
});

export { io, app, httpServer };
