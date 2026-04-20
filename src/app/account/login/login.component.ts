import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login Component
 */
export class LoginComponent implements OnInit {

  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  returnUrl!: string;

  toast = inject(ToastService);

  year: number = new Date().getFullYear();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private autenticacao: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    if (this.autenticacao.usuarioAtual) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    if (sessionStorage.getItem('token')) {
      this.router.navigate(['/']);
    }

    this.loginForm = this.formBuilder.group({
      login: ['', [Validators.required]],
      senha: ['', [Validators.required]],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const login = String(this.f['login'].value ?? '').trim();
    const senha = String(this.f['senha'].value ?? '');

    this.autenticacao.login(login, senha).subscribe({
      next: (dados) => {
        
        const tipo = String(dados?.tipo ?? '').trim().toLowerCase();
        const variosCliente = Boolean(dados?.variosCliente);
        const clienteIds = dados?.clienteIds ?? [];

        if (tipo === 'cliente' && variosCliente && clienteIds.length > 1) {
          this.toast.success('Login realizado com sucesso.', 'Sucesso');
          this.router.navigate(['/selecionar-cliente'], { queryParams: { returnUrl: this.returnUrl } });
          return;
        }

        this.toast.success('Login realizado com sucesso.', 'Sucesso');
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (mensagem) => {
        this.toast.error(String(mensagem ?? 'Falha ao realizar login.'), 'Erro');
      },
    });
  }

  /**
   * Password Hide/Show
   */
   toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
