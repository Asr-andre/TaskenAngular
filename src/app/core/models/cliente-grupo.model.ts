export interface ClienteGrupo {
  grupoId: number;
  nome: string | null;
  dataAlteracao: string | null;
  usuarioAlteracao: string | null;
}

export interface ClienteGrupoCriacao {
  grupoId: number;
  nome: string | null;
  usuarioAlteracao: string | null;
}

export interface ClienteGrupoAtualizacao extends ClienteGrupoCriacao {}
