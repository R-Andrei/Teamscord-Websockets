import { User } from '../types/User';
import { Room, Rooms } from '../types/Room';


export interface SocketRoomService {
    rooms: Rooms;

    addRooms(rooms: Rooms): void;
    retrieveRoom(roomId: string): Room;
    retrieveRooms(roomIds: string[]): Rooms;
    retrieveAllRooms(): Rooms;
    addRoom(room: Room): void;
    addToRoom(roomId: string, participant: User): void;
}