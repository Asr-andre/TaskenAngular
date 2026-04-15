import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbPaginationModule, NgbTooltipModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../../shared/shared.module';
import { CadastroRoutingModule } from './cadastro-routing.module';
import { FuncionariosComponent } from './funcionarios/funcionarios.component';
import { OperadoresComponent } from './operadores/operadores.component';

@NgModule({
  declarations: [OperadoresComponent, FuncionariosComponent],
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
