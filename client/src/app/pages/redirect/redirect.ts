import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/app/common/services/auth';

@Component({
  selector: 'app-redirect',
  imports: [],
  templateUrl: './redirect.html',
  styleUrl: './redirect.css',
})
export class Redirect {
  authService = inject(Auth);
  router = inject(Router);

  constructor() {
    this.verifyToken();
  }

  async verifyToken() {
    setTimeout(() => {
      this.authService.isAuthenticated().subscribe((isAuth) => {
        if (isAuth) {
          this.router.navigate(['feed']);
        } else {
          this.router.navigate(['login']);
        }
      });
    }, 2000);
  }
}
