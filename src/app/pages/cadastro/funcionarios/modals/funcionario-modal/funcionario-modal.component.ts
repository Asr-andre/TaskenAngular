import { Component, EventEmitter, inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Funcionario } from 'src/app/core/models/funcionario.model';
import { Operador } from 'src/app/core/models/operador.model';
import { FuncionarioService } from 'src/app/core/services/funcionario.service';
import { OperadorService } from 'src/app/core/services/operador.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-funcionario-modal',
  standalone: false,
  templateUrl: './funcionario-modal.component.html',
  styleUrls: ['./funcionario-modal.component.scss'],
})
export class FuncionarioModalComponent {
  @ViewChild('modalFuncionario', { static: true }) template!: TemplateRef<any>;
  toast = inject(ToastService);

  funcionarioForm!: FormGroup;
  operadores: Operador[] = [];
  carregandoOperadores = true;
  submitted = false;
  modoEdicao = false;
  tituloModal = 'Cadastrar Funcionário';
  textoBotaoSalvar = 'Criar';

  private _modalRef: NgbModalRef | null = null;

  @Output() salvo = new EventEmitter<void>();

  constructor(
    private _modal: NgbModal,
    private _fb: FormBuilder,
    private _funcionario: FuncionarioService,
    private _operador: OperadorService
  ) {
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
  }

  get form() {
    return this.funcionarioForm.controls;
  }

  get classeBotao(): string {
    return this.modoEdicao ? 'btn-info' : 'btn-success';
  }

  abrirCadastro() {
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
    this.carregarOperadores();
    this._modalRef = this._modal.open(this.template, { size: 'lg', centered: true });
  }

  abrirEdicao(funcionario: Funcionario) {
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
    this.carregarOperadores();
    this._modalRef = this._modal.open(this.template, { size: 'lg', centered: true });
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
          this._modalRef?.close();
          this.toast.success('Funcionário atualizado com sucesso.', 'Sucesso');
          this.salvo.emit();
        },
        error: () => {
          this.toast.error('Não foi possível atualizar o funcionário.', 'Erro');
        },
      });
      return;
    }

    this._funcionario.criar(payload).subscribe({
      next: () => {
        this._modalRef?.close();
        this.toast.success('Funcionário criado com sucesso.', 'Sucesso');
        this.salvo.emit();
      },
      error: () => {
        this.toast.error('Não foi possível criar o funcionário.', 'Erro');
      },
    });
  }

  private carregarOperadores() {
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
