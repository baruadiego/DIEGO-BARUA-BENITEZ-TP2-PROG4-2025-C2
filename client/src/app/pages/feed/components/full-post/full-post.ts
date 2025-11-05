import { Component, effect, inject, input, signal } from '@angular/core';
import { Post } from 'src/app/common/types/post';
import { Avatar } from "../avatar/avatar";
import { DateStringPipe } from 'src/app/common/pipes/date-string-pipe';
import { User } from 'src/app/common/types/user';
import { PostService } from 'src/app/common/services/post-service';
import { UserService } from 'src/app/common/services/user-service';
import { CommentService } from 'src/app/common/services/comment-service';
import { Comment } from 'src/app/common/types/comment';
import { CommentComponent } from './components/comment/comment';
import { FormsModule } from '@angular/forms';
import { ToastifyService } from 'src/app/common/services/toastify';
import { A11yModule } from "@angular/cdk/a11y";

@Component({
  selector: 'app-full-post',
  imports: [Avatar, DateStringPipe, CommentComponent, FormsModule, A11yModule],
  templateUrl: './full-post.html',
  styleUrl: './full-post.css',
})
export class FullPost {
  commentsPerPage = 10;
  currentPage = 1;

  postService = inject(PostService);
  userService = inject(UserService);
  commentService = inject(CommentService);
  toastify = inject(ToastifyService);

  data = input<Post | null>(null);
  currentUser = signal<User | null>(null);
  post = signal<Post | null>(null);
  comments = signal<Comment[] | null>(null);

  content: string = '';
  constructor() {
    this.currentUser.set(this.userService.getUser());
    effect(() => {
      if (this.data()){ 
        this.post.set(this.data());
        this.updateComments()
      }
    });
  }

  updateComments() {
    this.commentService.getComments(this.post()!._id!).subscribe((res) => this.comments.set(res));
  }

  isSelf(): boolean {
    return this.currentUser()?.userName === this.post()?.author?.userName;
  }

  isLiked(): boolean {
    return this.post()?  this.post()!.likes!.includes(this.currentUser()!._id) : false;
  }

  like() {
    if(this.post()){
      this.postService.likePost(this.post()!._id!).subscribe((res) => {
        if (res) {
          this.post()?.likes?.push(this.currentUser()!._id);
          this.post.set({
            ...this.post()!,
            likesCount: this.post()!.likesCount + 1
          })
        }
      });
    }
  }

  unlike() {
    if(this.post()){
      this.postService.unlikePost(this.post()!._id!).subscribe((res) => {
        if (res) {
          this.post()?.likes?.splice(this.post()!.likes!.indexOf(this.currentUser()!._id), 1)
          this.post.set({
            ...this.post()!,
            likesCount: this.post()!.likesCount - 1
          })
        }
      });
    }
  }

  sendComment() {
    this.commentService
      .createComment({ content: this.content, postId: this.post()!._id! })
      .subscribe((res) => {
        if (res) {
          this.updateComments();
          this.content = '';
          this.toastify.showToast('Comentario enviado con exito', 3000, 'success');

          this.post.set({
            ...this.post()!,
            commentsCount: this.post()!.commentsCount! + 1
          })
        }else{
          this.toastify.showToast('Error al enviar el comentario', 3000, 'error');
        }
      });
  }
}
