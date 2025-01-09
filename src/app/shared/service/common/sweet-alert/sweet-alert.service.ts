import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }

  showAlert(title: string, text?: string, icon?: 'success' | 'error' | 'warning' | 'info') {
    return Swal.fire({
      title: title,
      text: text,
      icon: icon || 'info',
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel'
    });
  }
}
