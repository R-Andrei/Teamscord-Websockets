import { Room, Rooms } from '../types/Room';
import { SocketUser, SocketUsers } from '../types/User';
import { SocketRoomService } from './room.service.d';




class RoomService implements SocketRoomService {

    private _rooms: Rooms = [];

    public get rooms(): Rooms {
        return this._rooms;
    }

    public set rooms(value: Rooms) {
        this._rooms = value;
    }

    public addRooms(rooms: Rooms): void {
        this._rooms = [...this._rooms, ...rooms];
    }
    public retrieveRoom(roomId: string): Room {
        const roomIndex = this._rooms.findIndex(r => r._id === roomId);
        if (roomIndex === -1) {
            return null;
        }
        return this._rooms[roomIndex];
    }
    public retrieveRooms(roomIds: string[]): Rooms {
        return this._rooms.filter(r => roomIds.includes(r._id));
    }
    public retrieveAllRooms(): Rooms {
        return this._rooms;
    }

    public addRoom(room: Room): void {
        this._rooms = [...this._rooms, room];
    }
    public addToRoom(roomId: string, participant: SocketUser): void {
        this._rooms = this._rooms.map(r => {
            if (r._id === roomId) {
                r.participants = [...r.participants, participant];
            }
            return r;
        });
    }
}


const RoomServiceInstance: SocketRoomService = new RoomService();

export default RoomServiceInstance;

