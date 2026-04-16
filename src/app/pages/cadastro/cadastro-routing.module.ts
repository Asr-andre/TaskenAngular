import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteGruposComponent } from './cliente-grupos/cliente-grupos.component';
import { ClienteFormComponent } from './clientes/cliente-form/cliente-form.component';
import { ClientesComponent } from './clientes/clientes.component';
import { FuncionariosComponent } from './funcionarios/funcionarios.component';
import { IndicacoesComponent } from './indicacoes/indicacoes.component';
import { OperadoresComponent } from './operadores/operadores.component';

const routes: Routes = [
  { path: 'clientes', component: ClientesComponent },
  { path: 'clientes/novo', component: ClienteFormComponent },
  { path: 'clientes/:id/editar', component: ClienteFormComponent },
  { path: 'operadores', component: OperadoresComponent },
  { path: 'funcionarios', component: FuncionariosComponent },
  { path: 'indicacoes', component: IndicacoesComponent },
  { path: 'cliente-grupos', component: ClienteGruposComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroRoutingModule {}
