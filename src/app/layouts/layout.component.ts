import { Component, OnInit } from '@angular/core';

// Store
import { RootReducerState } from '../store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

/**
 * Layout Component
 */
export class LayoutComponent implements OnInit {

  layoutType!: string;

  constructor(private store: Store<RootReducerState>) { }

  ngOnInit(): void {
    this.store.select('layout').subscribe((data) => {
      const normalizedLayout = data.LAYOUT === 'horizontal' ? 'horizontal' : 'vertical';
      this.layoutType = normalizedLayout;
      document.documentElement.setAttribute('data-layout', normalizedLayout);
      document.documentElement.setAttribute('data-bs-theme', data.LAYOUT_MODE);
      document.documentElement.setAttribute('data-layout-width', data.LAYOUT_WIDTH);
      document.documentElement.setAttribute('data-layout-position', data.LAYOUT_POSITION);
      document.documentElement.setAttribute('data-topbar', data.TOPBAR);
      normalizedLayout === "vertical" ? document.documentElement.setAttribute('data-sidebar', data.SIDEBAR_COLOR) : '';
      normalizedLayout === "vertical" ? document.documentElement.setAttribute('data-sidebar-size', data.SIDEBAR_SIZE) : '';
      normalizedLayout === "vertical" ? document.documentElement.setAttribute('data-sidebar-image', data.SIDEBAR_IMAGE) : '';
      normalizedLayout === "vertical" ? document.documentElement.setAttribute('data-layout-style', data.SIDEBAR_VIEW) : '';
      document.documentElement.setAttribute('data-preloader', data.DATA_PRELOADER)
      document.documentElement.setAttribute('data-sidebar-visibility', data.SIDEBAR_VISIBILITY);
    })

  }


  /**
  * Check if the vertical layout is requested
  */
  isVerticalLayoutRequested() {
    return this.layoutType === 'vertical';
  }

  /**
   * Check if the horizontal layout is requested
   */
  isHorizontalLayoutRequested() {
    return this.layoutType === 'horizontal';
  }

}
