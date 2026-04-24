import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface User {
    username?: string;
    firstName?: string;
    token?: string;
    [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class UserProfileService {
    constructor(private http: HttpClient) { }
    /***
     * Get All User
     */
    getAll() {
        return this.http.get<User[]>(`api/users`);
    }

    /***
     * Facked User Register
     */
    register(user: User) {
        return this.http.post(`/users/register`, user);
    }
}
