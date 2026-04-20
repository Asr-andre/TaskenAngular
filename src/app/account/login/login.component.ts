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
  carregando = false;
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

    if (this.carregando) {
      return;
    }
    this.carregando = true;

    const login = this.form.login.value.trim();
    const senha = this.form.senha.value;

    this._aut.login(login, senha).subscribe({
      next: (resposta) => {
        if (!resposta?.success) {
          this.toast.warning(String(resposta?.mensagem ?? 'Não foi possível autenticar.'), 'Atenção');
          this.carregando = false;
          return;
        }

        const dados = resposta.data;
        if (!dados?.token) {
          this.toast.warning(String(resposta?.mensagem ?? 'Não foi possível autenticar.'), 'Atenção');
          this.carregando = false;
          return;
        }

        this._aut.aplicarLogin(dados);
        const mensagem = String(resposta?.mensagem ?? 'Login realizado com sucesso.');
        
        const tipo = String(dados?.tipo ?? '').trim().toLowerCase();
        const variosCliente = Boolean(dados?.variosCliente);
        const clientes = dados?.clientes ?? [];

        if (tipo === 'cliente' && variosCliente && clientes.length > 1) {
          this.toast.success(mensagem, 'Sucesso');
          this._router.navigate(['/selecionar-cliente'], { queryParams: { returnUrl: this.returnUrl } });
          this.carregando = false;
          return;
        }

        this.toast.success(mensagem, 'Sucesso');
        this._router.navigateByUrl(this.returnUrl);
        this.carregando = false;
      },
      error: (mensagem) => {
        this.toast.error(String(mensagem ?? 'Falha ao realizar login.'), 'Erro');
        this.carregando = false;
      },
    });
  }

   alternarVisibilidadeSenha() {
    this.mostrarSenha  = !this.mostrarSenha ;
  }
}
