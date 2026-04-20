import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup<{
    login: FormControl<string>;
    senha: FormControl<string>;
  }>;
  submitted = false;
  mostrarSenha !: boolean;
  returnUrl!: string;
  toast = inject(ToastService);

  constructor(
    private _fb: FormBuilder,
    private _aut: AuthenticationService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    if (this._aut.usuarioAtual) {
      this._router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    if (sessionStorage.getItem('token')) {
      this._router.navigate(['/']);
    }

    this.loginForm = this._fb.nonNullable.group({
      login: ['', Validators.required],
      senha: ['', Validators.required],
    });
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
  }

  get form() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const login = this.form.login.value.trim();
    const senha = this.form.senha.value;

    this._aut.login(login, senha).subscribe({
      next: (dados) => {
        
        const tipo = String(dados?.tipo ?? '').trim().toLowerCase();
        const variosCliente = Boolean(dados?.variosCliente);
        const clienteIds = dados?.clienteIds ?? [];

        if (tipo === 'cliente' && variosCliente && clienteIds.length > 1) {
          this.toast.success('Login realizado com sucesso.', 'Sucesso');
          this._router.navigate(['/selecionar-cliente'], { queryParams: { returnUrl: this.returnUrl } });
          return;
        }

        this.toast.success('Login realizado com sucesso.', 'Sucesso');
        this._router.navigateByUrl(this.returnUrl);
      },
      error: (mensagem) => {
        this.toast.error(String(mensagem ?? 'Falha ao realizar login.'), 'Erro');
      },
    });
  }

   alternarVisibilidadeSenha() {
    this.mostrarSenha  = !this.mostrarSenha ;
  }
}
