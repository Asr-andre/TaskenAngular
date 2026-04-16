import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { RespostaApi } from '../models/resposta-api.model';

export interface DadosAutenticacao {
  login: string;
  token: string;
  nome: string;
  tipo: string;
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private readonly chaveUsuario = 'currentUser';
  private readonly chaveToken = 'token';
  private readonly urlToken = `${environment.apiUrl}/api/Auth/Token`;

  private readonly usuarioSubject: BehaviorSubject<DadosAutenticacao | null>;

  constructor(private http: HttpClient) {
    this.usuarioSubject = new BehaviorSubject<DadosAutenticacao | null>(this.lerUsuarioStorage());
  }

  get usuarioAtual(): DadosAutenticacao | null {
    return this.usuarioSubject.value;
  }

  login(login: string, senha: string): Observable<DadosAutenticacao> {
    return this.http
      .post<RespostaApi<DadosAutenticacao>>(this.urlToken, { login, senha }, httpOptions)
      .pipe(
        map((resposta) => {
          if (!resposta?.success || !resposta?.data?.token) {
            throw new Error(resposta?.mensagem || 'Não foi possível autenticar.');
          }

          const dados = resposta.data;
          sessionStorage.setItem(this.chaveUsuario, JSON.stringify(dados));
          sessionStorage.setItem(this.chaveToken, dados.token);
          this.usuarioSubject.next(dados);
          return dados;
        }),
        catchError((erro: any) => {
          const mensagem = erro?.error?.mensagem || erro?.error?.message || erro?.message || 'Falha ao realizar login.';
          return throwError(() => mensagem);
        })
      );
  }

  register(email: string, first_name: string, password: string): Observable<never> {
    return throwError(() => 'Cadastro não disponível.');
  }

  resetPassword(email: string): Observable<never> {
    return throwError(() => 'Recuperação de senha não disponível.');
  }

  logout(): void {
    sessionStorage.removeItem(this.chaveUsuario);
    sessionStorage.removeItem(this.chaveToken);
    this.usuarioSubject.next(null);
  }

  obterToken(): string | null {
    return sessionStorage.getItem(this.chaveToken);
  }

  private lerUsuarioStorage(): DadosAutenticacao | null {
    try {
      const valor = sessionStorage.getItem(this.chaveUsuario);
      if (!valor) {
        return null;
      }
      return JSON.parse(valor) as DadosAutenticacao;
    } catch {
      return null;
    }
  }
}

