import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Funcionario, FuncionarioAtualizacao, FuncionarioCriacao } from '../models/funcionario.model';
import { RespostaApi } from '../models/resposta-api.model';

@Injectable({ providedIn: 'root' })
export class FuncionarioService {
  private readonly baseUrl = `${environment.apiUrl}/api/Funcionario`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<RespostaApi<Funcionario[]>> {
    return this.http.get<RespostaApi<Funcionario[]>>(`${this.baseUrl}/ListarTodos`);
  }

  obterPorId(id: number): Observable<RespostaApi<Funcionario>> {
    const params = new HttpParams().set('id', String(id));
    return this.http.get<RespostaApi<Funcionario>>(`${this.baseUrl}/ObterPorId`, { params });
  }

  criar(dados: FuncionarioCriacao): Observable<RespostaApi<Funcionario>> {
    return this.http.post<RespostaApi<Funcionario>>(`${this.baseUrl}/Criar`, dados);
  }

  atualizar(dados: FuncionarioAtualizacao): Observable<RespostaApi<Funcionario>> {
    return this.http.put<RespostaApi<Funcionario>>(`${this.baseUrl}/Atualizar`, dados);
  }
}
