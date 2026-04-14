import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperadoresComponent } from './operadores/operadores.component';

const routes: Routes = [
  {
    path: 'operadores',
    component: OperadoresComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroRoutingModule {}

