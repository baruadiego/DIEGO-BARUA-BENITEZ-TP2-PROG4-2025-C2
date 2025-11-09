import { Component, inject, signal, ViewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [NgClass, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  rendered = inject(Renderer2);

  isOpen = signal<boolean>(true);
  showContent = signal<boolean>(true);
  showAdminRoutes = signal<boolean>(false);
  toggleIcon = signal<boolean>(false);

  toggle() {
    this.isOpen.set(!this.isOpen());

    if (this.isOpen()) {
      setTimeout(() => {
        this.showContent.set(true);
      }, 200);
    } else {
      this.showContent.set(false);
    }
  }

  @ViewChild('adminRoutes', { static: false }) adminRoutes!: ElementRef;
  toggleAdmin() {
    this.toggleIcon.set(!this.toggleIcon());
    
    if (this.showAdminRoutes()) {
      this.rendered.addClass(this.adminRoutes.nativeElement, 'scale-out-ver-top');

      setTimeout(() => {
        this.showAdminRoutes.set(false);
      }, 1000);
    } else {
      this.showAdminRoutes.set(true);
    }
  }
}
