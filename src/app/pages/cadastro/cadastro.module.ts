import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbPaginationModule, NgbTooltipModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../../shared/shared.module';
import { CadastroRoutingModule } from './cadastro-routing.module';
import { FuncionariosComponent } from './funcionarios/funcionarios.component';
import { FuncionarioModalComponent } from './funcionarios/modals/funcionario-modal/funcionario-modal.component';
import { OperadoresComponent } from './operadores/operadores.component';
import { OperadorModalComponent } from './operadores/modals/operador-modal/operador-modal.component';

@NgModule({
  declarations: [OperadoresComponent, OperadorModalComponent, FuncionariosComponent, FuncionarioModalComponent],
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
