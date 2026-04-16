import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuncionariosComponent } from './funcionarios/funcionarios.component';
import { IndicacoesComponent } from './indicacoes/indicacoes.component';
import { OperadoresComponent } from './operadores/operadores.component';

const routes: Routes = [
  { path: 'operadores', component: OperadoresComponent },
  { path: 'funcionarios', component: FuncionariosComponent },
  { path: 'indicacoes', component: IndicacoesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroRoutingModule {}
