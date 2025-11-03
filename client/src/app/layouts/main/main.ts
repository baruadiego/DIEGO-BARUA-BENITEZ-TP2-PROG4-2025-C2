import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Header } from "./components/header/header";
import { Sidebar } from "./components/sidebar/sidebar";

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {

}
