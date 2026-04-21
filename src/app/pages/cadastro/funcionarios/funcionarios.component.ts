import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Funcionario } from 'src/app/core/models/funcionario.model';
import { FuncionarioService } from 'src/app/core/services/funcionario.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { FiltroAtivoType, FILTRO_ATIVO } from 'src/app/shared/types/filtros-status.type';

@Component({
  selector: 'app-funcionarios',
  standalone: false,
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.scss'],
})
export class FuncionariosComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  carregando = true;

  termoBusca = '';
  funcionarios: Funcionario[] = [];
  todosFuncionarios: Funcionario[] = [];
  funcionariosFiltrados: Funcionario[] = [];

  filtroAtivo: FiltroAtivoType = FILTRO_ATIVO.TODOS;

  opcoesQuantidadePorPagina = [8, 15, 25, 50];

  constructor(
    public _paginacao: PaginationService,
    private _funcionario: FuncionarioService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Cadastro' }, { label: 'Funcionário', active: true }];

    this.carregarFuncionarios();
  }

  get totalFiltrado(): number {
    return this.funcionariosFiltrados.length;
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

  carregarFuncionarios() {
    this.carregando = true;
    this._funcionario.listarTodos().subscribe({
      next: (resposta) => {
        this.todosFuncionarios = resposta?.data ?? [];
        this.aplicarFiltros(true);
        this.carregando = false;
      },
      error: () => {
        this.todosFuncionarios = [];
        this.funcionarios = [];
        this.funcionariosFiltrados = [];
        this.carregando = false;
        Swal.fire({
          title: 'Erro',
          text: 'Não foi possível carregar os funcionários.',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      },
    });
  }

  mudarPagina() {
    this.funcionarios = this._paginacao.changePage(this.funcionariosFiltrados);
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
    this.filtroAtivo = FILTRO_ATIVO.TODOS;
    this.aplicarFiltros(true);
  }

  onSort(coluna: string) {
    this.funcionarios = this._paginacao.onSort(coluna, this.funcionarios);
  }

  aplicarFiltros(redefinirPagina: boolean) {
    let lista = [...this.todosFuncionarios];

    if (this.filtroAtivo === 'ativo') {
      lista = lista.filter((f) => (f.ativo ?? 'S') === 'S');
    } else if (this.filtroAtivo === 'inativo') {
      lista = lista.filter((f) => (f.ativo ?? 'S') !== 'S');
    }

    const termo = (this.termoBusca ?? '').trim().toLowerCase();
    if (termo) {
      lista = lista.filter((f) => {
        return (
          String(f.funcionarioId ?? '').toLowerCase().includes(termo) ||
          (f.nome ?? '').toLowerCase().includes(termo) ||
          (f.cpf ?? '').toLowerCase().includes(termo) ||
          (f.operadorId ?? '').toLowerCase().includes(termo)
        );
      });
    }

    this.funcionariosFiltrados = lista;
    if (redefinirPagina) {
      this._paginacao.page = 1;
    }
    this.funcionarios = this._paginacao.changePage(this.funcionariosFiltrados);
  }
}
