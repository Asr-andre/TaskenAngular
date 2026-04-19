import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ClienteService } from '../../core/services/cliente.service';
import { AuthenticationService } from '../../core/services/auth.service';

type ClienteSelecionavel = {
  clienteId: number;
  nome: string;
  cnpj?: string;
};

@Component({
  selector: 'app-selecionar-cliente',
  templateUrl: './selecionar-cliente.component.html',
  styleUrls: ['./selecionar-cliente.component.scss'],
})
export class SelecionarClienteComponent implements OnInit {
  carregando = true;
  clientes: ClienteSelecionavel[] = [];
  clientesFiltrados: ClienteSelecionavel[] = [];
  termoBusca = '';
  private returnUrl = '/';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private autenticacao: AuthenticationService,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    const usuario = this.autenticacao.usuarioAtual;
    const tipo = String(usuario?.tipo ?? '').trim().toLowerCase();
    const variosCliente = Boolean(usuario?.variosCliente);
    const ids = usuario?.clienteIds ?? [];

    if (!usuario || tipo !== 'cliente') {
      this.router.navigateByUrl('/');
      return;
    }

    if (!variosCliente || ids.length <= 1) {
      if (ids.length === 1) {
        this.autenticacao.definirClienteSelecionadoId(ids[0]);
      }
      this.router.navigateByUrl(this.returnUrl);
      return;
    }

    this.carregarClientes(ids);
  }

  selecionarCliente(clienteId: number) {
    this.autenticacao.definirClienteSelecionadoId(clienteId);
    this.router.navigateByUrl(this.returnUrl);
  }

  sair() {
    this.autenticacao.logout();
    this.router.navigate(['/auth/login']);
  }

  private carregarClientes(ids: number[]) {
    this.carregando = true;

    forkJoin(ids.map((id) =>
        this.clienteService.obterPorId(id).pipe(
          map((r) => {
            const c = r?.data;
            return {
              clienteId: id,
              nome: c?.fantasia || c?.razaoSocial || `Cliente ${id}`,
              cnpj: c?.cnpj || undefined,
            } as ClienteSelecionavel;
          }),
          catchError(() =>
            of({
              clienteId: id,
              nome: `Cliente ${id}`,
            } as ClienteSelecionavel)
          )
        )
      )
    ).subscribe({
      next: (lista) => {
        this.clientes = lista.sort((a, b) => a.nome.localeCompare(b.nome));
        this.clientesFiltrados = [...this.clientes];
        this.carregando = false;
      },
      error: () => {
        this.clientes = ids.map((id) => ({ clienteId: id, nome: `Cliente ${id}` }));
        this.clientesFiltrados = [...this.clientes];
        this.carregando = false;
        Swal.fire({
          title: 'Atenção',
          text: 'Não foi possível carregar os dados dos clientes. Selecione um cliente para continuar.',
          icon: 'warning',
          confirmButtonText: 'Ok',
        });
      },
    });
  }
}
