import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ConfiguracaoRoutingModule } from './configuracao-routing.module';
import { ConfiguracaoComponent } from './configuracao.component';

@NgModule({
  declarations: [ConfiguracaoComponent],
  imports: [CommonModule, FormsModule, SharedModule, ConfiguracaoRoutingModule],
})
export class ConfiguracaoModule {}
