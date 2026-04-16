import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ClienteContato,
  ClienteContatoAtualizacao,
  ClienteContatoCriacao,
} from '../models/cliente-contato.model';
import { RespostaApi } from '../models/resposta-api.model';

@Injectable({ providedIn: 'root' })
export class ClienteContatoService {
  private readonly baseUrl = `${environment.apiUrl}/api/ClienteContato`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<RespostaApi<ClienteContato[]>> {
    return this.http.get<RespostaApi<ClienteContato[]>>(`${this.baseUrl}/ListarTodos`);
  }

  obterPorId(clienteId: number, contatoId: number): Observable<RespostaApi<ClienteContato>> {
    const params = new HttpParams().set('clienteId', String(clienteId)).set('contatoId', String(contatoId));
    return this.http.get<RespostaApi<ClienteContato>>(`${this.baseUrl}/ObterPorId`, { params });
  }

  criar(dados: ClienteContatoCriacao): Observable<RespostaApi<ClienteContato>> {
    return this.http.post<RespostaApi<ClienteContato>>(`${this.baseUrl}/Criar`, dados);
  }

  atualizar(dados: ClienteContatoAtualizacao): Observable<RespostaApi<ClienteContato>> {
    return this.http.put<RespostaApi<ClienteContato>>(`${this.baseUrl}/Atualizar`, dados);
  }
}
