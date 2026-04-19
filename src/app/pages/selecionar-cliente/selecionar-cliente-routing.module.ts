import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelecionarClienteComponent } from './selecionar-cliente.component';

const routes: Routes = [{ path: '', component: SelecionarClienteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelecionarClienteRoutingModule {}

