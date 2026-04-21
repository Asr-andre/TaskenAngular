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
          <app-stat
            [title]="item.title"
            [value]="item.value"
            [icon]="item.icon"
            [persantage]="item.persantage"
            [profit]="item.profit"
            [link]="item.link"
          ></app-stat>
        </div>
      }
    </div>

    <div class="row">
      <div class="col-xxl-6">
        <app-top-pages [TopPages]="topPages"></app-top-pages>
      </div>
      <div class="col-xxl-6">
        <app-deals-status [DealsStatus]="dealsStatus"></app-deals-status>
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
      title: 'Projetos',
      value: '7',
      icon: 'ri-folder-3-line',
      persantage: '-1.2%',
      profit: 'down',
      link: '/projects/list',
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
    { page: '/projects/list', active: '45s', users: '61' },
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

