import { Component, inject, signal } from '@angular/core';
import { UserService } from 'src/app/common/services/user-service';
import { User } from 'src/app/common/types/user';
import { Toggle } from "src/app/common/components/toggle/toggle";
import { ToastifyService } from 'src/app/common/services/toastify';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-users',
  imports: [Toggle, RouterLink],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  userService = inject(UserService);
  users = signal<User[]>([]);
  toast = inject(ToastifyService)

  constructor() {
    this.userService.getUsers().subscribe((res) => {
      if (res) {
        this.users.set(res);
      }
    })
  }

  toggleAction (id: string, disable: boolean) {
    if (disable) {
      this.disableUser(id);
    } else {
      this.enableUser(id);
    }
  }

  enableUser(id: string) {
    this.userService.enable(id).subscribe((res) => {
      if (res) {
        this.userService.getUsers().subscribe((res) => {
          if (res) {
            this.users.set(res);
            this.toast.showToast('Usuario habilitado con exito', 3000, 'success');
          }
          else{
            this.toast.showToast('Error al habilitar el usuario', 3000, 'error');
          }
        })
      }
    })
  }

  disableUser(id: string) {
    this.userService.disable(id).subscribe((res) => {
      if (res) {
        this.userService.getUsers().subscribe((res) => {
          if (res) {
            this.users.set(res);
            this.toast.showToast('Usuario deshabilitado con exito', 3000, 'success');
          }
          else{
            this.toast.showToast('Error al deshabilitar el usuario', 3000, 'error');
          }
        })
      }
    })
  }

  changeRole (id: string, event: Event) {
    const role = (event.target as HTMLSelectElement).value as 'admin' | 'user';

    this.userService.changeRole(id, role).subscribe((res) => {
      if (res) {
        this.toast.showToast('Rol cambiado con exito', 3000, 'success');
      }else{
        this.toast.showToast('Error al cambiar el rol', 3000, 'error');
      }
    })
  }
}
