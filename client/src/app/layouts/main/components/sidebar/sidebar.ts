import { Component, signal } from '@angular/core';
import { NgClass } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-sidebar',
  imports: [NgClass, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  isOpen = signal<boolean>(true);
  showContent = signal<boolean>(true);

  toggle() {
    this.isOpen.set(!this.isOpen());

    if (this.isOpen()) {
      setTimeout(() => {
        this.showContent.set(true);
      }, 200);
    }else{
      this.showContent.set(false);
    }

  }

}
