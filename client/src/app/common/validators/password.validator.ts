import { AbstractControl, ValidationErrors } from "@angular/forms";

export function validatePassword(control: AbstractControl): ValidationErrors | null {
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