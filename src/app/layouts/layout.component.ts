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
  private sidebarImageResolved: 'img-2' | 'none' | null = null;
  private sidebarImageResolving = false;

  constructor(
    private store: Store<RootReducerState>,
    private autenticacao: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.store.select('layout').subscribe((data) => {
      const tipo = this.normalizarTipo(this.autenticacao.usuarioAtual?.tipo);
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
      if (layout === 'vertical') {
        const sidebarImage = this.obterSidebarImage(tipo, String(data.SIDEBAR_IMAGE ?? ''));
        document.documentElement.setAttribute('data-sidebar-image', sidebarImage);
      }
      layout == "vertical" ? document.documentElement.setAttribute('data-layout-style', 'default') : '';
      document.documentElement.setAttribute('data-preloader', data.DATA_PRELOADER)
      document.documentElement.setAttribute('data-sidebar-visibility', data.SIDEBAR_VISIBILITY);
    })

  }

  private obterSidebarImage(tipo: string, sidebarImageDoStore: string): string {
    const sidebarImageNormalizado = String(sidebarImageDoStore ?? '').trim().toLowerCase();

    if (tipo !== 'funcionario') {
      return sidebarImageNormalizado || 'none';
    }

    if (sidebarImageNormalizado && sidebarImageNormalizado !== 'none') {
      return sidebarImageNormalizado;
    }

    if (this.sidebarImageResolved === 'img-2') {
      return 'img-2';
    }

    if (this.sidebarImageResolved === 'none') {
      return 'none';
    }

    if (!this.sidebarImageResolving) {
      this.sidebarImageResolving = true;
      this.verificarImagem('assets/images/sidebar/img-2.jpg').then((existe) => {
        this.sidebarImageResolved = existe ? 'img-2' : 'none';
        this.sidebarImageResolving = false;
        if (this.layoutType === 'vertical' && this.normalizarTipo(this.autenticacao.usuarioAtual?.tipo) === 'funcionario') {
          const atual = String(document.documentElement.getAttribute('data-sidebar-image') ?? '').trim().toLowerCase();
          if (!atual || atual === 'none') {
            document.documentElement.setAttribute('data-sidebar-image', this.sidebarImageResolved);
          }
        }
      });
    }

    return 'none';
  }

  private verificarImagem(src: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      const timeoutId = setTimeout(() => resolve(false), 3000);
      img.onload = () => {
        clearTimeout(timeoutId);
        resolve(true);
      };
      img.onerror = () => {
        clearTimeout(timeoutId);
        resolve(false);
      };
      img.src = src;
    });
  }

  private normalizarTipo(tipo: string | undefined | null): string {
    return String(tipo ?? '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
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
