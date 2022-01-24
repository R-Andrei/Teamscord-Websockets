import express from "express";
import helmet from "helmet";
import http from 'http';
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";

import { Server, Socket } from 'socket.io';

import RoomService from './services/room.service';
import UserService from './services/user.service';

import { SocketUser } from './types/User';


// Language: typescript
// Path: api\src\index.ts

dotenv.config();

const { SOCKETS_PORT } = process.env;
const port = SOCKETS_PORT || 3002;
const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200
};

// Create the express app and add middleware
const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors(corsOptions));

// start websocket server
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });


io.on('connection', (socket: Socket) => {
    console.info(`> Socket connected: ${socket.id}`);

    io.on('disconnected', () => {
        console.info(`> Socket disconnected: ${socket.id}`);
    });

    socket.on('userConnection', (data: any) => {
        const { user, rooms } = data;
        if (!user || !rooms) {
            console.error('No user or rooms found.');
            return;
        } else {
            const socketUser: SocketUser = {
                ...user,
                socketId: socket.id,
            }
            // connect socket to rooms
            rooms.forEach((room: any) => {
                console.info(`> Connecting socket [${socket.id}] to room [${room._id}]`);
                socket.join(room._id);
            });
            // add user to user service
            UserService.addUser(socketUser);
            // add rooms to room service
            RoomService.addRooms(rooms);
        }
    });

    socket.on('sendMessage', (message: any) => {
        if (!message || !message.roomId) {
            console.error('No message or roomId found.');
            return;
        } else {
            console.info(`> Emitting message from socket [${socket.id}] to room [${message.roomId}]`);

            // send message to room
            io.to(message.roomId).emit('receiveMessage', message);
        }
    });
});


// start the server
server.listen(port, () => {
    console.info(`> Server listening on port ${port}`);
    console.info(`> Environment: ${process.env.NODE_ENV}`);
});

// TODO: add jwt middleware


// write tests to see if user objects coming from database
// have dates in them instead of strings

// write tests to see if all services are initalized

// write tests to see if authmiddleware is working