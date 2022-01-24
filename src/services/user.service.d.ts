import { SocketUser, SocketUsers } from '../types/User';

export interface SocketUserService {
    users: SocketUsers;

    addUser(user: SocketUser): void;
    retrieveUser(userId: string): SocketUser;
    retrieveUsers(userIds: string[]): SocketUsers;
    retrieveAllUsers(): SocketUsers;
}