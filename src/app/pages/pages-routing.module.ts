import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component pages
import { DashboardComponent } from "./dashboards/dashboard/dashboard.component";
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    {
        path: "", component: HomeComponent
    },
    {
      path: "dashboard", component: DashboardComponent
    },
    {
      path: '', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule)
    },
    {
      path: 'cadastro', loadChildren: () => import('./cadastro/cadastro.module').then(m => m.CadastroModule)
    },
    {
      path: 'configuracao', loadChildren: () => import('./configuracao/configuracao.module').then(m => m.ConfiguracaoModule)
    },
    {
      path: 'tickets', loadChildren: () => import('./tickets/tickets.module').then(m => m.TicketsModule)
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
