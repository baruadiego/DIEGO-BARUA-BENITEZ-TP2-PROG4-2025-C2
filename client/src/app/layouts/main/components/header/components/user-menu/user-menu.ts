import { Component, ElementRef, HostListener, inject, ViewChild, Renderer2, signal} from '@angular/core';
import { Profile } from "../profile/profile";
import { UserService } from 'src/app/common/services/user-service';
import { Auth } from 'src/app/common/services/auth';
import { Router } from '@angular/router';
import { User } from 'src/app/common/types/user';
import { Hover } from "src/app/common/directives/hover";

@Component({
  selector: 'app-user-menu',
  imports: [Profile, Hover],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.css',
})
export class UserMenu {
  currentUser = signal<User | null>(null);
  userService = inject(UserService);
  authService = inject(Auth);
  rendered = inject(Renderer2);
  router = inject(Router);
  hidden = signal(true);

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

  logout() {
    this.authService.logOut();
    this.router.navigate(['login']);
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
