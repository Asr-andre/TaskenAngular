import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class LanguageService {

  public languages: string[] = ['pt'];

  constructor(public translate: TranslateService, private cookieService: CookieService) {

    this.translate.addLangs(this.languages);
    this.translate.setDefaultLang('pt');
    this.translate.use('pt');
    this.cookieService.set('lang', 'pt');
  }

  /***
   * Cookie Language set
   */
  public setLanguage(lang: any) {
    this.translate.use('pt');
    this.cookieService.set('lang', 'pt');
  }

}
