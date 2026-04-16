export interface Indicacao {
  indicacaoId: number;
  nome: string;
  dataInclusao: string;
  usuarioInclusao: string;
  dataAlteracao: string | null;
  usuarioAlteracao: string | null;
  responsavel: string | null;
}

export interface IndicacaoCriacao {
  indicacaoId: number;
  nome: string | null;
  responsavel: string | null;
}

export interface IndicacaoAtualizacao extends IndicacaoCriacao {}
