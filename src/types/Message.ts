import { User } from "./User";

export interface Message {
    _id: string;
    roomId: string;
    senderId: string;
    sender: User;
    message: string;
    createdAt: Date;
    updatedAt: Date;
}