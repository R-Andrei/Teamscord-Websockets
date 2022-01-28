import express from "express";
import helmet from "helmet";
import http from 'http';
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";

import { Server, Socket } from 'socket.io';

import RoomService from './services/room.service';
import UserService from './services/user.service';

import { SocketUser, User } from './types/User';
import { Room } from "./types/Room";


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
            rooms.forEach((room: Room) => {
                console.info(`> Subscribing socket [${socket.id}] to room [${room._id}]`);
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
            // send message to room
            console.info(`> Emitting message from socket [${socket.id}] to room [${message.roomId}]`);
            io.to(message.roomId).emit('receiveMessage', message);
        }
    });

    socket.on('addRoom', (room: Room) => {
        if (!room) {
            console.error('No room found.');
            return;
        } else {
            // first add room to room service
            console.info(`> Creating room [${room._id}].`);
            RoomService.addRoom(room);

            // then get room participant
            const roomParticipant: User = room.participants[0];
            // add room to participant
            UserService.addRoomToUser(roomParticipant._id, room);

            // subscribe socket to room
            console.info(`> Subscribing socket [${socket.id}] to room [${room._id}].`);
            socket.join(room._id);
        }
    });

    socket.on('addToRoom', (roomId: string, participant: User) => {
        if (!roomId || !participant) {
            console.error('No roomId or participant found.');
            return;
        } else {
            console.info(`> Added user [${participant._id}] to room [${roomId}].`);

            // add user to socket room
            RoomService.addToRoom(roomId, participant);

            // retrieve socket room
            const socketRoom: Room = RoomService.retrieveRoom(roomId);
            // add room to user
            UserService.addRoomToUser(participant._id, socketRoom);

            // get participant socket id
            const participantSocketId: string = UserService.retrieveSocketId(participant._id);

            if (participantSocketId) {
                // ask user to subscribe to room
                console.info(`> Requesting socket[${participantSocketId}] to join room [${roomId}]... ?`);
                io.to(participantSocketId).emit('subscribeToRoomDirective', socketRoom);
            }
        }
    });

    socket.on('subscribeToRoomCompliance', (roomId: string) => {
        if (roomId) {
            console.log(`> Subscribing socket [${socket.id}] to room [${roomId}]... ✓`);
            socket.join(roomId);
        } else {
            console.log(`> Could not join socket [${socket.id}] to room... X`);
            console.error('No roomId found.');
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