import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ClienteContato } from 'src/app/core/models/cliente-contato.model';
import { ClienteGrupo } from 'src/app/core/models/cliente-grupo.model';
import { Cliente } from 'src/app/core/models/cliente.model';
import { Indicacao } from 'src/app/core/models/indicacao.model';
import { ClienteContatoService } from 'src/app/core/services/cliente-contato.service';
import { ClienteGrupoService } from 'src/app/core/services/cliente-grupo.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { IndicacaoService } from 'src/app/core/services/indicacao.service';

type ContatoUi = ClienteContato & { _novo?: boolean; _editado?: boolean };

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss'],
})
export class ClienteFormComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  carregando = true;
  salvando = false;

  clienteForm!: FormGroup;
  contatoForm!: FormGroup;
  submitted = false;
  submittedContato = false;

  modoEdicao = false;
  clienteIdEdicao: number | null = null;
  tituloPagina = 'Cadastrar Cliente';
  textoBotaoSalvar = 'Criar Cliente';

  indicacoes: Indicacao[] = [];
  clienteGrupos: ClienteGrupo[] = [];
  contatos: ContatoUi[] = [];
  indiceContatoEditando: number | null = null;

  constructor(
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _cliente: ClienteService,
    private _clienteContato: ClienteContatoService,
    private _indicacao: IndicacaoService,
    private _clienteGrupo: ClienteGrupoService
  ) {}

  ngOnInit(): void {
    this.modoEdicao = !!this._route.snapshot.paramMap.get('id');
    this.clienteIdEdicao = this.modoEdicao ? Number(this._route.snapshot.paramMap.get('id')) : null;
    this.tituloPagina = this.modoEdicao ? 'Editar Cliente' : 'Cadastrar Cliente';
    this.textoBotaoSalvar = this.modoEdicao ? 'Atualizar Cliente' : 'Criar Cliente';
    this.breadCrumbItems = [{ label: 'Cadastro' }, { label: 'Cliente', active: true }];

    this.iniciarForms();
    this.carregarCombos();
    if (this.modoEdicao && this.clienteIdEdicao) {
      this.carregarCliente(this.clienteIdEdicao);
      this.carregarContatos(this.clienteIdEdicao);
    } else {
      this.carregando = false;
    }
  }

  get classeBotao(): string {
    return this.modoEdicao ? 'btn-info' : 'btn-success';
  }

  get form() {
    return this.clienteForm.controls;
  }

  get formContato() {
    return this.contatoForm.controls;
  }

  private iniciarForms() {
    this.clienteForm = this._fb.group({
      clienteId: ['', [Validators.required]],
      cnpj: ['', [Validators.required]],
      razaoSocial: ['', [Validators.required]],
      fantasia: ['', [Validators.required]],
      endereco: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      complemento: [''],
      cidade: ['', [Validators.required]],
      uf: ['', [Validators.required]],
      bairro: ['', [Validators.required]],
      usuario: ['', [Validators.required]],
      grupoId: [''],
      cep: [''],
      ativo: ['S', [Validators.required]],
      inscricao: [''],
      score: [''],
      indicacaoId: [''],
      sla: [''],
    });

    this.contatoForm = this._fb.group({
      contatoId: ['', [Validators.required]],
      nome: ['', [Validators.required]],
      funcao: ['', [Validators.required]],
      dataNasc: [''],
      fone: [''],
      fone2: [''],
      email: [''],
      senha: [''],
      qtdeAcesso: [''],
      ativo: ['S'],
      seRecebeEmailVersao: ['N'],
      seCriaChamado: ['N'],
      seAutorizaOrcamento: ['N'],
      seRecebeEmailChamado: ['N'],
      dataUltimoAcesso: [''],
      aniversario: [''],
    });
  }

  private carregarCombos() {
    this._indicacao.listarTodos().subscribe({
      next: (resposta) => (this.indicacoes = resposta?.data ?? []),
      error: () => (this.indicacoes = []),
    });

    this._clienteGrupo.listarTodos().subscribe({
      next: (resposta) => (this.clienteGrupos = resposta?.data ?? []),
      error: () => (this.clienteGrupos = []),
    });
  }

  private carregarCliente(id: number) {
    this._cliente.obterPorId(id).subscribe({
      next: (resposta) => {
        const c = resposta?.data as Cliente;
        this.clienteForm.patchValue({
          clienteId: c.clienteId,
          cnpj: c.cnpj ?? '',
          razaoSocial: c.razaoSocial ?? '',
          fantasia: c.fantasia ?? '',
          endereco: c.endereco ?? '',
          numero: c.numero ?? '',
          complemento: c.complemento ?? '',
          cidade: c.cidade ?? '',
          uf: c.uf ?? '',
          bairro: c.bairro ?? '',
          usuario: c.usuarioAlteracao ?? '',
          grupoId: c.grupoId ?? '',
          cep: c.cep ?? '',
          ativo: c.ativo ?? 'S',
          inscricao: c.inscricao ?? '',
          score: c.score ?? '',
          indicacaoId: c.indicacaoId ?? '',
          sla: c.sla ?? '',
        });
        this.clienteForm.get('clienteId')?.disable();
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        Swal.fire('Erro', 'Não foi possível carregar o cliente.', 'error');
      },
    });
  }

  private carregarContatos(clienteId: number) {
    this._clienteContato.listarTodos().subscribe({
      next: (resposta) => {
        const lista = (resposta?.data ?? []).filter((x) => Number(x.clienteId) === Number(clienteId));
        this.contatos = lista.map((x) => ({ ...x, _novo: false, _editado: false }));
      },
      error: () => {
        this.contatos = [];
      },
    });
  }

  adicionarOuAtualizarContato() {
    this.submittedContato = true;
    if (this.contatoForm.invalid) {
      return;
    }

    const v = this.contatoForm.getRawValue();
    const contato: ContatoUi = {
      clienteId: this.clienteIdAtual,
      contatoId: Number(v.contatoId),
      nome: v.nome,
      funcao: v.funcao,
      dataNasc: v.dataNasc || null,
      fone: v.fone || null,
      fone2: v.fone2 || null,
      email: v.email || null,
      dataInclusao: '',
      usuarioInclusao: this.usuarioAtual,
      dataAlteracao: null,
      usuarioAlteracao: this.usuarioAtual,
      senha: v.senha || null,
      qtdeAcesso: this.toNumberOrNull(v.qtdeAcesso),
      ativo: v.ativo || 'S',
      seRecebeEmailVersao: v.seRecebeEmailVersao || 'N',
      seCriaChamado: v.seCriaChamado || 'N',
      seAutorizaOrcamento: v.seAutorizaOrcamento || 'N',
      seRecebeEmailChamado: v.seRecebeEmailChamado || 'N',
      dataUltimoAcesso: v.dataUltimoAcesso || null,
      aniversario: v.aniversario || null,
      _novo: true,
      _editado: true,
    };

    if (this.indiceContatoEditando !== null) {
      const existente = this.contatos[this.indiceContatoEditando];
      this.contatos[this.indiceContatoEditando] = {
        ...contato,
        _novo: existente._novo,
        _editado: true,
      };
    } else {
      this.contatos.push(contato);
    }

    this.limparContatoForm();
  }

  editarContato(index: number) {
    const c = this.contatos[index];
    this.indiceContatoEditando = index;
    this.contatoForm.patchValue({
      contatoId: c.contatoId,
      nome: c.nome,
      funcao: c.funcao,
      dataNasc: this.normalizarData(c.dataNasc),
      fone: c.fone ?? '',
      fone2: c.fone2 ?? '',
      email: c.email ?? '',
      senha: c.senha ?? '',
      qtdeAcesso: c.qtdeAcesso ?? '',
      ativo: c.ativo ?? 'S',
      seRecebeEmailVersao: c.seRecebeEmailVersao ?? 'N',
      seCriaChamado: c.seCriaChamado ?? 'N',
      seAutorizaOrcamento: c.seAutorizaOrcamento ?? 'N',
      seRecebeEmailChamado: c.seRecebeEmailChamado ?? 'N',
      dataUltimoAcesso: this.normalizarData(c.dataUltimoAcesso),
      aniversario: c.aniversario ?? '',
    });
  }

  limparContatoForm() {
    this.indiceContatoEditando = null;
    this.submittedContato = false;
    this.contatoForm.reset({
      contatoId: '',
      nome: '',
      funcao: '',
      dataNasc: '',
      fone: '',
      fone2: '',
      email: '',
      senha: '',
      qtdeAcesso: '',
      ativo: 'S',
      seRecebeEmailVersao: 'N',
      seCriaChamado: 'N',
      seAutorizaOrcamento: 'N',
      seRecebeEmailChamado: 'N',
      dataUltimoAcesso: '',
      aniversario: '',
    });
  }

  salvarCliente() {
    this.submitted = true;
    if (this.clienteForm.invalid) {
      return;
    }

    this.salvando = true;
    const v = this.clienteForm.getRawValue();

    if (this.modoEdicao) {
      const payload = {
        clienteId: Number(v.clienteId),
        cnpj: v.cnpj,
        razaoSocial: v.razaoSocial,
        fantasia: v.fantasia,
        endereco: v.endereco,
        numero: v.numero,
        complemento: v.complemento || null,
        cidade: v.cidade,
        uf: v.uf,
        bairro: v.bairro,
        usuarioAlteracao: this.usuarioAtual,
        grupoId: this.toNumberOrNull(v.grupoId),
        cep: v.cep || null,
        ativo: v.ativo || 'S',
        inscricao: v.inscricao || null,
        score: this.toNumberOrNull(v.score),
        indicacaoId: this.toNumberOrNull(v.indicacaoId),
        sla: this.toNumberOrNull(v.sla),
      };
      this._cliente.atualizar(payload).subscribe({
        next: () => this.salvarContatos(payload.clienteId),
        error: () => {
          this.salvando = false;
          Swal.fire('Erro', 'Não foi possível atualizar o cliente.', 'error');
        },
      });
      return;
    }

    const payload = {
      clienteId: Number(v.clienteId),
      cnpj: v.cnpj,
      razaoSocial: v.razaoSocial,
      fantasia: v.fantasia,
      endereco: v.endereco,
      numero: v.numero,
      complemento: v.complemento || null,
      cidade: v.cidade,
      uf: v.uf,
      bairro: v.bairro,
      usuarioInclusao: this.usuarioAtual,
      grupoId: this.toNumberOrNull(v.grupoId),
      cep: v.cep || null,
      ativo: v.ativo || 'S',
      inscricao: v.inscricao || null,
      score: this.toNumberOrNull(v.score),
      indicacaoId: this.toNumberOrNull(v.indicacaoId),
      sla: this.toNumberOrNull(v.sla),
    };
    this._cliente.criar(payload).subscribe({
      next: () => this.tornarEdicao(payload.clienteId),
      error: () => {
        this.salvando = false;
        Swal.fire('Erro', 'Não foi possível criar o cliente.', 'error');
      },
    });
  }

  private salvarContatos(clienteId: number) {
    const alterados = this.contatos.filter((c) => c._novo || c._editado);
    if (!alterados.length) {
      this.finalizarSucesso();
      return;
    }

    let pendentes = alterados.length;
    let erro = false;

    alterados.forEach((c) => {
      const base = {
        clienteId,
        contatoId: Number(c.contatoId),
        nome: c.nome,
        funcao: c.funcao,
        dataNasc: c.dataNasc || null,
        fone: c.fone || null,
        fone2: c.fone2 || null,
        email: c.email || null,
        senha: c.senha || null,
        qtdeAcesso: this.toNumberOrNull(c.qtdeAcesso),
        ativo: c.ativo || 'S',
        seRecebeEmailVersao: c.seRecebeEmailVersao || 'N',
        seCriaChamado: c.seCriaChamado || 'N',
        seAutorizaOrcamento: c.seAutorizaOrcamento || 'N',
        seRecebeEmailChamado: c.seRecebeEmailChamado || 'N',
        dataUltimoAcesso: c.dataUltimoAcesso || null,
        aniversario: c.aniversario || null,
      };

      const onFinalizar = () => {
        pendentes -= 1;
        if (pendentes === 0) {
          if (erro) {
            this.salvando = false;
            Swal.fire('Atenção', 'Cliente salvo, mas houve erro ao salvar alguns contatos.', 'warning');
            return;
          }
          this.finalizarSucesso();
        }
      };

      if (c._novo) {
        this._clienteContato
          .criar({ ...base, usuarioInclusao: this.usuarioAtual })
          .subscribe({ next: onFinalizar, error: () => { erro = true; onFinalizar(); } });
      } else {
        this._clienteContato
          .atualizar({ ...base, usuarioAlteracao: this.usuarioAtual })
          .subscribe({ next: onFinalizar, error: () => { erro = true; onFinalizar(); } });
      }
    });
  }

  private finalizarSucesso() {
    this.salvando = false;
    Swal.fire('Sucesso', `Cliente ${this.modoEdicao ? 'atualizado' : 'criado'} com sucesso.`, 'success');
  }

  private tornarEdicao(clienteId: number) {
    this.salvando = false;
    this.modoEdicao = true;
    this.clienteIdEdicao = clienteId;
    this.tituloPagina = 'Editar Cliente';
    this.textoBotaoSalvar = 'Atualizar Cliente';
    this.clienteForm.get('clienteId')?.disable();
    this.carregarContatos(clienteId);
    this.limparContatoForm();
    Swal.fire('Sucesso', 'Cliente criado com sucesso. Agora você pode cadastrar os contatos.', 'success');
    this._router.navigate(['/cadastro/clientes', clienteId, 'editar'], { replaceUrl: true });
  }

  private get usuarioAtual(): string {
    const valor = this.clienteForm?.get('usuario')?.value;
    return String(valor ?? '').trim();
  }

  private get clienteIdAtual(): number {
    const valor = this.clienteForm?.getRawValue()?.clienteId;
    return Number(valor || this.clienteIdEdicao || 0);
  }

  private toNumberOrNull(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  private normalizarData(valor: string | null): string {
    if (!valor) {
      return '';
    }
    return valor.length >= 10 ? valor.substring(0, 10) : '';
  }
}
