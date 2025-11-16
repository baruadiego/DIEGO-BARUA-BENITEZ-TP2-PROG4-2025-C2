import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";

export type person = {
  dni?: string,
  name?: string,
  lastname?: string
}

@Component({
  selector: 'app-root',
  providers: [],
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
}
