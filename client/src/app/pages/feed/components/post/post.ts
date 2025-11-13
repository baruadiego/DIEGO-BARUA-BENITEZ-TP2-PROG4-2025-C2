import { Component, effect, inject, input, output, signal, ViewChild } from '@angular/core';
import { UserService } from 'src/app/common/services/user-service';
import { Post } from 'src/app/common/types/post';
import { Avatar } from "../avatar/avatar";
import { User } from 'src/app/common/types/user';
import { LikeToggleDirective } from "./directives/app-like-toggle";
import { PostService } from 'src/app/common/services/post-service';
import { NgClass } from "@angular/common";
import { DateStringPipe } from 'src/app/common/pipes/date-string-pipe';
import { PostMenu } from "./components/post-menu/post-menu";
import { ToastifyService } from 'src/app/common/services/toastify';

@Component({
  selector: 'app-post',
  imports: [Avatar, LikeToggleDirective, NgClass, DateStringPipe, PostMenu],
  templateUrl: './post.html',
  styleUrl: './post.css',
})
export class PostComponent {
  userService = inject(UserService);
  postService = inject(PostService);
  toastify = inject(ToastifyService);

  data = input<Post | null>(null); 
  isLastPost = input<boolean>(false);

  currentUser = signal<User | null>(null);
  post = signal<Post | null>(null);

  reload = output<void>();
  openPost = output<Post>();


  @ViewChild('postMenu', { static: false }) postMenu!: PostMenu;

  constructor() {
    this.currentUser.set(this.userService.getUser());

    effect(() => {
      const value = this.data();
      if (value) this.post.set(value);
    });
  }

  isSelf(): boolean {
    return this.currentUser()?.userName === this.post()?.author?.userName;
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  isLiked(): boolean {
    return this.post()!.likes!.includes(this.currentUser()!._id);
  }

  like() {
    if(this.post()){
      this.postService.likePost(this.post()!._id!).subscribe((res) => {
        if (res) {
          this.post()?.likes?.push(this.currentUser()!._id);

          this.post.set({
            ...this.post()!,
            likesCount: this.post()!.likesCount + 1,
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

  openMenu(){
    this.postMenu.show();
  }

  deletePost(){
    this.postService.deletePost(this.post()!._id!).subscribe((res) => {
      if (res) {
        this.toastify.showToast('Publicación eliminada con exito', 3000, 'success');
        this.reload.emit();
      }else{
        this.toastify.showToast('Error al eliminar la publicación', 3000, 'error');
      }
    })
  }
}
