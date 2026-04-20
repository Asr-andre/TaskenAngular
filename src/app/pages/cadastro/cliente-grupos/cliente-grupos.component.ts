import { Component, inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ClienteGrupo } from 'src/app/core/models/cliente-grupo.model';
import { ClienteGrupoService } from 'src/app/core/services/cliente-grupo.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-cliente-grupos',
  templateUrl: './cliente-grupos.component.html',
  styleUrls: ['./cliente-grupos.component.scss'],
})
export class ClienteGruposComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  toast = inject(ToastService);
  carregando = true;

  termoBusca = '';
  clienteGrupos: ClienteGrupo[] = [];
  todosClienteGrupos: ClienteGrupo[] = [];
  clienteGruposFiltrados: ClienteGrupo[] = [];

  opcoesQuantidadePorPagina = [8, 15, 25, 50];

  constructor(
    public _paginacao: PaginationService,
    private _clienteGrupo: ClienteGrupoService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Cadastro' }, { label: 'Cliente Grupo', active: true }];
    this.carregarClienteGrupos();
  }

  get totalFiltrado(): number {
    return this.clienteGruposFiltrados.length;
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

  carregarClienteGrupos() {
    this.carregando = true;
    this._clienteGrupo.listarTodos().subscribe({
      next: (resposta) => {
        if(resposta.success === true) {
            this.todosClienteGrupos = resposta?.data ?? [];
            this.aplicarFiltro(true);
            this.carregando = false;
            this.toast.success(resposta.mensagem , 'Sucesso');
        } else {
           this.toast.warning(resposta.mensagem, 'Atenção');
        } 
      },
      error: () => {
        this.carregando = false;
        this.toast.error('Não foi possível carregar os grupos de cliente', 'Error');
      },
    });
  }

  buscar() {
    this.aplicarFiltro(true);
  }

  aplicarFiltro(redefinirPagina: boolean) {
    let lista = [...this.todosClienteGrupos];

    const termo = (this.termoBusca ?? '').trim().toLowerCase();
    if (termo) {
      lista = lista.filter((g) => {
        return (
          String(g.grupoId ?? '').toLowerCase().includes(termo) ||
          (g.nome ?? '').toLowerCase().includes(termo) ||
          (g.usuarioAlteracao ?? '').toLowerCase().includes(termo)
        );
      });
    }

    this.clienteGruposFiltrados = lista;
    if (redefinirPagina) {
      this._paginacao.page = 1;
    }
    this.clienteGrupos = this._paginacao.changePage(this.clienteGruposFiltrados);
  }

  mudarPagina() {
    this.clienteGrupos = this._paginacao.changePage(this.clienteGruposFiltrados);
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
    this.clienteGrupos = this._paginacao.onSort(coluna, this.clienteGrupos);
  }
}
