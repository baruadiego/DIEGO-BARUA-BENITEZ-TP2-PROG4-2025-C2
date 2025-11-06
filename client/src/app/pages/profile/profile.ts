import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/common/services/user-service';
import { User } from 'src/app/common/types/user';
import { ProfileAvatar } from "./components/avatar/avatar";
import { Post } from 'src/app/common/types/post';
import { PostComponent } from "../feed/components/post/post";
import { FullPost } from "../feed/components/full-post/full-post";

type Activity = {
  posts: number,
  comments: number,
  likes: number
}
@Component({
  selector: 'app-profile',
  imports: [ProfileAvatar, PostComponent, FullPost],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  router = inject(Router);
  userService = inject(UserService);

  currentUser = signal<User>(
    this.userService.getUser()!
  );
  posts = signal<Post[]>([]);
  fullPost = signal<Post | null>(null);
  activity = signal<Activity>({posts: 0, comments: 0, likes: 0});

  constructor() { 
    this.reload();
  }

  getPosts() {
    this.userService
      .getUserPosts(1, 3)
      .subscribe((response) => {
        if (response) {
          this.posts.set(response.posts);
        }
      });
  }

  getActivity() {
    this.userService
      .getActivity()
      .subscribe((response) => {
        if (response) {
          this.activity.set(response);
        }
      });
  }

  isLastPost(index: number) {
    return index === this.posts().length - 1;
  }

  openPost(post: Post){
    this.fullPost.set(post);
  }

  closePost(){
    this.fullPost.set(null);
    this.reload();
  }

  reload(){
    this.getPosts();
    this.getActivity();
  }
}
