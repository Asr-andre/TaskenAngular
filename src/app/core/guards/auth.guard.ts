import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard  {
    constructor(
        private router: Router,
        private autenticacao: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const token = this.autenticacao.obterToken();
        if (token) {
            const url = state.url || '/';
            const ehRotaSelecao = url.startsWith('/selecionar-cliente');

            if (this.autenticacao.precisaSelecionarCliente() && !ehRotaSelecao) {
                this.router.navigate(['/selecionar-cliente'], { queryParams: { returnUrl: url } });
                return false;
            }

            return true;
        }
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
