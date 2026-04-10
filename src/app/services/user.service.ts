import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface UserItem {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: UserItem[] = [
    {
      id: 1,
      name: 'Admin',
      email: 'admin@bank.com',
      role: 'ADMIN'
    },
    {
      id: 2,
      name: 'User One',
      email: 'user1@bank.com',
      role: 'USER'
    }
  ];

  getAllUsers(): Observable<UserItem[]> {
    return of(this.users);
  }
}