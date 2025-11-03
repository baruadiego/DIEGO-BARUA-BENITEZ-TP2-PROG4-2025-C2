import { Component, input } from '@angular/core';

export type Author = {
  _id: string;
  userName: string;
  imageUrl: string;
};

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.html',
  styleUrl: './avatar.css',
})
export class Avatar {
  author = input<Author | null>(null);
}
