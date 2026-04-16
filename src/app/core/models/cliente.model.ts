export interface Cliente {
  clienteId: number;
  cnpj: string;
  razaoSocial: string;
  fantasia: string;
  endereco: string;
  numero: string;
  complemento: string | null;
  cidade: string;
  uf: string;
  bairro: string;
  dataInclusao: string;
  usuarioInclusao: string;
  dataAlteracao: string | null;
  usuarioAlteracao: string | null;
  grupoId: number | null;
  cep: string | null;
  ativo: string | null;
  inscricao: string | null;
  score: number | null;
  indicacaoId: number | null;
  sla: number | null;
}

export interface ClienteCriacao {
  clienteId: number;
  cnpj: string;
  razaoSocial: string;
  fantasia: string;
  endereco: string;
  numero: string;
  complemento: string | null;
  cidade: string;
  uf: string;
  bairro: string;
  usuarioInclusao: string;
  grupoId: number | null;
  cep: string | null;
  ativo: string | null;
  inscricao: string | null;
  score: number | null;
  indicacaoId: number | null;
  sla: number | null;
}

export interface ClienteAtualizacao {
  clienteId: number;
  cnpj: string;
  razaoSocial: string;
  fantasia: string;
  endereco: string;
  numero: string;
  complemento: string | null;
  cidade: string;
  uf: string;
  bairro: string;
  usuarioAlteracao: string;
  grupoId: number | null;
  cep: string | null;
  ativo: string | null;
  inscricao: string | null;
  score: number | null;
  indicacaoId: number | null;
  sla: number | null;
}
