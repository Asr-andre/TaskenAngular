import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Chamado } from '../models/chamado.model';
import { RespostaApi } from '../models/resposta-api.model';

@Injectable({ providedIn: 'root' })
export class ChamadoService {
  private readonly baseUrl = `${environment.apiUrl}/api/Chamado`;

  constructor(private http: HttpClient) {}

  listar(clienteId: number, status?: string | null): Observable<RespostaApi<Chamado[]>> {
    let params = new HttpParams().set('clienteId', String(clienteId));
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<RespostaApi<Chamado[]>>(`${this.baseUrl}/Listar`, { params });
  }
}

