import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LayoutsModule } from "./layouts/layouts.module";
import { PagesModule } from "./pages/pages.module";

// Auth
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';
import { ToastrModule } from 'ngx-toastr';

// Store
import { rootReducer } from './store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

@NgModule({ declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserAnimationsModule,
        BrowserModule,
        AppRoutingModule,
        LayoutsModule,
        ToastrModule.forRoot({
            positionClass: 'toast-top-right',
            preventDuplicates: true,
            closeButton: true,
            progressBar: true
        }),
        StoreModule.forRoot(rootReducer),
        StoreDevtoolsModule.instrument({
            maxAge: 25, // Retains last 25 states
            logOnly: environment.production, // Restrict extension to log-only mode
        }),
        EffectsModule.forRoot([]),
        PagesModule,
        ], providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule { }
