import { Injectable } from '@angular/core';
import Toastify from 'toastify-js';

@Injectable({
  providedIn: 'root',
})
export class ToastifyService {
  showToast(message: string, duration: number, context: 'error' | 'success' = 'success') {
    const color =
      context === 'error'
        ? 'linear-gradient(135deg, #e74c3c, #86281e)'
        : 'linear-gradient(135deg, #2ecc71, #1a723f)';

    Toastify({
      text: message,
      duration: duration,
      close: true,
      gravity: 'top',
      position: 'right',
      stopOnFocus: true,
      style: {
        background: color,
        color: '#fff',
        fontWeight: '600',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        padding: '14px 18px',
        fontSize: '15px',
      },
    }).showToast();
  }
}
