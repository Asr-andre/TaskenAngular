import { Injectable, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, catchError, exhaustMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import { login, loginSuccess, loginFailure, logout, logoutSuccess, Register, RegisterFailure, RegisterSuccess } from './authentication.actions';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthenticationEffects {

  Register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Register),
      exhaustMap(({ email, first_name, password }) =>
        this.AuthenticationService.register(email, first_name, password).pipe(
          map((user) => RegisterSuccess({ user })),
          catchError((error) => of(RegisterFailure({ error })))
        ),
      )
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap(({ email, password }) => {
        if (environment.defaultauth === 'fakebackend') {
          return this.authFakeService.login(email, password).pipe(
            map((user) => {
              if (user?.token) {
                sessionStorage.setItem('token', user.token);
                this.router.navigate(['/']);
              }
              return loginSuccess({ user });
            }),
            catchError((error) => of(loginFailure({ error })))
          );
        }

        if (environment.defaultauth === 'firebase') {
          return of(loginFailure({ error: 'Firebase auth is not configured.' }));
        }

        return this.AuthenticationService.login(email, password).pipe(
          map((user) => {
            if (user?.token) {
              sessionStorage.setItem('token', user.token);
              this.router.navigate(['/']);
            }
            return loginSuccess({ user });
          }),
          catchError((error) => of(loginFailure({ error })))
        );
      })
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      tap(() => {
        // Perform any necessary cleanup or side effects before logging out
      }),
      exhaustMap(() => of(logoutSuccess()))
    )
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    private AuthenticationService: AuthenticationService,
    private authFakeService: AuthfakeauthenticationService,
    private router: Router) { }

}
