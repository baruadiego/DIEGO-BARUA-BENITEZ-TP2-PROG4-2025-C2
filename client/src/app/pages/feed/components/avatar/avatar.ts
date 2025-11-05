import { Component, input } from '@angular/core';
import { NgClass } from "@angular/common";

export type Author = {
  _id: string;
  userName: string;
  imageUrl: string;
};

@Component({
  selector: 'app-avatar',
  imports: [NgClass],
  templateUrl: './avatar.html',
  styleUrl: './avatar.css',
})
export class Avatar {
  author = input<Author | null>(null);
  size = input<string>('sm');
}
