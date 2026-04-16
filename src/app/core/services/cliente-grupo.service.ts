import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ClienteGrupo, ClienteGrupoAtualizacao, ClienteGrupoCriacao } from '../models/cliente-grupo.model';
import { RespostaApi } from '../models/resposta-api.model';

@Injectable({ providedIn: 'root' })
export class ClienteGrupoService {
  private readonly baseUrl = `${environment.apiUrl}/api/ClienteGrupo`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<RespostaApi<ClienteGrupo[]>> {
    return this.http.get<RespostaApi<ClienteGrupo[]>>(`${this.baseUrl}/ListarTodos`);
  }

  obterPorId(id: number): Observable<RespostaApi<ClienteGrupo>> {
    const params = new HttpParams().set('id', String(id));
    return this.http.get<RespostaApi<ClienteGrupo>>(`${this.baseUrl}/ObterPorId`, { params });
  }

  criar(dados: ClienteGrupoCriacao): Observable<RespostaApi<ClienteGrupo>> {
    return this.http.post<RespostaApi<ClienteGrupo>>(`${this.baseUrl}/Criar`, dados);
  }

  atualizar(dados: ClienteGrupoAtualizacao): Observable<RespostaApi<ClienteGrupo>> {
    return this.http.put<RespostaApi<ClienteGrupo>>(`${this.baseUrl}/Atualizar`, dados);
  }
}
