import { User } from "./User";

export interface Room {
    _id: string;
    name?: string | null;
    participants: User[];
    createdAt: Date;
    updatedAt: Date;
}

export type Rooms = Room[];