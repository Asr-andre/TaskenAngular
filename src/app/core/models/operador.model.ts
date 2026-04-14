export interface Operador {
  operadorId: string;
  nome: string | null;
  senha: string | null;
  email: string | null;
  seAdmin: boolean | null;
  seAtivo: string | null;
  perfilSkin: string | null;
  dataUltimoAcesso: string | null;
  dataInclusao: string;
  usuarioInclusao: string;
  dataAlteracao: string | null;
  usuarioAlteracao: string | null;
  perfilId: string | null;
}

export interface OperadorCriacao {
  operadorId: string;
  nome: string | null;
  senha: string | null;
  email: string | null;
  seAdmin: boolean | null;
  seAtivo: string | null;
  perfilId: string | null;
}

export interface OperadorAtualizacao {
  operadorId: string;
  nome: string | null;
  senha: string | null;
  email: string | null;
  seAdmin: boolean | null;
  seAtivo: string | null;
  perfilId: string | null;
}
