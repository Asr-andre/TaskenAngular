import { Component, EventEmitter, inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Indicacao } from 'src/app/core/models/indicacao.model';
import { IndicacaoService } from 'src/app/core/services/indicacao.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-indicacao-modal',
  standalone: false,
  templateUrl: './indicacao-modal.component.html',
  styleUrls: ['./indicacao-modal.component.scss'],
})
export class IndicacaoModalComponent {
  @ViewChild('modalIndicacao', { static: true }) template!: TemplateRef<any>;
  toast = inject(ToastService);

  indicacaoForm!: FormGroup;
  submitted = false;
  modoEdicao = false;
  tituloModal = 'Cadastrar Indicação';
  textoBotaoSalvar = 'Criar';

  private _modalRef: NgbModalRef | null = null;

  @Output() salvo = new EventEmitter<void>();

  constructor(
    private _modal: NgbModal,
    private _fb: FormBuilder,
    private _indicacao: IndicacaoService
  ) {
    this.indicacaoForm = this._fb.group({
      indicacaoId: ['', [Validators.required]],
      nome: ['', [Validators.required]],
      responsavel: [''],
    });
  }

  get form() {
    return this.indicacaoForm.controls;
  }

  get classeBotao(): string {
    return this.modoEdicao ? 'btn-info' : 'btn-success';
  }

  abrirCadastro() {
    this.submitted = false;
    this.modoEdicao = false;
    this.tituloModal = 'Cadastrar Indicação';
    this.textoBotaoSalvar = 'Criar';

    this.indicacaoForm.reset({
      indicacaoId: '',
      nome: '',
      responsavel: '',
    });

    this.indicacaoForm.get('indicacaoId')?.enable();
    this._modalRef = this._modal.open(this.template, { size: 'lg', centered: true });
  }

  abrirEdicao(indicacao: Indicacao) {
    this.submitted = false;
    this.modoEdicao = true;
    this.tituloModal = 'Editar Indicação';
    this.textoBotaoSalvar = 'Atualizar';

    this.indicacaoForm.reset({
      indicacaoId: indicacao.indicacaoId,
      nome: indicacao.nome ?? '',
      responsavel: indicacao.responsavel ?? '',
    });

    this.indicacaoForm.get('indicacaoId')?.disable();
    this._modalRef = this._modal.open(this.template, { size: 'lg', centered: true });
  }

  salvar() {
    this.submitted = true;

    if (this.indicacaoForm.invalid) {
      return;
    }

    const valores = this.indicacaoForm.getRawValue();

    const payload = {
      indicacaoId: Number(valores.indicacaoId),
      nome: valores.nome || null,
      responsavel: valores.responsavel || null,
    };

    if (this.modoEdicao) {
      this._indicacao.atualizar(payload).subscribe({
        next: () => {
          this._modalRef?.close();
          this.toast.success('Indicação atualizada com sucesso.', 'Sucesso');
          this.salvo.emit();
        },
        error: () => {
          this.toast.error('Não foi possível atualizar a indicação.', 'Erro');
        },
      });
      return;
    }

    this._indicacao.criar(payload).subscribe({
      next: () => {
        this._modalRef?.close();
        this.toast.success('Indicação criada com sucesso.', 'Sucesso');
        this.salvo.emit();
      },
      error: () => {
        this.toast.error('Não foi possível criar a indicação.', 'Erro');
      },
    });
  }
}
