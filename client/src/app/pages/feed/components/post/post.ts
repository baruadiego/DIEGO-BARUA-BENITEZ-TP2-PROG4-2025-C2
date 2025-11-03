import { Component, inject, input, signal } from '@angular/core';
import { UserService } from 'src/app/common/services/user-service';
import { Post } from 'src/app/common/types/post';
import { Avatar } from "../avatar/avatar";

@Component({
  selector: 'app-post',
  imports: [Avatar],
  templateUrl: './post.html',
  styleUrl: './post.css',
})
export class PostComponent {
  data = input<Post | null>(null); 
  userService = inject(UserService);

  isSelf(): boolean {
    return this.userService.getUser()?.userName === this.data()?.author?.userName;
  }
}
