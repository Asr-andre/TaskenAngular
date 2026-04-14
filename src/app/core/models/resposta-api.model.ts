export interface RespostaApi<T> {
  data: T;
  success: boolean;
  codigo: number;
  mensagem: string;
}

