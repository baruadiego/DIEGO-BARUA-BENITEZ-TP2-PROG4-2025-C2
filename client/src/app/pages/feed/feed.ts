import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { PostService } from 'src/app/common/services/post-service';
import { Post } from 'src/app/common/types/post';
import { PostComponent } from './components/post/post';
import { Router } from '@angular/router';
import { FullPost } from './components/full-post/full-post';
import { Loader } from 'src/app/common/components/loader/loader';
import { ApiResponse } from 'src/app/common/types/apiResponse';

@Component({
  selector: 'app-feed',
  imports: [PostComponent, FullPost, Loader],
  templateUrl: './feed.html',
  styleUrl: './feed.css',
})
export class Feed {
  router = inject(Router);
  postService = inject(PostService);
  posts = signal<Post[]>([]);
  fullPost = signal<Post | null>(null);

  postsPerPage = 2;
  currentPage = 0;
  totalPages = 1;

  ngOnInit() {
    this.getPosts();
  }

  @ViewChild('sentinel', { static: false }) sentinel!: ElementRef;
  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if ((this.currentPage >= this.totalPages) && this.currentPage !== 1) {
          return;
        }

        setTimeout(() => {
          this.getPosts();
        }, 1000)
      }
    });
    observer.observe(this.sentinel.nativeElement);
  }

  getPosts() {
    this.currentPage++;

    const lastSegment = this.router.url.split('/').pop();
    const sortBy = lastSegment === 'trends' ? 'likesCount' : 'createdAt';

    const response = this.postService.getAllPosts(this.currentPage, this.postsPerPage, sortBy);
    response.subscribe((response) => {
      if (!response) {
        return;
      }

      this.posts.set([...this.posts(), ...response.posts!]);
      this.totalPages = response.totalPages!;
      this.currentPage = response.page!;
    });
  }

  reload(){
    const lastSegment = this.router.url.split('/').pop();
    const sortBy = lastSegment === 'trends' ? 'likesCount' : 'createdAt';

    const response = this.postService.getAllPosts(1, this.posts().length, sortBy);
    response.subscribe((response) => {
      if (!response) {
        return;
      }
      
      this.posts.set(response.posts!);
    });
  }

  IsLastPost(index: number) {
    return index === this.posts().length - 1;
  }

  openPost(post: Post) {
    this.fullPost.set(post);
  }

  closePost() {
    this.fullPost.set(null);
    this.getPosts();
  }
}
