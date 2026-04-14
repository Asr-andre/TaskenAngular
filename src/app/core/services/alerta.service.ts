import { CommonModule, DOCUMENT } from '@angular/common';
import { ApplicationRef, Component, EnvironmentInjector, Inject, Injectable, createComponent } from '@angular/core';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

export type TipoAlerta = 'success' | 'error' | 'info' | 'warning';
export type TipoAlertaEntrada = TipoAlerta | 'sucesso' | 'erro' | 'aviso';

@Injectable({ providedIn: 'root' })
export class AlertaService {
  toasts: Array<{
    id: string;
    tipo: TipoAlerta;
    titulo: string;
    mensagem: string;
    classeCss: string;
    delay: number;
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
    const titulo = mensagemComplementar?.trim() ? mensagemComplementar.trim() : this.obterTituloPadrao(tipoNormalizado);

    this.criarHostSeNecessario();
    this.toasts.push({
      id: this.gerarId(),
      tipo: tipoNormalizado,
      titulo,
      mensagem: mensagemApi ?? '',
      classeCss: this.obterClasseCss(tipoNormalizado),
      delay
    });
  }

  remover(toast: { id: string }) {
    this.toasts = this.toasts.filter(t => t.id !== toast.id);
  }

  private obterTituloPadrao(tipo: TipoAlerta): string {
    switch (tipo) {
      case 'success':
        return 'Sucesso';
      case 'error':
        return 'Falha';
      case 'info':
        return 'Informação';
      case 'warning':
        return 'Aviso';
      default:
        return 'Alerta';
    }
  }

  private obterClasseCss(tipo: TipoAlerta): string {
    switch (tipo) {
      case 'success':
        return 'bg-success text-white';
      case 'error':
        return 'bg-danger text-white';
      case 'info':
        return 'bg-info text-white';
      case 'warning':
        return 'bg-warning text-dark';
      default:
        return 'bg-secondary text-white';
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
  imports: [CommonModule, NgbToastModule],
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1200">
      @for (toast of alerta.toasts; track $index) {
        <ngb-toast
          [class]="toast.classeCss"
          [autohide]="true"
          [delay]="toast.delay"
          (hidden)="alerta.remover(toast)"
        >
          <ng-template ngbToastHeader>
            <strong class="me-auto">{{ toast.titulo }}</strong>
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              (click)="alerta.remover(toast)"
            ></button>
          </ng-template>
          {{ toast.mensagem }}
        </ngb-toast>
      }
    </div>
  `
})
export class AlertasToastHostComponent {
  constructor(public alerta: AlertaService) {}
}
