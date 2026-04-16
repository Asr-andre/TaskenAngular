import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Indicacao, IndicacaoAtualizacao, IndicacaoCriacao } from '../models/indicacao.model';
import { RespostaApi } from '../models/resposta-api.model';

@Injectable({ providedIn: 'root' })
export class IndicacaoService {
  private readonly baseUrl = `${environment.apiUrl}/api/Indicacao`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<RespostaApi<Indicacao[]>> {
    return this.http.get<RespostaApi<Indicacao[]>>(`${this.baseUrl}/ListarTodos`);
  }

  obterPorId(id: number): Observable<RespostaApi<Indicacao>> {
    const params = new HttpParams().set('id', String(id));
    return this.http.get<RespostaApi<Indicacao>>(`${this.baseUrl}/ObterPorId`, { params });
  }

  criar(dados: IndicacaoCriacao): Observable<RespostaApi<Indicacao>> {
    return this.http.post<RespostaApi<Indicacao>>(`${this.baseUrl}/Criar`, dados);
  }

  atualizar(dados: IndicacaoAtualizacao): Observable<RespostaApi<Indicacao>> {
    return this.http.put<RespostaApi<Indicacao>>(`${this.baseUrl}/Atualizar`, dados);
  }
}
