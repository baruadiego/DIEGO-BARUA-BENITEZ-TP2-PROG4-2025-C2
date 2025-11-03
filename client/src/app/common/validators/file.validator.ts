import { AbstractControl, ValidationErrors } from '@angular/forms';

export function fileValidator(control: AbstractControl): ValidationErrors | null {
  const file = control.value;

  if (!file) return null;

  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  if (file && !allowedTypes.includes(file.type)) {
    return { invalidType: true };
  }

  const maxSizeMB = 2;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxSizeBytes) {
    return { tooLarge: true };
  }

  return null;
}
