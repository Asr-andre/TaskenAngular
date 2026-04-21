import { Component, OnInit } from '@angular/core';

// Store
import { RootReducerState } from '../store';
import { Store } from '@ngrx/store';
import { AuthenticationService } from '../core/services/auth.service';

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

  constructor(
    private store: Store<RootReducerState>,
    private autenticacao: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.store.select('layout').subscribe((data) => {
      const tipo = (this.autenticacao.usuarioAtual?.tipo ?? '').toString().trim().toLowerCase();
      const layoutPorTipo = tipo === 'cliente' ? 'horizontal' : 'vertical';
      const layout = layoutPorTipo;
      this.layoutType = layout;
      document.documentElement.setAttribute('data-layout', layout);
      document.documentElement.setAttribute('data-bs-theme', data.LAYOUT_MODE);
      document.documentElement.setAttribute('data-layout-width', 'fluid');
      document.documentElement.setAttribute('data-layout-position', data.LAYOUT_POSITION);
      document.documentElement.setAttribute('data-topbar', data.TOPBAR);
      layout == "vertical" ? document.documentElement.setAttribute('data-sidebar', data.SIDEBAR_COLOR) : '';
      layout == "vertical" ? document.documentElement.setAttribute('data-sidebar-size', data.SIDEBAR_SIZE) : '';
      layout == "vertical" ? document.documentElement.setAttribute('data-sidebar-image', data.SIDEBAR_IMAGE) : '';
      layout == "vertical" ? document.documentElement.setAttribute('data-layout-style', 'default') : '';
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
