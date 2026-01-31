import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Auth } from 'src/app/common/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  protected auth = inject(Auth);
  protected router = inject(Router);

  private userTest = {
    email: 'test@gmail.com',
    password: '12345678',
  };

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

  autocomplete() {
    this.formData.patchValue({
      email: this.userTest.email,
      password: this.userTest.password,
    });
  }
}
