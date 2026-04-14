import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Operador } from '../models/operador.model';

@Injectable({
  providedIn: 'root'
})
export class OperadorService {
  private apiUrl = 'https://localhost:7142/api/Funcionario';

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ListarTodos`);
  }

  obterPorId(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ObterPorId?id=${id}`);
  }

  criar(operador: Operador): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Criar`, operador);
  }

  atualizar(operador: Operador): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Atualizar`, operador);
  }

  deletar(id: number | string): Observable<any> {
    // Assuming delete requires the ID as query param or part of the URL
    // e.g., /Deletar?id=123
    return this.http.delete<any>(`${this.apiUrl}/Deletar?id=${id}`);
  }
}
