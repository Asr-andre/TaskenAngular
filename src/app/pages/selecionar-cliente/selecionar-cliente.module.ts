import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelecionarClienteComponent } from './selecionar-cliente.component';
import { SelecionarClienteRoutingModule } from './selecionar-cliente-routing.module';

@NgModule({
  declarations: [SelecionarClienteComponent],
  imports: [CommonModule, FormsModule, SelecionarClienteRoutingModule],
})
export class SelecionarClienteModule {}

