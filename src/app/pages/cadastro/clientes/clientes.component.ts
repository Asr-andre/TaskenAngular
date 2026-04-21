import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Cliente } from 'src/app/core/models/cliente.model';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { FiltroAtivoType, FILTRO_ATIVO } from 'src/app/shared/types/filtros-status.type';

@Component({
  selector: 'app-clientes',
  standalone: false,
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
})
export class ClientesComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  carregando = true;

  termoBusca = '';
  clientes: Cliente[] = [];
  todosClientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];

  filtroAtivo: FiltroAtivoType = FILTRO_ATIVO.ATIVO;

  opcoesQuantidadePorPagina = [8, 15, 25, 50];

  constructor(
    public _paginacao: PaginationService,
    private _cliente: ClienteService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Cadastro' }, { label: 'Cliente', active: true }];
    this.carregarClientes();
  }

  get totalFiltrado(): number {
    return this.clientesFiltrados.length;
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

  carregarClientes() {
    this.carregando = true;
    this._cliente.listarTodos().subscribe({
      next: (resposta) => {
        this.todosClientes = resposta?.data ?? [];
        this.aplicarFiltro(true);
        this.carregando = false;
      },
      error: () => {
        this.todosClientes = [];
        this.clientes = [];
        this.clientesFiltrados = [];
        this.carregando = false;
        Swal.fire({
          title: 'Erro',
          text: 'Não foi possível carregar os clientes.',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      },
    });
  }

  buscar() {
    this.aplicarFiltro(true);
  }

  limparFiltros() {
    this.filtroAtivo = FILTRO_ATIVO.ATIVO;
    this.aplicarFiltro(true);
  }

  aplicarFiltro(redefinirPagina: boolean) {
    let lista = [...this.todosClientes];

    if (this.filtroAtivo === FILTRO_ATIVO.ATIVO) {
      lista = lista.filter((c) => (c.ativo ?? 'S') === 'S');
    }
    if (this.filtroAtivo === FILTRO_ATIVO.INATIVO) {
      lista = lista.filter((c) => (c.ativo ?? 'S') !== 'S');
    }
    const termo = (this.termoBusca ?? '').trim().toLowerCase();
    if (termo) {
      lista = lista.filter((c) => {
        return (
          String(c.clienteId ?? '').toLowerCase().includes(termo) ||
          String(c.clienteId ?? '').toLowerCase().includes(termo) ||
          (c.razaoSocial ?? '').toLowerCase().includes(termo) ||
          (c.fantasia ?? '').toLowerCase().includes(termo) ||
          (c.cnpj ?? '').toLowerCase().includes(termo)
        );
      });
    }
    this.clientesFiltrados = lista;
    if (redefinirPagina) {
      this._paginacao.page = 1;
    }
    this.clientes = this._paginacao.changePage(this.clientesFiltrados);
  }

  mudarPagina() {
    this.clientes = this._paginacao.changePage(this.clientesFiltrados);
  }

  alterarQuantidadePorPagina(valor: string | number) {
    const quantidade = Number(valor);
    if (!Number.isFinite(quantidade) || quantidade <= 0) {
      return;
    }
    this._paginacao.pageSize = quantidade;
    this.aplicarFiltro(true);
  }

  onSort(coluna: string) {
    this.clientes = this._paginacao.onSort(coluna, this.clientes);
  }
}
