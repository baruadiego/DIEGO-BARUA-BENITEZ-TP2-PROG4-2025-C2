import { Component, input } from '@angular/core';

@Component({
  selector: 'app-profile-avatar',
  imports: [],
  templateUrl: './avatar.html',
  styleUrl: './avatar.css',
})
export class ProfileAvatar {
  url = input<string>('');
}
