import { User } from "./User";

export interface Room {
    _id: string;
    name?: string | null;
    participants: User[];
    loaded: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type Rooms = Room[];