import { Component, OnInit } from '@angular/core';

import {clientLogoModel} from './categories.model';
import { ClientLogo } from './data';

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})

/**
 * Categories Component
 */
export class CategoriesComponent implements OnInit {

  ClientLogo!: clientLogoModel[];

  constructor() { }

  ngOnInit(): void {
    /**
     * fetches data
     */
     this._fetchData();
  }

  /**
 * Trending All Categories
 */
   private _fetchData() {
    this.ClientLogo = ClientLogo;
  }

  /**
   * Swiper Responsive setting
   */
   public Responsive = {
    infinite: true,
    slidesToShow: 4,
    autoplay: true,
    dots: true,
    arrows: false
  };

}
