import { Component, inject, signal } from '@angular/core';
import { PostService } from 'src/app/common/services/post-service';
import { Post } from 'src/app/common/types/post';
import { PostComponent } from "./components/post/post";
import { Router } from '@angular/router';
import { FullPost } from "./components/full-post/full-post";

@Component({
  selector: 'app-feed',
  imports: [PostComponent, FullPost],
  templateUrl: './feed.html',
  styleUrl: './feed.css',
})
export class Feed {
  router = inject(Router);
  postService = inject(PostService);
  posts = signal<Post[]>([]);
  
  ngOnInit() {
    this.getPosts();
  }

  getPosts(){
    const lastSegment = this.router.url.split('/').pop();

    const sortBy = lastSegment === 'trends' ? 'likesCount' : 'createdAt';

    const response = this.postService.getAllPosts(1, 15, sortBy);
    response.subscribe((response) => this.posts.set(response));
  }

  IsLastPost(index: number){
    return index === this.posts().length - 1
  }
}
