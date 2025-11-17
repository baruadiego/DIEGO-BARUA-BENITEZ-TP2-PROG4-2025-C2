import { Component, effect, inject, input, signal } from '@angular/core';
import { UserService } from 'src/app/common/services/user-service';
import { User } from 'src/app/common/types/user';

@Component({
  selector: 'app-user-detail',
  imports: [],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.css',
})
export class UserDetail {
  userService = inject(UserService);
  user = input<{
    _id: string;
    userName: string;
    imageUrl: string;
  }>();
  activity = signal<{ posts: number; comments: number; likes: number }>({
    posts: 0,
    comments: 0,
    likes: 0,
  });

  constructor() {
    effect(() => {
      if (this.user()?._id) {
        this.userService.getActivity(this.user()?._id!).subscribe((response) => {
          if (response) {
            this.activity.set(response);
          }
        });
      }
    });
  }
}
