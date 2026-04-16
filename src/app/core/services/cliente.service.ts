import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cliente, ClienteAtualizacao, ClienteCriacao } from '../models/cliente.model';
import { RespostaApi } from '../models/resposta-api.model';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly baseUrl = `${environment.apiUrl}/api/Cliente`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<RespostaApi<Cliente[]>> {
    return this.http.get<RespostaApi<Cliente[]>>(`${this.baseUrl}/ListarTodos`);
  }

  obterPorId(id: number): Observable<RespostaApi<Cliente>> {
    const params = new HttpParams().set('id', String(id));
    return this.http.get<RespostaApi<Cliente>>(`${this.baseUrl}/ObterPorId`, { params });
  }

  criar(dados: ClienteCriacao): Observable<RespostaApi<Cliente>> {
    return this.http.post<RespostaApi<Cliente>>(`${this.baseUrl}/Criar`, dados);
  }

  atualizar(dados: ClienteAtualizacao): Observable<RespostaApi<Cliente>> {
    return this.http.put<RespostaApi<Cliente>>(`${this.baseUrl}/Atualizar`, dados);
  }
}
