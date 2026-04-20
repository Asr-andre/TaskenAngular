import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Chamado } from 'src/app/core/models/chamado.model';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ChamadoService } from 'src/app/core/services/chamado.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { ToastService } from 'src/app/core/services/toast.service';

type FiltroChamadoStatus = 'ativo' | 'fechado';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  carregando = true;

  termoBusca = '';
  chamados: Chamado[] = [];
  todosChamados: Chamado[] = [];
  chamadosFiltrados: Chamado[] = [];

  filtroStatus: FiltroChamadoStatus = 'ativo';

  opcoesQuantidadePorPagina = [8, 15, 25, 50];
  toast = inject(ToastService);

  constructor(
    public _paginacao: PaginationService,
    private _chamado: ChamadoService,
    private _autenticacao: AuthenticationService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Tickets' }, { label: 'Geral', active: true }];
    this.carregarChamados();
  }

  get totalFiltrado(): number {
    return this.chamadosFiltrados.length;
  }

  get inicioRegistro(): number {
    if (!this.totalFiltrado) {
      return 0;
    }
    return (Number(this._paginacao.page) - 1) * Number(this._paginacao.pageSize) + 1;
  }

  get fimRegistro(): number {
    return Math.min(Number(this._paginacao.page) * Number(this._paginacao.pageSize), this.totalFiltrado);
  }

  carregarChamados() {
    this.carregando = true;

    const usuario = this._autenticacao.usuarioAtual;
    const tipo = String(usuario?.tipo ?? '').trim().toLowerCase();
    const clienteId = tipo === 'cliente' ? Number(this._autenticacao.obterClienteSelecionadoId() ?? 0) : 0;
    const status = this.filtroStatus === 'fechado' ? 'F' : null;

    this._chamado.listar(clienteId, status).subscribe({
      next: (resposta) => {
        if (resposta.success === true) {
          this.todosChamados = resposta?.data ?? [];
          this.aplicarFiltro(true);
          this.carregando = false;
        } else {
          this.aplicarFiltro(true);
          this.carregando = false;
          this.toast.warning(String(resposta.mensagem), 'Atenção');
        }
      },
      error: () => {
        this.aplicarFiltro(true);
        this.toast.error('Não foi possível carregar os chamados.', 'Erro');
      },
    });
  }

  buscar() {
    this.aplicarFiltro(true);
  }

  limparFiltros() {
    this.filtroStatus = 'ativo';
    this.aplicarFiltro(true);
    this.carregarChamados();
  }

  aplicarFiltro(redefinirPagina: boolean) {
    let lista = [...this.todosChamados];

    const termo = (this.termoBusca ?? '').trim().toLowerCase();
    if (termo) {
      lista = lista.filter((c) => {
        return (
          String(c.chamadoId ?? '').toLowerCase().includes(termo) ||
          (c.titulo ?? '').toLowerCase().includes(termo) ||
          (c.fantasia ?? '').toLowerCase().includes(termo) ||
          (c.responsavel ?? '').toLowerCase().includes(termo) ||
          (c.usuarioEmailId ?? '').toLowerCase().includes(termo) ||
          (c.status ?? '').toLowerCase().includes(termo)
        );
      });
    }

    this.chamadosFiltrados = lista;
    if (redefinirPagina) {
      this._paginacao.page = 1;
    }
    this.chamados = this._paginacao.changePage(this.chamadosFiltrados);
  }

  mudarPagina() {
    this.chamados = this._paginacao.changePage(this.chamadosFiltrados);
  }

  alterarQuantidadePorPagina(valor: string | number) {
    const quantidade = Number(valor);
    if (!Number.isFinite(quantidade) || quantidade <= 0) {
      return;
    }
    this._paginacao.pageSize = quantidade;
    this.aplicarFiltro(true);
  }

  abrirDetalhes(chamado: Chamado) {
    this._router.navigate(['/tickets/details', chamado.chamadoId], {
      state: { chamado },
    });
  }
}
