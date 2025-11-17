import {
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { Comment } from 'src/app/common/types/comment';
import { Avatar } from '../../../avatar/avatar';
import { DateCommentStringPipe } from 'src/app/common/pipes/date-string-comment-pipe';
import { User } from 'src/app/common/types/user';
import { PostMenu } from '../../../post/components/post-menu/post-menu';
import { CommentService } from 'src/app/common/services/comment-service';
import { ToastifyService } from 'src/app/common/services/toastify';
import { FormsModule } from '@angular/forms';
import { Hover } from 'src/app/common/directives/hover';

@Component({
  selector: 'app-comment',
  imports: [Avatar, DateCommentStringPipe, PostMenu, FormsModule, Hover],
  templateUrl: './comment.html',
  styleUrl: './comment.css',
})
export class CommentComponent {
  commentService = inject(CommentService);
  toastify = inject(ToastifyService);
  data = input<Comment | null>(null);

  currentUser = input<User | null>(null);
  reload = output<boolean>();

  comment = signal<Comment | null>(null);
  isEditing = signal(false);
  editingContent = '';

  @ViewChild('postMenu', { static: false }) postMenu!: PostMenu;
  @ViewChild('editInput', { static: false }) editInput!: ElementRef;

  constructor() {
    effect(() => this.comment.set(this.data()));
  }

  isSelfComment(): boolean {
    return this.comment()?.author?._id === this.currentUser()?._id;
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  isModified(): boolean {
    return this.comment()?.createdAt !== this.comment()?.updatedAt;
  }

  openMenu() {
    this.postMenu.show();
  }

  deleteComment() {
    this.commentService.deleteComment(this.comment()!._id!).subscribe((res) => {
      if (res) {
        this.toastify.showToast('Comentario eliminado con exito', 3000, 'success');
        this.reload.emit(true);
      } else {
        this.toastify.showToast('Error al eliminar el comentario', 3000, 'error');
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.editInput && !this.editInput.nativeElement.contains(event.target)) {
      this.isEditing.set(false);
      this.editingContent = '';
    }
  }

  editComment() {
    this.isEditing.set(true);
    this.editingContent = this.comment()?.content!;

    setTimeout(() => {
      this.editInput.nativeElement.focus();
    });
  }

  updateComment() {
    this.commentService
      .updateComment(
        this.comment()!._id!,
        this.editingContent,
      )
      .subscribe((res) => {
        if (res) {
          this.toastify.showToast('Comentario actualizado con exito', 3000, 'success');
          this.isEditing.set(false);
          this.comment.set({ ...this.comment()!, content: this.editingContent });
          this.reload.emit(false);
        } else {
          this.toastify.showToast('Error al actualizar el comentario', 3000, 'error');
        }
      });
  }
}
