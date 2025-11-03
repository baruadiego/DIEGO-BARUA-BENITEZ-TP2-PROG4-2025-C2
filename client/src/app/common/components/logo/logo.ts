import { Component, input } from '@angular/core';
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-logo',
  imports: [NgClass],
  templateUrl: './logo.html',
  styleUrl: './logo.css',
})
export class Logo {
  size = input<string>('');
}
