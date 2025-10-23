import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { person } from './app';

@Injectable({
  providedIn: 'root',
})
export class backService {
  http = inject(HttpClient);
  person = signal<person>({});


  getPerson(dni: string): person {
    const apiUrl = `https://diego-barua-benitez-tp2-prog4-2025-c2.onrender.com/${dni}`;
    const response: Observable<any> = this.http.get<any>(apiUrl);


    const subscription: Subscription = response.subscribe((data) => {
      this.person.set(data.data);
      subscription.unsubscribe();
    });
    
    return this.person();
  }
}
