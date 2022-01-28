import { Room } from '../types/Room';
import { SocketUser, SocketUsers } from '../types/User';
import { SocketUserService } from './user.service.d';




class UserService implements SocketUserService {

    private _users: SocketUsers = [];

    public get users(): SocketUsers {
        return this.users;
    }

    public set users(value: SocketUsers) {
        this._users = value;
    }

    public addUser(user: SocketUser): void {
        // first check if user already in list
        const userIndex = this._users.findIndex(u => u._id === user._id);
        if (userIndex === -1) {
            this._users.push(user);
        } else {
            this._users[userIndex] = {
                ...this._users[userIndex],
                ...user
            };
        }
    }

    public retrieveUser(userId: string): SocketUser {
        const userIndex = this._users.findIndex(u => u._id === userId);
        if (userIndex === -1) {
            return null;
        }
        return this._users[userIndex];
    }

    public retrieveUsers(userIds: string[]): SocketUsers {
        return this._users.filter(u => userIds.includes(u._id));
    }

    public retrieveAllUsers(): SocketUsers {
        return this._users;
    }

    public retrieveSocketId(userId: string): string {
        const userIndex = this._users.findIndex(u => u._id === userId);
        if (userIndex === -1) {
            return null;
        }
        return this._users[userIndex].socketId;
    }

    public addRoomToUser(userId: string, room: Room): void {
        this._users = this._users.map(u => {
            if (u._id === userId) {
                u.rooms = [...u.rooms, room];
            }
            return u;
        });
    }
}


const UserServiceInstance: SocketUserService = new UserService();

export default UserServiceInstance;

