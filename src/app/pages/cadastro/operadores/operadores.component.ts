import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { OperadorService } from 'src/app/core/services/operador.service';
import { Operador } from 'src/app/core/models/operador.model';

@Component({
  selector: 'app-operadores',
  templateUrl: './operadores.component.html',
  styleUrls: ['./operadores.component.scss'],
})
export class OperadoresComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  carregando = true;
  submitted = false;

  termoBusca = '';
  operadores: Operador[] = [];
  todosOperadores: Operador[] = [];
  operadoresFiltrados: Operador[] = [];

  filtroAdmin: 'todos' | 'admin' | 'naoAdmin' = 'todos';
  filtroAtivo: 'todos' | 'ativo' | 'inativo' = 'todos';

  opcoesQuantidadePorPagina = [8, 15, 25, 50];

  operadorForm!: UntypedFormGroup;
  modoEdicao = false;
  tituloModal = 'Cadastrar Operador';
  textoBotaoSalvar = 'Criar';

  constructor(
    private modalService: NgbModal,
    public paginacao: PaginationService,
    private formBuilder: UntypedFormBuilder,
    private operadorService: OperadorService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Cadastro' }, { label: 'Operador', active: true }];

    this.operadorForm = this.formBuilder.group({
      operadorId: ['', [Validators.required]],
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: [''],
      seAdmin: [false],
      seAtivo: ['S', [Validators.required]],
      perfilId: [''],
      perfilSkin: [''],
    });

    this.carregarOperadores();
  }

  get form() {
    return this.operadorForm.controls;
  }

  get totalFiltrado(): number {
    return this.operadoresFiltrados.length;
  }

  get inicioRegistro(): number {
    if (!this.totalFiltrado) {
      return 0;
    }
    return (Number(this.paginacao.page) - 1) * Number(this.paginacao.pageSize) + 1;
  }

  get fimRegistro(): number {
    return Math.min(Number(this.paginacao.page) * Number(this.paginacao.pageSize), this.totalFiltrado);
  }

  get classeBotao(): string {
    return this.modoEdicao ? 'btn-info' : 'btn-success';
  }

  carregarOperadores() {
    this.carregando = true;
    this.operadorService.listarTodos().subscribe({
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
    this.operadores = this.paginacao.changePage(this.operadoresFiltrados);
  }

  buscar() {
    this.aplicarFiltros(true);
  }

  alterarQuantidadePorPagina(valor: string | number) {
    const quantidade = Number(valor);
    if (!Number.isFinite(quantidade) || quantidade <= 0) {
      return;
    }
    this.paginacao.pageSize = quantidade;
    this.aplicarFiltros(true);
  }

  limparFiltros() {
    this.filtroAdmin = 'todos';
    this.filtroAtivo = 'todos';
    this.aplicarFiltros(true);
  }

  onSort(coluna: string) {
    this.operadores = this.paginacao.onSort(coluna, this.operadores);
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
      this.paginacao.page = 1;
    }
    this.operadores = this.paginacao.changePage(this.operadoresFiltrados);
  }

  abrirModalCadastro(conteudo: any) {
    this.submitted = false;
    this.modoEdicao = false;
    this.tituloModal = 'Cadastrar Operador';
    this.textoBotaoSalvar = 'Criar';

    this.operadorForm.reset({
      operadorId: '',
      nome: '',
      email: '',
      senha: '',
      seAdmin: false,
      seAtivo: 'S',
      perfilId: '',
      perfilSkin: ''
    });

    this.operadorForm.get('operadorId')?.enable();
    this.modalService.open(conteudo, { size: 'lg', centered: true });
  }

  abrirModalEdicao(operador: Operador, conteudo: any) {
    this.submitted = false;
    this.modoEdicao = true;
    this.tituloModal = 'Editar Operador';
    this.textoBotaoSalvar = 'Atualizar';

    this.operadorForm.reset({
      operadorId: operador.operadorId,
      nome: operador.nome ?? '',
      email: operador.email ?? '',
      senha: operador.senha ?? '',
      seAdmin: operador.seAdmin ?? false,
      seAtivo: operador.seAtivo ?? 'S',
      perfilId: operador.perfilId ?? '',
      perfilSkin: operador.perfilSkin ?? ''
    });

    this.operadorForm.get('operadorId')?.disable();
    this.modalService.open(conteudo, { size: 'lg', centered: true });
  }

  salvar() {
    this.submitted = true;

    if (this.operadorForm.invalid) {
      return;
    }

    const valores = this.operadorForm.getRawValue();

    if (this.modoEdicao) {
      const payload = {
        operadorId: valores.operadorId,
        nome: valores.nome || null,
        senha: valores.senha || null,
        email: valores.email || null,
        seAdmin: valores.seAdmin ?? null,
        seAtivo: valores.seAtivo || null,
        perfilSkin: valores.perfilSkin || null,
        perfilId: valores.perfilId || null
      };

      this.operadorService.atualizar(payload).subscribe({
        next: () => {
          this.modalService.dismissAll();
          Swal.fire({
            title: 'Sucesso',
            text: 'Operador atualizado com sucesso.',
            icon: 'success',
            confirmButtonText: 'Ok',
          });
          this.carregarOperadores();
        },
        error: () => {
          Swal.fire({
            title: 'Erro',
            text: 'Não foi possível atualizar o operador.',
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        },
      });
      return;
    }

    const payload = {
      operadorId: valores.operadorId,
      nome: valores.nome || null,
      senha: valores.senha || null,
      email: valores.email || null,
      seAdmin: valores.seAdmin ?? null,
      seAtivo: valores.seAtivo || null,
      perfilSkin: valores.perfilSkin || null,
      perfilId: valores.perfilId || null
    };

    this.operadorService.criar(payload).subscribe({
      next: () => {
        this.modalService.dismissAll();
        Swal.fire({
          title: 'Sucesso',
          text: 'Operador criado com sucesso.',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
        this.carregarOperadores();
      },
      error: () => {
        Swal.fire({
          title: 'Erro',
          text: 'Não foi possível criar o operador.',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      },
    });
  }
}
