import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootReducerState } from 'src/app/store';
import {
  changeDataPreloader,
  changeLayoutPosition,
  changeMode,
  changeSidebarColor,
  changeSidebarImage,
  changeSidebarSize,
  changeTopbar,
  changelayout,
} from 'src/app/store/layouts/layout-action';
import {
  getLayoutMode,
  getLayoutPosition,
  getLayoutTheme,
  getPreloader,
  getSidebarColor,
  getSidebarImage,
  getSidebarSize,
  getTopbarColor,
} from 'src/app/store/layouts/layout-selector';

@Component({
  selector: 'app-configuracao',
  templateUrl: './configuracao.component.html',
  styleUrls: ['./configuracao.component.scss'],
})
export class ConfiguracaoComponent implements OnInit {
  breadCrumbItems!: Array<{}>;

  attribute: string | undefined;
  mode: string | undefined;
  position: string | undefined;
  topbar: string | undefined;
  size: string | undefined;
  sidebar: string | undefined;
  sidebarImage: string | undefined;
  preLoader: string | undefined;

  constructor(private store: Store<RootReducerState>) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Configuração', active: true }];

    this.store.select('layout').subscribe((data) => {
      this.attribute = data.LAYOUT === 'semibox' ? 'vertical' : data.LAYOUT;
      this.mode = data.LAYOUT_MODE;
      this.position = data.LAYOUT_POSITION;
      this.topbar = data.TOPBAR;
      this.size = data.SIDEBAR_SIZE;
      this.sidebar = data.SIDEBAR_COLOR;
      this.sidebarImage = data.SIDEBAR_IMAGE;
      this.preLoader = data.DATA_PRELOADER;
    });
  }

  changeLayout(layout: string) {
    this.attribute = layout;
    this.store.dispatch(changelayout({ layout }));
    this.store.select(getLayoutTheme).subscribe((layoutTheme) => {
      document.documentElement.setAttribute('data-layout', layoutTheme);
    });
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }

  changeLayoutMode(mode: string) {
    this.mode = mode;
    this.store.dispatch(changeMode({ mode }));
    this.store.select(getLayoutMode).subscribe((layoutMode) => {
      document.documentElement.setAttribute('data-bs-theme', layoutMode);
    });
  }

  changePosition(layoutPosition: string) {
    this.position = layoutPosition;
    this.store.dispatch(changeLayoutPosition({ layoutPosition }));
    this.store.select(getLayoutPosition).subscribe((position) => {
      document.documentElement.setAttribute('data-layout-position', position);
    });
  }

  changeTopColor(topbarColor: string) {
    this.topbar = topbarColor;
    this.store.dispatch(changeTopbar({ topbarColor }));
    this.store.select(getTopbarColor).subscribe((color) => {
      document.documentElement.setAttribute('data-topbar', color);
    });
  }

  changeSidebarSize(sidebarSize: string) {
    this.size = sidebarSize;
    this.store.dispatch(changeSidebarSize({ sidebarSize }));
    this.store.select(getSidebarSize).subscribe((size) => {
      document.documentElement.setAttribute('data-sidebar-size', size);
    });
  }

  changeSidebarColor(sidebarColor: string) {
    this.sidebar = sidebarColor;
    this.store.dispatch(changeSidebarColor({ sidebarColor }));
    this.store.select(getSidebarColor).subscribe((color) => {
      document.documentElement.setAttribute('data-sidebar', color);
    });
  }

  changeSidebarImage(sidebarImage: string) {
    this.sidebarImage = sidebarImage;
    this.store.dispatch(changeSidebarImage({ sidebarImage }));
    this.store.select(getSidebarImage).subscribe((image) => {
      document.documentElement.setAttribute('data-sidebar-image', image);
    });
  }

  changeLoader(preloader: string) {
    this.preLoader = preloader;
    this.store.dispatch(changeDataPreloader({ Preloader: preloader }));
    this.store.select(getPreloader).subscribe((loader) => {
      document.documentElement.setAttribute('data-preloader', loader);
    });

    const preloaderEl = document.getElementById('preloader');
    if (preloaderEl) {
      setTimeout(() => {
        const el = document.getElementById('preloader') as HTMLElement | null;
        if (!el) {
          return;
        }
        el.style.opacity = '0';
        el.style.visibility = 'hidden';
      }, 1000);
    }
  }
}
