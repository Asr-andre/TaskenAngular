import { Component, EventEmitter, inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClienteGrupo } from 'src/app/core/models/cliente-grupo.model';
import { ClienteGrupoService } from 'src/app/core/services/cliente-grupo.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-cliente-grupo-modal',
  standalone: false,
  templateUrl: './cliente-grupo-modal.component.html',
  styleUrls: ['./cliente-grupo-modal.component.scss'],
})
export class ClienteGrupoModalComponent {
  @ViewChild('modalClienteGrupo', { static: true }) template!: TemplateRef<any>;
  
  clienteGrupoForm!: FormGroup;
  submitted = false;
  modoEdicao = false;
  tituloModal = 'Cadastrar Grupo de Cliente';
  textoBotaoSalvar = 'Criar';

  private _modalRef: NgbModalRef | null = null;

  @Output() salvo = new EventEmitter<void>();

  constructor(
    private _modal: NgbModal,
    private _fb: FormBuilder,
    private _clienteGrupo: ClienteGrupoService,
    private _toast: ToastService,
  ) {
    this.clienteGrupoForm = this._fb.group({
      grupoId: ['', [Validators.required]],
      nome: ['', [Validators.required]],
      usuarioAlteracao: ['', [Validators.required]],
    });
  }

  get form() {
    return this.clienteGrupoForm.controls;
  }

  get classeBotao(): string {
    return this.modoEdicao ? 'btn-info' : 'btn-success';
  }

  abrirCadastro() {
    this.submitted = false;
    this.modoEdicao = false;
    this.tituloModal = 'Cadastrar Grupo de Cliente';
    this.textoBotaoSalvar = 'Criar';

    this.clienteGrupoForm.reset({
      grupoId: '',
      nome: '',
      usuarioAlteracao: '',
    });

    this.clienteGrupoForm.get('grupoId')?.enable();
    this._modalRef = this._modal.open(this.template, { size: 'lg', centered: true });
  }

  abrirEdicao(clienteGrupo: ClienteGrupo) {
    this.submitted = false;
    this.modoEdicao = true;
    this.tituloModal = 'Editar Grupo de Cliente';
    this.textoBotaoSalvar = 'Atualizar';

    this.clienteGrupoForm.reset({
      grupoId: clienteGrupo.grupoId,
      nome: clienteGrupo.nome ?? '',
      usuarioAlteracao: clienteGrupo.usuarioAlteracao ?? '',
    });

    this.clienteGrupoForm.get('grupoId')?.disable();
    this._modalRef = this._modal.open(this.template, { size: 'lg', centered: true });
  }

  salvar() {
    this.submitted = true;

    if (this.clienteGrupoForm.invalid) {
      return;
    }

    const valores = this.clienteGrupoForm.getRawValue();

    const payload = {
      grupoId: Number(valores.grupoId),
      nome: valores.nome || null,
      usuarioAlteracao: valores.usuarioAlteracao || null,
    };

    if (this.modoEdicao) {
      this._clienteGrupo.atualizar(payload).subscribe({
        next: (res) => {
          if (res.success === true) {
            this._modalRef?.close();
            this._toast.success(res.mensagem, 'Sucesso');
            this.salvo.emit();    
          } else {
            this._toast.warning(res.mensagem, 'Atenção');
          }
        },
        error: () => {
          this._toast.error('Não foi possível atualizar o grupo de cliente.', 'Erro');
        },
      });
      return;
    }

    this._clienteGrupo.criar(payload).subscribe({
      next: (res) => {
        if (res.success === true) {
          this._modalRef?.close();
          this._toast.success(res.mensagem, 'Sucesso');
          this.salvo.emit();    
        } else {
          this._toast.warning(res.mensagem, 'Atenção');
        }
      },
      error: () => {
        this._toast.error('Não foi possível criar o grupo de cliente.', 'Erro');
      },
    });
  }
}
