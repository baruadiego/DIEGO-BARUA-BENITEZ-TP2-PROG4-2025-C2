import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Auth } from 'src/app/common/services/auth';
import { Router } from '@angular/router';
import Toastify from 'toastify-js';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  protected auth = inject(Auth);
  protected router = inject(Router);

  private users = [
    {
      email: 'diegobarua03@gmail.com',
      password: '11152728V',
    },
    {
      email: 'diegobarua.dev@gmail.com',
      password: '12345678',
    },
    {
      email: 'juan@gmail.com',
      password: 'prueba123',
    },
  ];

  formData = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
    ]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  async login() {
    const data = this.formData.value;
    if (data.email && data.password) {
      this.auth.login(data.email, data.password).subscribe((success) => {
        if (success) {
          this.router.navigate(['/feed']);
        } 

        if (this.formData.valid) {
          this.formData.reset();
        }
      });
    }
  }

  autocomplete(user: number) {
    this.formData.patchValue({
      email: this.users[user - 1].email,
      password: this.users[user - 1].password,
    });
  }
}
