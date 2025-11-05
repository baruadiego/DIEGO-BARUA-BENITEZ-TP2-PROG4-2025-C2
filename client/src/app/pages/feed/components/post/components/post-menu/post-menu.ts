import { Component, ElementRef, HostListener, inject, output, Renderer2, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/app/common/services/auth';
import { UserService } from 'src/app/common/services/user-service';
import { User } from 'src/app/common/types/user';

@Component({
  selector: 'app-post-menu',
  imports: [],
  templateUrl: './post-menu.html',
  styleUrl: './post-menu.css',
})
export class PostMenu {
  currentUser = signal<User | null>(null);
  userService = inject(UserService);
  authService = inject(Auth);
  rendered = inject(Renderer2);
  router = inject(Router);
  hidden = signal(true);

  delete = output<void>();
  edit = output<void>();

  ngOnInit() {
    this.currentUser.set(this.userService.getUser());
  }

  @ViewChild('menu', { static: false }) menu!: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.menu && !this.menu.nativeElement.contains(event.target)) {
      this.hide();
    }
  }

  hide(){
    this.rendered.addClass(this.menu.nativeElement, 'scale-out-ver-top');

    setTimeout(() => {
      this.hidden.set(true);
    }, 1000);
 
  }

  show(){
    this.hidden.set(false);
  }
}
