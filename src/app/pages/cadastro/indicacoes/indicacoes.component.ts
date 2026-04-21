import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Indicacao } from 'src/app/core/models/indicacao.model';
import { IndicacaoService } from 'src/app/core/services/indicacao.service';
import { PaginationService } from 'src/app/core/services/pagination.service';

@Component({
  selector: 'app-indicacoes',
  standalone: false,
  templateUrl: './indicacoes.component.html',
  styleUrls: ['./indicacoes.component.scss'],
})
export class IndicacoesComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  carregando = true;

  termoBusca = '';
  indicacoes: Indicacao[] = [];
  todasIndicacoes: Indicacao[] = [];
  indicacoesFiltradas: Indicacao[] = [];

  opcoesQuantidadePorPagina = [8, 15, 25, 50];

  constructor(
    public _paginacao: PaginationService,
    private _indicacao: IndicacaoService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Cadastro' }, { label: 'Indicação', active: true }];
    this.carregarIndicacoes();
  }

  get totalFiltrado(): number {
    return this.indicacoesFiltradas.length;
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

  carregarIndicacoes() {
    this.carregando = true;
    this._indicacao.listarTodos().subscribe({
      next: (resposta) => {
        this.todasIndicacoes = resposta?.data ?? [];
        this.aplicarFiltro(true);
        this.carregando = false;
      },
      error: () => {
        this.todasIndicacoes = [];
        this.indicacoes = [];
        this.indicacoesFiltradas = [];
        this.carregando = false;
        Swal.fire({
          title: 'Erro',
          text: 'Não foi possível carregar as indicações.',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      },
    });
  }

  buscar() {
    this.aplicarFiltro(true);
  }

  aplicarFiltro(redefinirPagina: boolean) {
    let lista = [...this.todasIndicacoes];

    const termo = (this.termoBusca ?? '').trim().toLowerCase();
    if (termo) {
      lista = lista.filter((i) => {
        return (
          String(i.indicacaoId ?? '').toLowerCase().includes(termo) ||
          (i.nome ?? '').toLowerCase().includes(termo) ||
          (i.responsavel ?? '').toLowerCase().includes(termo)
        );
      });
    }

    this.indicacoesFiltradas = lista;
    if (redefinirPagina) {
      this._paginacao.page = 1;
    }
    this.indicacoes = this._paginacao.changePage(this.indicacoesFiltradas);
  }

  mudarPagina() {
    this.indicacoes = this._paginacao.changePage(this.indicacoesFiltradas);
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
    this.indicacoes = this._paginacao.onSort(coluna, this.indicacoes);
  }
}
