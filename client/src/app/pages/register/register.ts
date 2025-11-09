import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
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
import { ToastifyService } from 'src/app/common/services/toastify';
import { fileValidator } from 'src/app/common/validators/file.validator';
import { minAgeValidator } from 'src/app/common/validators/minAge.validator';
import { validatePassword } from 'src/app/common/validators/password.validator';
import { availableIdentifierValidator } from 'src/app/common/validators/availableIdentifier.validator';
import { FileUploader } from 'src/app/common/services/file-uploader';

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
    FormsModule,
    NgClass,
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
  protected fileUploader = inject(FileUploader);

  adminRegister = signal<boolean>(false);
  
  ngOnInit(){
    const url = this.router.url.split('/');
    if (url.includes('admin')){
      this.adminRegister.set(true);
    }
  }

  defaultRole(){
    return this.router.url.split('/').includes('admin')? '' : 'user'
  }

  today = new Date();
  step = signal<number>(1);

  imageName = '';
  imageUrl = '';

  formImageData = new FormGroup({
    image: new FormControl<File | null>(null, [Validators.required, fileValidator]),
  });

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
      asyncValidators: availableIdentifierValidator(),
      updateOn: 'blur',
    }),

    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
      ],
      asyncValidators: availableIdentifierValidator(),
      updateOn: 'blur',
    }),

    birthDate: new FormControl('', [Validators.required, minAgeValidator(15)]),

    role: new FormControl(this.defaultRole(), [Validators.required, Validators.pattern('^(user|admin)$')]),

    description: new FormControl('', [Validators.required, Validators.maxLength(255)]),

    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    repeatPassword: new FormControl('', [Validators.required, validatePassword]),
  });

  async register() {
    const profileImage = await this.fileUploader.uploadFile(
      this.formImageData.value.image!,
      'profileImages'
    );

    if (!profileImage) {
      this.toastify.showToast(
        'Ocurrio un error Suiendo la imagem. Intente nuevamente',
        3000,
        'error'
      );
    }

    const formValues = this.formData.value;
    const newUser: NewUser = {
      email: formValues.email!,
      name: formValues.name!,
      lastname: formValues.lastname!,
      password: formValues.password!,
      userName: formValues.userName!,
      imageUrl: profileImage!.url,
      imagePath: profileImage!.path,
      role: formValues.role!,
      description: formValues.description!,
      birthDate: formValues.birthDate!,
    };

    this.auth.register(newUser).subscribe((success) => {
      if (success) {
        this.toastify.showToast('Registrado con exito', 3000, 'success');

        if (!this.adminRegister()) {
          this.router.navigate(['/login']);
        }else{
          this.step.set(1);
        }
      } else {
        this.toastify.showToast('Ocurrio un error. Intente nuevamente', 3000, 'error');
      }

      if (this.formData.valid) {
        this.formData.reset();
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      this.imageUrl = '';
      this.imageName = '';
      return;
    }
    this.formImageData.get('image')?.setValue(file);

    this.imageName = file.name;

    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
    }

    this.imageUrl = URL.createObjectURL(file);
  }

  ngOnDestroy() {
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
    }
  }

  nextStep() {
    this.step.set(this.step() + 1);
  }

  previousStep() {
    this.step.set(this.step() - 1);
  }
}
