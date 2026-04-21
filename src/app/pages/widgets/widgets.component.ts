import { Component, OnInit } from '@angular/core';

type StatCard = {
  title: string;
  value: string;
  icon: string;
  persantage: string;
  profit: string;
  link: string;
};

@Component({
  selector: 'app-widgets',
  standalone: false,
  template: `
    <app-breadcrumbs title="Widgets" [breadcrumbItems]="breadCrumbItems"></app-breadcrumbs>

    <div class="row">
      @for (item of stats; track item.title) {
        <div class="col-xxl-3 col-md-6">
          <div class="card card-animate">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-grow-1 overflow-hidden">
                  <p class="text-uppercase fw-medium text-muted text-truncate mb-0">{{ item.title }}</p>
                </div>
                <div class="flex-shrink-0">
                  <h5
                    class="fs-14 mb-0"
                    [ngClass]="{ 'text-success': item.profit === 'up', 'text-danger': item.profit === 'down', 'text-muted': item.profit === 'equal' }"
                  >
                    <i
                      class="fs-13 align-middle float-start"
                      [ngClass]="{ 'ri-arrow-right-up-line': item.profit === 'up', 'ri-arrow-right-down-line': item.profit === 'down' }"
                    ></i>
                    @if (item.profit === 'up' || item.profit === 'equal') { <span>+</span> } @else { <span>-</span> }
                    {{ item.persantage }}
                  </h5>
                </div>
              </div>
              <div class="d-flex align-items-end justify-content-between mt-4">
                <div>
                  <h4 class="fs-22 fw-semibold ff-secondary mb-3">{{ item.value }}</h4>
                  <a [routerLink]="item.link" class="text-decoration-underline">Ver detalhes</a>
                </div>
                <div class="avatar-sm flex-shrink-0">
                  <span class="avatar-title rounded fs-3 bg-primary-subtle">
                    <i class="{{ item.icon }} text-primary"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>

    <div class="row">
      <div class="col-xxl-6">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title mb-0">Top páginas</h4>
          </div>
          <div class="card-body">
            <div class="table-responsive table-card">
              <table class="table align-middle table-borderless table-centered table-nowrap mb-0">
                <thead class="text-muted table-light">
                  <tr>
                    <th scope="col">Página</th>
                    <th scope="col">Ativo</th>
                    <th scope="col">Usuários</th>
                  </tr>
                </thead>
                <tbody>
                  @for (data of topPages; track $index) {
                    <tr>
                      <td><a href="javascript:void(0);">{{ data.page }}</a></td>
                      <td>{{ data.active }}</td>
                      <td>{{ data.users }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xxl-6">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title mb-0">Status</h4>
          </div>
          <div class="card-body">
            <div class="table-responsive table-card">
              <table class="table table-borderless table-hover table-nowrap align-middle mb-0">
                <thead class="table-light">
                  <tr class="text-muted">
                    <th scope="col">Etapa</th>
                    <th scope="col">Data</th>
                    <th scope="col">Responsável</th>
                    <th scope="col">Status</th>
                    <th scope="col">Progresso</th>
                  </tr>
                </thead>
                <tbody>
                  @for (data of dealsStatus; track $index) {
                    <tr>
                      <td>{{ data.name }}</td>
                      <td>{{ data.date }}</td>
                      <td>{{ data.userName }}</td>
                      <td>{{ data.status }}</td>
                      <td>{{ data.value }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class WidgetsComponent implements OnInit {
  breadCrumbItems!: Array<{}>;

  stats: StatCard[] = [
    {
      title: 'Chamados abertos',
      value: '12',
      icon: 'ri-ticket-2-line',
      persantage: '+3.1%',
      profit: 'up',
      link: '/tickets/list',
    },
    {
      title: 'Clientes ativos',
      value: '48',
      icon: 'ri-user-3-line',
      persantage: '+0.8%',
      profit: 'up',
      link: '/cadastro/clientes',
    },
    {
      title: 'Tickets fechados',
      value: '7',
      icon: 'ri-checkbox-circle-line',
      persantage: '-1.2%',
      profit: 'down',
      link: '/tickets/list',
    },
    {
      title: 'SLA no prazo',
      value: '96%',
      icon: 'ri-timer-2-line',
      persantage: '+0.4%',
      profit: 'up',
      link: '/dashboard',
    },
  ];

  topPages = [
    { page: '/tickets/list', active: '1m', users: '132' },
    { page: '/cadastro/clientes', active: '2m', users: '84' },
    { page: '/dashboard', active: '45s', users: '61' },
  ];

  dealsStatus = [
    { name: 'Integração', date: '2026-04-21', userName: 'Equipe', status: 'Em andamento', value: '40%' },
    { name: 'Homologação', date: '2026-04-21', userName: 'Equipe', status: 'Pendente', value: '20%' },
    { name: 'Produção', date: '2026-04-21', userName: 'Equipe', status: 'Concluído', value: '40%' },
  ];

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Componentes' }, { label: 'Widgets', active: true }];
  }
}
