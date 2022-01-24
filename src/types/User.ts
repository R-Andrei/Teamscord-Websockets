import { Rooms } from "./Room";

export interface User {
    _id: string;
    username: string;
    avatar: string;
    tag: string;
    email: string;
    rooms: Rooms;
    createdAt: Date;
    updatedAt: Date;
    status: string;
}

export interface SocketUser extends User {
    socketId: string;
}

export type Users = User[];
export type SocketUsers = SocketUser[];