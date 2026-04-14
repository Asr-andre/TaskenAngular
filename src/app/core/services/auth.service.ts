import { Injectable } from '@angular/core';
import { getFirebaseBackend } from '../../authUtils';
import { User } from 'src/app/store/Authentication/auth.models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { GlobalComponent } from "../../global-component";
import { Store } from '@ngrx/store';
import { RegisterSuccess, loginFailure, loginSuccess, logout, logoutSuccess } from 'src/app/store/Authentication/authentication.actions';
import { environment } from '../../../environments/environment';

const AUTH_API = GlobalComponent.AUTH_API;

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  

@Injectable({ providedIn: 'root' })

/**
 * Auth-service Component
 */
export class AuthenticationService {

    user!: User;
    currentUserValue: any;

    private currentUserSubject: BehaviorSubject<User>;
    // public currentUser: Observable<User>;

    constructor(private http: HttpClient, private store: Store) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser')!));
        // this.currentUser = this.currentUserSubject.asObservable();
     }

    /**
     * Performs the register
     * @param email email
     * @param password password
     */
    register(email: string, first_name: string, password: string) {        
        // return getFirebaseBackend()!.registerUser(email, password).then((response: any) => {
        //     const user = response;
        //     return user;
        // });

        if (environment.defaultauth === 'fakebackend') {
            const payload = {
                email,
                username: first_name,
                firstName: first_name,
                password,
            };

            return this.http.post('/users/register', payload, httpOptions).pipe(
                map((response: any) => response ?? { status: 'success' }),
                catchError((error: any) => {
                    const errorMessage = error?.error?.message ?? 'Register failed';
                    this.store.dispatch(loginFailure({ error: errorMessage }));
                    return throwError(errorMessage);
                })
            );
        }

        return this.http.post(AUTH_API + 'signup', { email, first_name, password }, httpOptions).pipe(
            map((response: any) => response),
            catchError((error: any) => {
                const errorMessage = error?.error?.message ?? 'Register failed';
                this.store.dispatch(loginFailure({ error: errorMessage }));
                return throwError(errorMessage);
            })
        );
    }

    /**
     * Performs the auth
     * @param email email of user
     * @param password password of user
     */
    login(email: string, password: string) {
        // return getFirebaseBackend()!.loginUser(email, password).then((response: any) => {
        //     const user = response;
        //     return user;
        // });

        if (environment.defaultauth === 'fakebackend') {
            return this.http.post<any>('/users/authenticate', { email, password }, httpOptions).pipe(
                map((user: any) => ({ status: 'success', data: user, token: user?.token })),
                catchError((error: any) => {
                    const errorMessage = error?.error?.message ?? 'Login failed';
                    return throwError(errorMessage);
                })
            );
        }

        return this.http.post(AUTH_API + 'signin', { email, password }, httpOptions).pipe(
            map((response: any) => response),
            catchError((error: any) => {
                const errorMessage = error?.error?.message ?? 'Login failed';
                return throwError(errorMessage);
            })
        );
    }

    /**
     * Returns the current user
     */
    public currentUser(): any {
        return getFirebaseBackend()!.getAuthenticatedUser();
    }

    /**
     * Logout the user
     */
    logout() {
        this.store.dispatch(logout());
        // logout the user
        // return getFirebaseBackend()!.logout();
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('token');
        this.currentUserSubject.next(null!);

        return of(undefined).pipe(
        
        );

    }

    /**
     * Reset password
     * @param email email
     */
    resetPassword(email: string) {
        return getFirebaseBackend()!.forgetPassword(email).then((response: any) => {
            const message = response.data;
            return message;
        });
    }

}

