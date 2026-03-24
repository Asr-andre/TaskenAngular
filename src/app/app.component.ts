import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'velzon';

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('pt');
    this.translate.use('pt');
  }
}
