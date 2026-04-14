import { CommonModule, DOCUMENT } from '@angular/common';
import { ApplicationRef, Component, EnvironmentInjector, Inject, Injectable, createComponent } from '@angular/core';

export type TipoAlerta = 'success' | 'error' | 'info' | 'warning' | 'primary';
export type TipoAlertaEntrada = TipoAlerta | 'sucesso' | 'erro' | 'aviso' | 'primario';

@Injectable({ providedIn: 'root' })
export class AlertaService {
  toasts: Array<{
    id: string;
    tipo: TipoAlerta;
    visivel: boolean;
    titulo: string;
    mensagemApi: string;
    mensagemComplementar?: string;
    classeAlerta: string;
    icone: string;
    delay: number;
    timeoutOcultar?: number;
    timeoutRemover?: number;
  }> = [];

  private hostCriado = false;

  constructor(
    private appRef: ApplicationRef,
    private environmentInjector: EnvironmentInjector,
    @Inject(DOCUMENT) private document: Document
  ) { }

  exibir(
    tipo: TipoAlertaEntrada,
    mensagemApi: string,
    mensagemComplementar?: string,
    delay: number = 3000
  ) {
    const tipoNormalizado = this.normalizarTipo(tipo);
    const titulo = this.obterTituloPadrao(tipoNormalizado);

    this.criarHostSeNecessario();
    const toast = {
      id: this.gerarId(),
      tipo: tipoNormalizado,
      visivel: true,
      titulo,
      mensagemApi: mensagemApi ?? '',
      mensagemComplementar: mensagemComplementar?.trim() ? mensagemComplementar.trim() : undefined,
      classeAlerta: this.obterClasseAlerta(tipoNormalizado),
      icone: this.obterIcone(tipoNormalizado),
      delay,
      timeoutOcultar: undefined as number | undefined,
      timeoutRemover: undefined as number | undefined
    };

    toast.timeoutOcultar = window.setTimeout(() => {
      this.fechar(toast.id);
    }, delay);

    this.toasts.push(toast);
  }

  fechar(id: string) {
    const toast = this.toasts.find(t => t.id === id);
    if (!toast) return;

    if (toast.timeoutOcultar) {
      clearTimeout(toast.timeoutOcultar);
      toast.timeoutOcultar = undefined;
    }
    if (toast.timeoutRemover) {
      clearTimeout(toast.timeoutRemover);
      toast.timeoutRemover = undefined;
    }

    toast.visivel = false;
    toast.timeoutRemover = window.setTimeout(() => {
      this.remover(id);
    }, 250);
  }

  remover(id: string) {
    const toast = this.toasts.find(t => t.id === id);
    if (toast?.timeoutOcultar) clearTimeout(toast.timeoutOcultar);
    if (toast?.timeoutRemover) clearTimeout(toast.timeoutRemover);
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  private obterTituloPadrao(tipo: TipoAlerta): string {
    switch (tipo) {
      case 'success':
        return 'Sucesso!';
      case 'error':
        return 'Error!';
      case 'info':
        return 'Informação';
      case 'warning':
        return 'Atenção!';
      case 'primary':
        return 'Tudo certo!';
      default:
        return 'Alerta';
    }
  }

  private obterClasseAlerta(tipo: TipoAlerta): string {
    switch (tipo) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-danger';
      case 'info':
        return 'alert-info';
      case 'warning':
        return 'alert-warning';
      case 'primary':
        return 'alert-primary';
      default:
        return 'alert-secondary';
    }
  }

  private obterIcone(tipo: TipoAlerta): string {
    switch (tipo) {
      case 'success':
        return 'ri-notification-off-line';
      case 'error':
        return 'ri-error-warning-line';
      case 'info':
        return 'ri-information-line';
      case 'warning':
        return 'ri-alert-line';
      case 'primary':
        return 'ri-user-smile-line';
      default:
        return 'ri-notification-3-line';
    }
  }

  private normalizarTipo(tipo: TipoAlertaEntrada): TipoAlerta {
    switch (tipo) {
      case 'sucesso':
        return 'success';
      case 'erro':
        return 'error';
      case 'aviso':
        return 'warning';
      case 'primario':
        return 'primary';
      default:
        return tipo;
    }
  }

  private gerarId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  private criarHostSeNecessario() {
    if (this.hostCriado) return;

    const hostElement = this.document.createElement('app-alertas-toast-host');
    this.document.body.appendChild(hostElement);

    const componentRef = createComponent(AlertasToastHostComponent, {
      environmentInjector: this.environmentInjector,
      hostElement
    });

    this.appRef.attachView(componentRef.hostView);
    this.hostCriado = true;
  }
}

@Component({
  selector: 'app-alertas-toast-host',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="position-fixed top-0 end-0 p-3 d-flex flex-column gap-2" style="z-index: 1200; width: 420px; max-width: calc(100vw - 1.5rem);">
      @for (toast of alerta.toasts; track $index) {
        <div
          class="alert alert-dismissible alert-additional fade"
          [ngClass]="[toast.classeAlerta, toast.visivel ? 'show' : '']"
          role="alert"
        >
          <div class="alert-body">
            <button type="button" class="btn-close" aria-label="Close" (click)="alerta.fechar(toast.id)"></button>
            <div class="d-flex">
              <div class="flex-shrink-0 me-3">
                <i [class]="toast.icone + ' fs-16 align-middle'"></i>
              </div>
              <div class="flex-grow-1">
                <h5 class="alert-heading">{{ toast.titulo }}</h5>
                <p class="mb-0">{{ toast.mensagemApi }}</p>
              </div>
            </div>
          </div>
          @if (toast.mensagemComplementar) {
            <div class="alert-content">
              <p class="mb-0">{{ toast.mensagemComplementar }}</p>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class AlertasToastHostComponent {
  constructor(public alerta: AlertaService) {}
}
