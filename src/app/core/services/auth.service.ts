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
  variosCliente?: boolean;
  clientes?: Array<{
    clienteId: number;
    fantasia?: string;
    cnpj?: string;
    qtdeChamadosAbertos?: number;
  }>;
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private readonly chaveUsuario = 'currentUser';
  private readonly chaveToken = 'token';
  private readonly chaveClienteSelecionado = 'clienteSelecionadoId';
  private readonly urlToken = `${environment.apiUrl}/api/Auth/Token`;

  private readonly usuarioSubject: BehaviorSubject<DadosAutenticacao | null>;

  constructor(private http: HttpClient) {
    this.usuarioSubject = new BehaviorSubject<DadosAutenticacao | null>(this.lerUsuarioStorage());
  }

  get usuarioAtual(): DadosAutenticacao | null {
    return this.usuarioSubject.value;
  }

  login(login: string, senha: string): Observable<RespostaApi<DadosAutenticacao>> {
    const payload = { login, senha };

    return this.http.post<RespostaApi<DadosAutenticacao>>(this.urlToken, payload, httpOptions).pipe(
      catchError((erro: any) => {
        const mensagem = erro?.error?.mensagem || erro?.error?.message || erro?.message || 'Falha ao realizar login.';
        return throwError(() => mensagem);
      })
    );
  }

  aplicarLogin(dados: DadosAutenticacao): void {
    sessionStorage.setItem(this.chaveUsuario, JSON.stringify(dados));
    sessionStorage.setItem(this.chaveToken, dados.token);
    sessionStorage.removeItem(this.chaveClienteSelecionado);

    if (this.normalizarTipo(dados.tipo) === 'cliente') {
      const clientes = dados.clientes ?? [];
      if (clientes.length === 1 && !dados.variosCliente) {
        this.definirClienteSelecionadoId(clientes[0].clienteId);
      }
    }

    this.usuarioSubject.next(dados);
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
    sessionStorage.removeItem(this.chaveClienteSelecionado);
    this.usuarioSubject.next(null);
  }

  obterToken(): string | null {
    return sessionStorage.getItem(this.chaveToken);
  }

  obterClienteSelecionadoId(): number | null {
    const valor = sessionStorage.getItem(this.chaveClienteSelecionado);
    if (!valor) {
      return null;
    }
    const id = Number(valor);
    return Number.isFinite(id) && id > 0 ? id : null;
  }

  definirClienteSelecionadoId(clienteId: number): void {
    const id = Number(clienteId);
    if (!Number.isFinite(id) || id <= 0) {
      return;
    }
    sessionStorage.setItem(this.chaveClienteSelecionado, String(id));
  }

  precisaSelecionarCliente(): boolean {
    const usuario = this.usuarioAtual;
    if (!usuario) {
      return false;
    }
    const tipo = this.normalizarTipo(usuario.tipo);
    if (tipo !== 'cliente') {
      return false;
    }
    if (!usuario.variosCliente) {
      return false;
    }
    const clientes = usuario.clientes ?? [];
    if (clientes.length <= 1) {
      return false;
    }
    return !this.obterClienteSelecionadoId();
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

  private normalizarTipo(tipo: string): string {
    return String(tipo ?? '').trim().toLowerCase();
  }
}

