import { AbstractControl, ValidationErrors } from '@angular/forms';

export function dateRangeValidator(minDate: Date, maxDate: Date) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const date = new Date(value);
    if (date < minDate || date > maxDate) {
      return { outOfRange: true };
    }
    return null;
  };
}
