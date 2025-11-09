import { Component, inject, signal } from '@angular/core';
import { UserService } from 'src/app/common/services/user-service';
import { User } from 'src/app/common/types/user';
import { Toggle } from "src/app/common/components/toggle/toggle";

@Component({
  selector: 'app-users',
  imports: [Toggle],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  userService = inject(UserService);
  users = signal<User[]>([]);

  constructor() {
    this.userService.getUsers().subscribe((res) => {
      if (res) {
        this.users.set(res);
      }
    })
  }
}
