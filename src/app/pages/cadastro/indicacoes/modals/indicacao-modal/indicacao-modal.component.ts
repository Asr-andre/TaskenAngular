import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Indicacao } from 'src/app/core/models/indicacao.model';
import { IndicacaoService } from 'src/app/core/services/indicacao.service';

@Component({
  selector: 'app-indicacao-modal',
  templateUrl: './indicacao-modal.component.html',
  styleUrls: ['./indicacao-modal.component.scss'],
})
export class IndicacaoModalComponent {
  @ViewChild('modalIndicacao', { static: true }) template!: TemplateRef<any>;

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
          Swal.fire({
            title: 'Sucesso',
            text: 'Indicação atualizada com sucesso.',
            icon: 'success',
            confirmButtonText: 'Ok',
          });
          this.salvo.emit();
        },
        error: () => {
          Swal.fire({
            title: 'Erro',
            text: 'Não foi possível atualizar a indicação.',
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        },
      });
      return;
    }

    this._indicacao.criar(payload).subscribe({
      next: () => {
        this._modalRef?.close();
        Swal.fire({
          title: 'Sucesso',
          text: 'Indicação criada com sucesso.',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
        this.salvo.emit();
      },
      error: () => {
        Swal.fire({
          title: 'Erro',
          text: 'Não foi possível criar a indicação.',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      },
    });
  }
}
