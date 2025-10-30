import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Auth } from 'src/app/common/services/auth';
import { Router } from '@angular/router';
import Toastify from 'toastify-js';
import { Logo } from "src/app/common/components/logo/logo";

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, Logo],
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
        } else {
          Toastify({
            text: 'Credenciales inválidas',
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'right',
            stopOnFocus: true,
            style: {
              background: 'linear-gradient(135deg, #ff4b4b, #ff6b6b)',
              color: '#fff',
              fontWeight: '600',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              padding: '14px 18px',
              fontSize: '15px',
            },
          }).showToast();
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
