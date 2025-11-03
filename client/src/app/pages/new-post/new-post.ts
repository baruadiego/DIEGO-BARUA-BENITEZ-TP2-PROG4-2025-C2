import { Component, inject, ViewChild, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploader } from 'src/app/common/services/file-uploader';
import { PostService } from 'src/app/common/services/post-service';
import { ToastifyService } from 'src/app/common/services/toastify';
import { Post } from 'src/app/common/types/post';
import { fileValidator } from 'src/app/common/validators/file.validator';

type Image = {
  url: string;
  path: string;
};
@Component({
  selector: 'app-new-post',
  imports: [ReactiveFormsModule],
  templateUrl: './new-post.html',
  styleUrl: './new-post.css',
})
export class NewPost {
  imageUploader = inject(FileUploader);
  toastService = inject(ToastifyService);
  postService = inject(PostService);
  router = inject(Router);
  imageName = '';
  imageUrl = '';

  formData = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    content: new FormControl('', [Validators.required, Validators.maxLength(280)]),
    image: new FormControl<File | null>(null, [fileValidator]),
  });

  @ViewChild('fileInput') fileInput!: HTMLInputElement;

  async createPost() {
    if (this.formData.invalid) {
      return;
    }

    let image: Image | null = null;
    if (this.imageUrl) {
      
      image = await this.imageUploader.uploadFile(this.formData.value.image!, 'postImages');

      if (!image) {
        this.toastService.showToast(
          'Ocurrio un error Subiendo la imagen. Intente nuevamente',
          3000,
          'error'
        );
        return;
      }
    }

    const formValues = this.formData.value;
    const newPost: Post = {
      title: formValues.title!,
      content: formValues.content!,
      imageUrl: image?.url,
      imagePath: image?.path,
    };

    this.postService.createPost(newPost).subscribe((success) => {
      if (success) {
        this.toastService.showToast('Publicación creada con exito', 3000, 'success');
        this.router.navigate(['/feed']);
      } else {
        this.toastService.showToast('Ocurrio un error. Intente nuevamente', 3000, 'error');
      }

      if (this.formData.valid) {
        this.formData.reset();
      }
    });
  }

  resetFileInput() {
    this.fileInput.files = null;
    this.imageUrl = '';
    this.imageName = '';
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    this.formData.get('image')?.setValue(file);

    this.imageName = file.name;

    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
    }

    this.imageUrl = URL.createObjectURL(file);
  }
}
