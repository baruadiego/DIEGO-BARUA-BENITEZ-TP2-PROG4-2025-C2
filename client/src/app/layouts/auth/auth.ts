import { Component } from '@angular/core';
import { Logo } from "src/app/common/components/logo/logo";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-auth',
  imports: [Logo, RouterOutlet],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {

}
