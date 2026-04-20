import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private toastr: ToastrService) {}

  success(msg: string, title = 'Sucesso') {
  this.toastr.success(msg, title);
}

  warning(msg: string, title = 'Atenção') {
    this.toastr.warning(msg, title);
  }

  info(msg: string, title = 'Informação') {
    this.toastr.info(msg, title);
  }

  error(msg: string, title = 'Erro') {
    this.toastr.error(msg, title);
  }
}

