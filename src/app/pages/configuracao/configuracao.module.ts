import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfiguracaoRoutingModule } from './configuracao-routing.module';
import { ConfiguracaoComponent } from './configuracao.component';

@NgModule({
  declarations: [ConfiguracaoComponent],
  imports: [CommonModule, FormsModule, SharedModule, ConfiguracaoRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ConfiguracaoModule {}
