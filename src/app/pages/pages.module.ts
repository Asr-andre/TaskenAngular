import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  NgbToastModule, NgbProgressbarModule
} from '@ng-bootstrap/ng-bootstrap';

import { FlatpickrModule } from 'angularx-flatpickr';
import { CountUpModule } from 'ngx-countup';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';

// Load Icons
import { defineElement } from "@lordicon/element";
import lottie from 'lottie-web';

// Pages Routing
import { PagesRoutingModule } from "./pages-routing.module";
import { SharedModule } from "../shared/shared.module";
import { HomeComponent } from './home/home.component';
import { DashboardsModule } from "./dashboards/dashboards.module";

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbToastModule,
    NgbProgressbarModule,
    FlatpickrModule.forRoot(),
    CountUpModule,
    NgApexchartsModule,
    LeafletModule,
    NgbDropdownModule,
    SimplebarAngularModule,
    PagesRoutingModule,
    SharedModule,
    DashboardsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
