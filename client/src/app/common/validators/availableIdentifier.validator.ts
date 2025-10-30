import { inject } from "@angular/core";
import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { catchError, map, of } from "rxjs";
import { Auth } from "../services/auth";

export function availableIdentifierValidator(): AsyncValidatorFn {
  const auth = inject(Auth);
  
    return (control: AbstractControl) => {
      const value = control.value;
      if (!value) return of(null);

      return auth.usernameUsed(value).pipe(
        map((used: boolean) => (used ? { identifierTaken: true } : null)),
        catchError(() => of(null))
      );
    };
  }