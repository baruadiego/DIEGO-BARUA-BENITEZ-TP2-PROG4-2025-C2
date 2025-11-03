import { Component, ElementRef, ViewChild } from '@angular/core';
import { Logo } from "src/app/common/components/logo/logo";
import { Profile } from "./components/profile/profile";
import { UserMenu } from "./components/user-menu/user-menu";

@Component({
  selector: 'app-header',
  imports: [Logo, Profile, UserMenu],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @ViewChild('userMenu', { static: false }) userMenu!: UserMenu

  show(){
    this.userMenu.show()
  }
}
