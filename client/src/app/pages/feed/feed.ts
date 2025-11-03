import { Component, inject, signal } from '@angular/core';
import { PostService } from 'src/app/common/services/post-service';
import { Post } from 'src/app/common/types/post';
import { PostComponent } from "./components/post/post";

@Component({
  selector: 'app-feed',
  imports: [PostComponent],
  templateUrl: './feed.html',
  styleUrl: './feed.css',
})
export class Feed {
  postService = inject(PostService);
  response = this.postService.getAllPosts(1, 15);
  posts = signal<Post[]>([]);

  constructor() {
    this.response.subscribe((response) => this.posts.set(response));
  }
}
