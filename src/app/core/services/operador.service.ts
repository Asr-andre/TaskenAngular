import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Operador, OperadorAtualizacao, OperadorCriacao } from '../models/operador.model';
import { RespostaApi } from '../models/resposta-api.model';

@Injectable({ providedIn: 'root' })
export class OperadorService {
  private readonly baseUrl = `${environment.apiUrl}/api/Operador`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<RespostaApi<Operador[]>> {
    return this.http.get<RespostaApi<Operador[]>>(`${this.baseUrl}/ListarTodos`);
  }

  obterPorId(id: string): Observable<RespostaApi<Operador>> {
    const params = new HttpParams().set('id', id);
    return this.http.get<RespostaApi<Operador>>(`${this.baseUrl}/ObterPorId`, { params });
  }

  criar(dados: OperadorCriacao): Observable<RespostaApi<Operador>> {
    return this.http.post<RespostaApi<Operador>>(`${this.baseUrl}/Criar`, dados);
  }

  atualizar(dados: OperadorAtualizacao): Observable<RespostaApi<Operador>> {
    return this.http.put<RespostaApi<Operador>>(`${this.baseUrl}/Atualizar`, dados);
  }
}

