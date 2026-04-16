import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbPaginationModule, NgbTooltipModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../../shared/shared.module';
import { CadastroRoutingModule } from './cadastro-routing.module';
import { ClienteGruposComponent } from './cliente-grupos/cliente-grupos.component';
import { ClienteGrupoModalComponent } from './cliente-grupos/modals/cliente-grupo-modal/cliente-grupo-modal.component';
import { ClienteFormComponent } from './clientes/cliente-form/cliente-form.component';
import { ClientesComponent } from './clientes/clientes.component';
import { FuncionariosComponent } from './funcionarios/funcionarios.component';
import { FuncionarioModalComponent } from './funcionarios/modals/funcionario-modal/funcionario-modal.component';
import { IndicacoesComponent } from './indicacoes/indicacoes.component';
import { IndicacaoModalComponent } from './indicacoes/modals/indicacao-modal/indicacao-modal.component';
import { OperadoresComponent } from './operadores/operadores.component';
import { OperadorModalComponent } from './operadores/modals/operador-modal/operador-modal.component';

@NgModule({
  declarations: [
    OperadoresComponent,
    OperadorModalComponent,
    FuncionariosComponent,
    FuncionarioModalComponent,
    IndicacoesComponent,
    IndicacaoModalComponent,
    ClienteGruposComponent,
    ClienteGrupoModalComponent,
    ClientesComponent,
    ClienteFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbTooltipModule,
    NgbModalModule,
    CadastroRoutingModule,
    SharedModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CadastroModule {}
