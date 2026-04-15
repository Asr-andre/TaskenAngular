import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuncionariosComponent } from './funcionarios/funcionarios.component';
import { OperadoresComponent } from './operadores/operadores.component';

const routes: Routes = [
  { path: 'operadores', component: OperadoresComponent },
  { path: 'funcionarios', component: FuncionariosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroRoutingModule {}
