import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ClienteGrupo } from 'src/app/core/models/cliente-grupo.model';
import { ClienteGrupoService } from 'src/app/core/services/cliente-grupo.service';

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
    private _clienteGrupo: ClienteGrupoService
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
        next: () => {
          this._modalRef?.close();
          Swal.fire({
            title: 'Sucesso',
            text: 'Grupo de cliente atualizado com sucesso.',
            icon: 'success',
            confirmButtonText: 'Ok',
          });
          this.salvo.emit();
        },
        error: () => {
          Swal.fire({
            title: 'Erro',
            text: 'Não foi possível atualizar o grupo de cliente.',
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        },
      });
      return;
    }

    this._clienteGrupo.criar(payload).subscribe({
      next: () => {
        this._modalRef?.close();
        Swal.fire({
          title: 'Sucesso',
          text: 'Grupo de cliente criado com sucesso.',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
        this.salvo.emit();
      },
      error: () => {
        Swal.fire({
          title: 'Erro',
          text: 'Não foi possível criar o grupo de cliente.',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      },
    });
  }
}
