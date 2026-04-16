export interface ClienteContato {
  clienteId: number;
  contatoId: number;
  nome: string;
  funcao: string;
  dataNasc: string | null;
  fone: string | null;
  fone2: string | null;
  email: string | null;
  dataInclusao: string;
  usuarioInclusao: string;
  dataAlteracao: string | null;
  usuarioAlteracao: string | null;
  senha: string | null;
  qtdeAcesso: number | null;
  ativo: string | null;
  seRecebeEmailVersao: string | null;
  seCriaChamado: string | null;
  seAutorizaOrcamento: string | null;
  seRecebeEmailChamado: string | null;
  dataUltimoAcesso: string | null;
  aniversario: string | null;
}

export interface ClienteContatoCriacao {
  clienteId: number;
  contatoId: number;
  nome: string;
  funcao: string;
  dataNasc: string | null;
  fone: string | null;
  fone2: string | null;
  email: string | null;
  usuarioInclusao: string;
  senha: string | null;
  qtdeAcesso: number | null;
  ativo: string | null;
  seRecebeEmailVersao: string | null;
  seCriaChamado: string | null;
  seAutorizaOrcamento: string | null;
  seRecebeEmailChamado: string | null;
  dataUltimoAcesso: string | null;
  aniversario: string | null;
}

export interface ClienteContatoAtualizacao {
  clienteId: number;
  contatoId: number;
  nome: string;
  funcao: string;
  dataNasc: string | null;
  fone: string | null;
  fone2: string | null;
  email: string | null;
  usuarioAlteracao: string;
  senha: string | null;
  qtdeAcesso: number | null;
  ativo: string | null;
  seRecebeEmailVersao: string | null;
  seCriaChamado: string | null;
  seAutorizaOrcamento: string | null;
  seRecebeEmailChamado: string | null;
  dataUltimoAcesso: string | null;
  aniversario: string | null;
}
