import { Component, EventEmitter, inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Operador } from 'src/app/core/models/operador.model';
import { OperadorService } from 'src/app/core/services/operador.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-operador-modal',
  standalone: false,
  templateUrl: './operador-modal.component.html',
  styleUrls: ['./operador-modal.component.scss'],
})
export class OperadorModalComponent {
  @ViewChild('modalOperador', { static: true }) template!: TemplateRef<any>;
  toast = inject(ToastService);

  operadorForm!: FormGroup;
  submitted = false;
  modoEdicao = false;
  tituloModal = 'Cadastrar Operador';
  textoBotaoSalvar = 'Criar';

  private _modalRef: NgbModalRef | null = null;

  @Output() salvo = new EventEmitter<void>();

  constructor(
    private _modal: NgbModal,
    private _fb: FormBuilder,
    private _operador: OperadorService
  ) {
    this.operadorForm = this._fb.group({
      operadorId: ['', [Validators.required]],
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: [''],
      seAdmin: [false],
      seAtivo: ['S', [Validators.required]],
      perfilId: [''],
      perfilSkin: [''],
    });
  }

  get form() {
    return this.operadorForm.controls;
  }

  get classeBotao(): string {
    return this.modoEdicao ? 'btn-info' : 'btn-success';
  }

  abrirCadastro() {
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
    });

    this.operadorForm.get('operadorId')?.enable();
    this._modalRef = this._modal.open(this.template, { size: 'lg', centered: true });
  }

  abrirEdicao(operador: Operador) {
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
    });

    this.operadorForm.get('operadorId')?.disable();
    this._modalRef = this._modal.open(this.template, { size: 'lg', centered: true });
  }

  salvar() {
    this.submitted = true;

    if (this.operadorForm.invalid) {
      return;
    }

    const valores = this.operadorForm.getRawValue();

    const payload = {
      operadorId: valores.operadorId,
      nome: valores.nome || null,
      senha: valores.senha || null,
      email: valores.email || null,
      seAdmin: valores.seAdmin ?? null,
      seAtivo: valores.seAtivo || null,
      perfilId: valores.perfilId || null,
      perfilSkin: valores.perfilSkin || null,
    };

    if (this.modoEdicao) {
      this._operador.atualizar(payload).subscribe({
        next: () => {
          this._modalRef?.close();
          this.toast.success('Operador atualizado com sucesso.', 'Sucesso');
          this.salvo.emit();
        },
        error: () => {
          this.toast.error('Não foi possível atualizar o operador.', 'Erro');
        },
      });
      return;
    }

    this._operador.criar(payload).subscribe({
      next: () => {
        this._modalRef?.close();
        this.toast.success('Operador criado com sucesso.', 'Sucesso');
        this.salvo.emit();
      },
      error: () => {
        this.toast.error('Não foi possível criar o operador.', 'Erro');
      },
    });
  }
}
