import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { backService } from './servicioBack';
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
  server = inject(backService);
  protected readonly title = signal('client');

  request() {
    this.server.getPerson('45000123');
  }
}
