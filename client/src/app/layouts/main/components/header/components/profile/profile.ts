import { Component, inject, signal } from '@angular/core';
import { UserService } from 'src/app/common/services/user-service';
import { User } from 'src/app/common/types/user';
import { Loader } from "src/app/common/components/loader/loader";

@Component({
  selector: 'app-profile',
  imports: [Loader],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  userService = inject(UserService);
  user = signal<User | null>(null);
  loading = signal<boolean>(true);

  constructor() {
    this.user.set(this.userService.getUser());
    this.loading.set(false);
  }
}
