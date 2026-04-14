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
      dataUltimoAcesso: [''],
      usuarioInclusao: [''],
      usuarioAlteracao: [''],
    });

    this.carregarOperadores();
  }

  get form() {
    return this.operadorForm.controls;
  }

  carregarOperadores() {
    this.carregando = true;
    this.operadorService.listarTodos().subscribe({
      next: (resposta) => {
        this.todosOperadores = resposta?.data ?? [];
        this.paginacao.page = 1;
        this.operadores = this.paginacao.changePage(this.todosOperadores);
        this.carregando = false;
      },
      error: () => {
        this.todosOperadores = [];
        this.operadores = [];
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
    this.operadores = this.paginacao.changePage(this.todosOperadores);
  }

  buscar() {
    const termo = (this.termoBusca ?? '').trim().toLowerCase();
    if (!termo) {
      this.paginacao.page = 1;
      this.operadores = this.paginacao.changePage(this.todosOperadores);
      return;
    }

    const filtrado = this.todosOperadores.filter((o) => {
      return (
        (o.operadorId ?? '').toLowerCase().includes(termo) ||
        (o.nome ?? '').toLowerCase().includes(termo) ||
        (o.email ?? '').toLowerCase().includes(termo)
      );
    });
    this.paginacao.page = 1;
    this.operadores = this.paginacao.changePage(filtrado);
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
      perfilSkin: '',
      dataUltimoAcesso: '',
      usuarioInclusao: '',
      usuarioAlteracao: '',
    });

    this.operadorForm.get('operadorId')?.enable();
    this.operadorForm.get('usuarioInclusao')?.setValidators([Validators.required]);
    this.operadorForm.get('usuarioAlteracao')?.clearValidators();
    this.operadorForm.get('usuarioInclusao')?.updateValueAndValidity();
    this.operadorForm.get('usuarioAlteracao')?.updateValueAndValidity();

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
      perfilSkin: operador.perfilSkin ?? '',
      dataUltimoAcesso: operador.dataUltimoAcesso ?? '',
      usuarioInclusao: operador.usuarioInclusao ?? '',
      usuarioAlteracao: '',
    });

    this.operadorForm.get('operadorId')?.disable();
    this.operadorForm.get('usuarioAlteracao')?.setValidators([Validators.required]);
    this.operadorForm.get('usuarioInclusao')?.clearValidators();
    this.operadorForm.get('usuarioAlteracao')?.updateValueAndValidity();
    this.operadorForm.get('usuarioInclusao')?.updateValueAndValidity();

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
        dataUltimoAcesso: valores.dataUltimoAcesso || null,
        usuarioAlteracao: valores.usuarioAlteracao,
        perfilId: valores.perfilId || null,
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
      dataUltimoAcesso: valores.dataUltimoAcesso || null,
      usuarioInclusao: valores.usuarioInclusao,
      perfilId: valores.perfilId || null,
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

