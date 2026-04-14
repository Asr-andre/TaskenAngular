import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { Operador } from '../../../core/models/operador.model';
import { OperadorService } from '../../../core/services/operador.service';
import { AlertaService } from 'src/app/core/services/alerta.service';

@Component({
  selector: 'app-operador',
  standalone: false,
  templateUrl: './operador.component.html',
  styleUrls: ['./operador.component.scss']
})
export class OperadorComponent implements OnInit {
  itensBreadcrumb!: Array<{}>;
  submetido = false;
  formularioOperador!: FormGroup;
  operadoresPagina: Operador[] = [];
  todosOperadores: Operador[] = [];
  termoBusca: string = '';
  pagina: number = 1;
  tamanhoPagina: number = 10;
  totalRegistros: number = 0;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private operadorService: OperadorService,
    private _alert:  AlertaService
  ) { }

  ngOnInit(): void {
    this.itensBreadcrumb = [
      { label: 'Cadastros' },
      { label: 'Operador', active: true }
    ];

    this.formularioOperador = this.formBuilder.group({
      funcionarioId: [''],
      operadorId: ['', [Validators.required]],
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: [''],
      seAdmin: [false],
      ativo: ['S']
    });

    this.carregarDados();
  }

  carregarDados() {
    this.operadorService.listarTodos().subscribe({
      next: (res) => {
        if (res && res.success == true) {
          const data = res.data;
          this.todosOperadores = data;
          this.totalRegistros = this.todosOperadores.length;
          this.atualizarLista();
          this._alert.exibir('success', res.mensagem, 'Testo 2', 3000)
        } else {
          this._alert.exibir('warning', res.mensagem, 'texto', 3000)
        }
      },
      error: (err) => console.error(err)
    });
  }

  atualizarLista() {
    let resultado = this.todosOperadores;
    
    if (this.termoBusca) {
      const termo = this.termoBusca.toLowerCase();
      resultado = resultado.filter(o => 
        (o.nome?.toLowerCase().includes(termo)) || 
        (o.email?.toLowerCase().includes(termo)) ||
        (o.operadorId?.toLowerCase().includes(termo))
      );
    }
    
    this.totalRegistros = resultado.length;
    this.operadoresPagina = resultado.slice(
      (this.pagina - 1) * this.tamanhoPagina,
      (this.pagina - 1) * this.tamanhoPagina + this.tamanhoPagina
    );
  }

  mudarPagina() {
    this.atualizarLista();
  }

  pesquisar() {
    this.pagina = 1;
    this.atualizarLista();
  }

  /**
   * Open modal
   * @param content modal content
   */
  abrirModal(content: any) {
    this.submetido = false;
    this.formularioOperador.reset();
    this.formularioOperador.patchValue({ ativo: 'S', seAdmin: false });
    this.modalService.open(content, { size: 'md', centered: true });
    
    setTimeout(() => {
      const modelTitle = document.querySelector('.modal-title');
      if (modelTitle) modelTitle.innerHTML = 'Adicionar Operador';
      const updateBtn = document.getElementById('add-btn');
      if (updateBtn) updateBtn.innerHTML = "Salvar";
    }, 0);
  }

  /**
  * Form data get
  */
  get controlesFormulario() {
    return this.formularioOperador.controls;
  }

  /**
  * Save / Update user
  */
  salvar() {
    this.submetido = true;
    if (this.formularioOperador.valid) {
      const dadosFormulario = this.formularioOperador.value;
      const ehEdicao = !!dadosFormulario.funcionarioId;
      
      const requisicao = ehEdicao ? this.operadorService.atualizar(dadosFormulario) : this.operadorService.criar(dadosFormulario);
      
      requisicao.subscribe({
        next: (res) => {
          if (res.success || res.codigo === 200) {
            Swal.fire({
              title: ehEdicao ? 'Operador atualizado!' : 'Operador cadastrado!',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            this.modalService.dismissAll();
            this.carregarDados();
          } else {
            Swal.fire('Erro', res.mensagem || 'Erro ao salvar', 'error');
          }
        },
        error: (err) => {
          Swal.fire('Erro', 'Erro ao comunicar com a API', 'error');
        }
      });
    }
  }

  /**
   * Open Edit modal
   * @param content modal content
   */
  editar(id: number | string, content: any) {
    this.submetido = false;
    this.modalService.open(content, { size: 'md', centered: true });
    
    // Find the item
    const item = this.todosOperadores.find(o => o.funcionarioId === id || o.operadorId === id);
    if (item) {
      this.formularioOperador.patchValue(item);
    }
    
    setTimeout(() => {
      const modelTitle = document.querySelector('.modal-title');
      if (modelTitle) modelTitle.innerHTML = 'Editar Operador';
      const updateBtn = document.getElementById('add-btn');
      if (updateBtn) updateBtn.innerHTML = "Atualizar";
    }, 0);
  }

  /**
   * Confirm Delete
   */
  confirmarExcluir(id: number | string) {
    Swal.fire({
      title: 'Tem certeza?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f46a6a',
      cancelButtonColor: '#34c38f',
      confirmButtonText: 'Sim, deletar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.operadorService.deletar(id).subscribe({
          next: (res) => {
            Swal.fire('Deletado!', 'O operador foi excluído.', 'success');
            this.carregarDados();
          },
          error: (err) => {
            Swal.fire('Erro!', 'Ocorreu um erro ao excluir.', 'error');
          }
        });
      }
    });
  }

}
