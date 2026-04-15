import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { OperadorService } from 'src/app/core/services/operador.service';
import { Operador } from 'src/app/core/models/operador.model';
import { FiltroAtivoType, FILTRO_ATIVO } from 'src/app/shared/types/filtros-status.type';

@Component({
  selector: 'app-operadores',
  templateUrl: './operadores.component.html',
  styleUrls: ['./operadores.component.scss'],
})
export class OperadoresComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  carregando = true;

  termoBusca = '';
  operadores: Operador[] = [];
  todosOperadores: Operador[] = [];
  operadoresFiltrados: Operador[] = [];

  filtroAdmin: 'todos' | 'admin' | 'naoAdmin' = 'todos';
  filtroAtivo: FiltroAtivoType = FILTRO_ATIVO.TODOS;

  opcoesQuantidadePorPagina = [8, 15, 25, 50];

  constructor(
    public _paginacao: PaginationService,
    private _operador: OperadorService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Cadastro' }, { label: 'Operador', active: true }];

    this.carregarOperadores();
  }

  get totalFiltrado(): number {
    return this.operadoresFiltrados.length;
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

  carregarOperadores() {
    this.carregando = true;
    this._operador.listarTodos().subscribe({
      next: (resposta) => {
        this.todosOperadores = resposta?.data ?? [];
        this.aplicarFiltros(true);
        this.carregando = false;
      },
      error: () => {
        this.todosOperadores = [];
        this.operadores = [];
        this.operadoresFiltrados = [];
        this.carregando = false;
        Swal.fire({
          title: 'Erro',
          text: 'Não foi possível carregar os operadores.',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      },
    });
  }

  mudarPagina() {
    this.operadores = this._paginacao.changePage(this.operadoresFiltrados);
  }

  buscar() {
    this.aplicarFiltros(true);
  }

  alterarQuantidadePorPagina(valor: string | number) {
    const quantidade = Number(valor);
    if (!Number.isFinite(quantidade) || quantidade <= 0) {
      return;
    }
    this._paginacao.pageSize = quantidade;
    this.aplicarFiltros(true);
  }

  limparFiltros() {
    this.filtroAdmin = 'todos';
    this.filtroAtivo = FILTRO_ATIVO.TODOS;
    this.aplicarFiltros(true);
  }

  onSort(coluna: string) {
    this.operadores = this._paginacao.onSort(coluna, this.operadores);
  }

  aplicarFiltros(redefinirPagina: boolean) {
    let lista = [...this.todosOperadores];

    if (this.filtroAdmin === 'admin') {
      lista = lista.filter((o) => o.seAdmin === true);
    } else if (this.filtroAdmin === 'naoAdmin') {
      lista = lista.filter((o) => o.seAdmin !== true);
    }

    if (this.filtroAtivo === 'ativo') {
      lista = lista.filter((o) => (o.seAtivo ?? 'S') === 'S');
    } else if (this.filtroAtivo === 'inativo') {
      lista = lista.filter((o) => (o.seAtivo ?? 'S') !== 'S');
    }

    const termo = (this.termoBusca ?? '').trim().toLowerCase();
    if (termo) {
      lista = lista.filter((o) => {
        return (
          (o.operadorId ?? '').toLowerCase().includes(termo) ||
          (o.nome ?? '').toLowerCase().includes(termo) ||
          (o.email ?? '').toLowerCase().includes(termo)
        );
      });
    }

    this.operadoresFiltrados = lista;
    if (redefinirPagina) {
      this._paginacao.page = 1;
    }
    this.operadores = this._paginacao.changePage(this.operadoresFiltrados);
  }

}
