import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from 'src/app/common/services/auth';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { LOCALE_ID } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import localeEsAr from '@angular/common/locales/es-AR';
import { registerLocaleData, NgClass } from '@angular/common';
import { NewUser } from 'src/app/common/types/newUser';
import { catchError, finalize, map, of } from 'rxjs';
import { Loader } from 'src/app/common/components/loader/loader';
import { Logo } from "src/app/common/components/logo/logo";
import { ToastifyService } from 'src/app/common/services/toastify';

registerLocaleData(localeEsAr);

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    Loader,
    Logo,
    NgClass
],
  templateUrl: './register.html',
  styleUrl: './register.css',
  providers: [
    provideNativeDateAdapter(),
    { provide: LOCALE_ID, useValue: 'es-AR' },
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
  ],
})
export class Register {
  protected auth = inject(Auth);
  protected router = inject(Router);
  protected toastify = inject(ToastifyService);

  loginError = signal<boolean>(false);
  today = new Date();
  checkingIdentifier = signal<boolean>(false);
  step = signal<number>(1);

  validatePassword(control: AbstractControl): ValidationErrors | null {
    const error = { equals: true };

    if (!control.value) {
      return error;
    }

    const password = control.parent?.get('password')?.value;

    if (!password) {
      return error;
    }

    if (control.value === password) {
      return null;
    } else {
      return error;
    }
  }

  minAgeValidator(minAge: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age < minAge ? { tooYoung: true } : null;
    };
  }

  availableIdentifierValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;
      if (!value) return of(null);

      this.checkingIdentifier.set(true);
      return this.auth.usernameUsed(value).pipe(
        map((used: boolean) => (used ? { identifierTaken: true } : null)),
        catchError(() => of(null)),
        finalize(() => this.checkingIdentifier.set(false))
      );
    };
  }

  formData = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$'),
    ]),

    lastname: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$'),
    ]),

    userName: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z0-9._-]+$'),
      ],
      // asyncValidators: this.availableIdentifierValidator(),
      // updateOn: 'blur',
    }),

    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
      ],
      asyncValidators: this.availableIdentifierValidator(),
      updateOn: 'blur',
    }),

    birthDate: new FormControl('', [Validators.required, this.minAgeValidator(16)]),

    role: new FormControl('', [Validators.required, Validators.pattern('^(user|admin)$')]),

    imageUrl: new FormControl('', [
      Validators.required,
      Validators.pattern('https?://.+\\.(jpg|jpeg|png|webp)$'),
    ]),

    description: new FormControl('', [Validators.required, Validators.maxLength(255)]),

    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    repeatPassword: new FormControl('', [Validators.required, this.validatePassword]),
  });

  register() {
    const data = this.formData.value;
    const formValues = this.formData.value;

    const newUser: NewUser = {
      email: formValues.email!,
      name: formValues.name!,
      lastname: formValues.lastname!,
      password: formValues.password!,
      userName: formValues.userName!,
      role: formValues.role!,
      imageUrl: formValues.imageUrl!,
      description: formValues.description!,
      birthDate: formValues.birthDate!,
    };

    this.auth.register(newUser).subscribe((success) => {
      if (success) {
        this.toastify.showToast('Registrado con exito', 3000, 'success');
        this.router.navigate(['/login']);
      } else {
        this.toastify.showToast('Ocurrio un error. Intente nuevamente', 3000, 'error');
      }

      if (this.formData.valid) {
        this.formData.reset();
      }
    });
  }
}
