export interface Funcionario {
  funcionarioId: number;
  nome: string;
  endereco: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  uf: string;
  dataNascimento: string | null;
  dataAdmissao: string | null;
  funcaoId: number | null;
  dataInclusao: string;
  usuarioInclusao: string;
  dataAlteracao: string | null;
  usuarioAlteracao: string | null;
  cpf: string | null;
  ativo: string | null;
  operadorId: string | null;
}

export interface FuncionarioCriacao {
  funcionarioId: number;
  nome: string | null;
  endereco: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  dataNascimento: string | null;
  dataAdmissao: string | null;
  funcaoId: number | null;
  cpf: string | null;
  ativo: string | null;
  operadorId: string | null;
}

export interface FuncionarioAtualizacao extends FuncionarioCriacao {}
