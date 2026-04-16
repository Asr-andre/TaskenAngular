import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { AuthenticationService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private autenticacao: AuthenticationService,
        private router: Router
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const isRotaToken = request.url.includes('/api/Auth/Token');
        const token = this.autenticacao.obterToken();

        if (!isRotaToken && token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }
        return next.handle(request).pipe(
            catchError((error) => {
              if (error.status === 401) {
                this.autenticacao.logout();
                this.router.navigate(['/auth/login']);
              }
              return throwError(error);
            })
          );
    }
}
