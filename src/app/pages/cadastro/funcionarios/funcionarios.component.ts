import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Funcionario } from 'src/app/core/models/funcionario.model';
import { Operador } from 'src/app/core/models/operador.model';
import { FuncionarioService } from 'src/app/core/services/funcionario.service';
import { OperadorService } from 'src/app/core/services/operador.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { FiltroAtivoType, FILTRO_ATIVO } from 'src/app/shared/types/filtros-status.type';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.scss'],
})
export class FuncionariosComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  carregando = true;
  carregandoOperadores = true;
  submitted = false;

  termoBusca = '';
  funcionarios: Funcionario[] = [];
  todosFuncionarios: Funcionario[] = [];
  funcionariosFiltrados: Funcionario[] = [];
  operadores: Operador[] = [];

  filtroAtivo: FiltroAtivoType = FILTRO_ATIVO.TODOS;

  opcoesQuantidadePorPagina = [8, 15, 25, 50];

  funcionarioForm!: FormGroup;
  modoEdicao = false;
  tituloModal = 'Cadastrar Funcionário';
  textoBotaoSalvar = 'Criar';

  constructor(
    private _modal: NgbModal,
    public _paginacao: PaginationService,
    private _fb: FormBuilder,
    private _funcionario: FuncionarioService,
    private _operador: OperadorService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Cadastro' }, { label: 'Funcionário', active: true }];

    this.funcionarioForm = this._fb.group({
      funcionarioId: ['', [Validators.required]],
      nome: ['', [Validators.required]],
      cpf: [''],
      ativo: ['S', [Validators.required]],
      operadorId: [''],
      endereco: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      complemento: [''],
      bairro: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      uf: ['', [Validators.required]],
      dataNascimento: [''],
      dataAdmissao: [''],
      funcaoId: [''],
    });

    this.carregarFuncionarios();
  }

  get form() {
    return this.funcionarioForm.controls;
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

  get classeBotao(): string {
    return this.modoEdicao ? 'btn-info' : 'btn-success';
  }

  carregarOperadores() {
    this.carregandoOperadores = true;
    this._operador.listarTodos().subscribe({
      next: (resposta) => {
        this.operadores = resposta?.data ?? [];
        this.carregandoOperadores = false;
      },
      error: () => {
        this.operadores = [];
        this.carregandoOperadores = false;
      },
    });
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
    this.filtroAtivo = 'todos';
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

  abrirModalCadastro(conteudo: any) {
    this.carregarOperadores();
    this.submitted = false;
    this.modoEdicao = false;
    this.tituloModal = 'Cadastrar Funcionário';
    this.textoBotaoSalvar = 'Criar';

    this.funcionarioForm.reset({
      funcionarioId: '',
      nome: '',
      cpf: '',
      ativo: 'S',
      operadorId: '',
      endereco: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      dataNascimento: '',
      dataAdmissao: '',
      funcaoId: '',
    });

    this.funcionarioForm.get('funcionarioId')?.enable();
    this._modal.open(conteudo, { size: 'lg', centered: true });
  }

  abrirModalEdicao(funcionario: Funcionario, conteudo: any) {
    this.carregarOperadores();
    this.submitted = false;
    this.modoEdicao = true;
    this.tituloModal = 'Editar Funcionário';
    this.textoBotaoSalvar = 'Atualizar';

    this.funcionarioForm.reset({
      funcionarioId: funcionario.funcionarioId,
      nome: funcionario.nome ?? '',
      cpf: funcionario.cpf ?? '',
      ativo: funcionario.ativo ?? 'S',
      operadorId: funcionario.operadorId ?? '',
      endereco: funcionario.endereco ?? '',
      numero: funcionario.numero ?? '',
      complemento: funcionario.complemento ?? '',
      bairro: funcionario.bairro ?? '',
      cidade: funcionario.cidade ?? '',
      uf: funcionario.uf ?? '',
      dataNascimento: this.normalizarDataParaInput(funcionario.dataNascimento),
      dataAdmissao: this.normalizarDataParaInput(funcionario.dataAdmissao),
      funcaoId: funcionario.funcaoId ?? '',
    });

    this.funcionarioForm.get('funcionarioId')?.disable();
    this._modal.open(conteudo, { size: 'lg', centered: true });
  }

  salvar() {
    this.submitted = true;

    if (this.funcionarioForm.invalid) {
      return;
    }

    const valores = this.funcionarioForm.getRawValue();

    const payload = {
      funcionarioId: Number(valores.funcionarioId),
      nome: valores.nome || null,
      endereco: valores.endereco || null,
      numero: valores.numero || null,
      complemento: valores.complemento || null,
      bairro: valores.bairro || null,
      cidade: valores.cidade || null,
      uf: valores.uf || null,
      dataNascimento: valores.dataNascimento || null,
      dataAdmissao: valores.dataAdmissao || null,
      funcaoId: this.normalizarNumeroOuNull(valores.funcaoId),
      cpf: valores.cpf || null,
      ativo: valores.ativo || null,
      operadorId: valores.operadorId || null,
    };

    if (this.modoEdicao) {
      this._funcionario.atualizar(payload).subscribe({
        next: () => {
          this._modal.dismissAll();
          Swal.fire({
            title: 'Sucesso',
            text: 'Funcionário atualizado com sucesso.',
            icon: 'success',
            confirmButtonText: 'Ok',
          });
          this.carregarFuncionarios();
        },
        error: () => {
          Swal.fire({
            title: 'Erro',
            text: 'Não foi possível atualizar o funcionário.',
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        },
      });
      return;
    }

    this._funcionario.criar(payload).subscribe({
      next: () => {
        this._modal.dismissAll();
        Swal.fire({
          title: 'Sucesso',
          text: 'Funcionário criado com sucesso.',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
        this.carregarFuncionarios();
      },
      error: () => {
        Swal.fire({
          title: 'Erro',
          text: 'Não foi possível criar o funcionário.',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      },
    });
  }

  private normalizarDataParaInput(valor: string | null): string {
    if (!valor) {
      return '';
    }
    if (typeof valor === 'string') {
      if (valor.includes('T') && valor.length >= 10) {
        return valor.substring(0, 10);
      }
      return valor.length >= 10 ? valor.substring(0, 10) : '';
    }
    return '';
  }

  private normalizarNumeroOuNull(valor: unknown): number | null {
    if (valor === null || valor === undefined || valor === '') {
      return null;
    }
    const numero = Number(valor);
    return Number.isFinite(numero) ? numero : null;
  }
}
