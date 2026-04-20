import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/auth.service';

type ClienteSelecionavel = {
  clienteId: number;
  nome: string;
  cnpj?: string;
  qtdeChamadosAbertos?: number;
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
    private autenticacao: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    const usuario = this.autenticacao.usuarioAtual;
    const tipo = String(usuario?.tipo ?? '').trim().toLowerCase();
    const variosCliente = Boolean(usuario?.variosCliente);
    const clientes = usuario?.clientes ?? [];

    if (!usuario || tipo !== 'cliente') {
      this.router.navigateByUrl('/');
      return;
    }

    if (!variosCliente || clientes.length <= 1) {
      if (clientes.length === 1) {
        this.autenticacao.definirClienteSelecionadoId(clientes[0].clienteId);
      }
      this.router.navigateByUrl(this.returnUrl);
      return;
    }

    this.clientes = clientes
      .map((c) => ({
        clienteId: c.clienteId,
        nome: c.fantasia || `Cliente ${c.clienteId}`,
        cnpj: c.cnpj || undefined,
        qtdeChamadosAbertos: c.qtdeChamadosAbertos ?? 0,
      }))
      .sort((a, b) => a.nome.localeCompare(b.nome));
    this.clientesFiltrados = [...this.clientes];
    this.carregando = false;
  }

  selecionarCliente(clienteId: number) {
    this.autenticacao.definirClienteSelecionadoId(clienteId);
    this.router.navigateByUrl(this.returnUrl);
  }

  sair() {
    this.autenticacao.logout();
    this.router.navigate(['/auth/login']);
  }
}
