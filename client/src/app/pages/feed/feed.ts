import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/app/common/services/auth';

@Component({
  selector: 'app-feed',
  imports: [],
  templateUrl: './feed.html',
  styleUrl: './feed.css',
})
export class Feed {
  router = inject(Router);
  auth = inject(Auth);

  logOut() {
    this.auth.logOut().subscribe(() => this.router.navigate(['login']));
  }
}
