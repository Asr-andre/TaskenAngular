export const MENU_UNIFICADO = [
  {
    id: 1,
    label: 'MENU',
    isTitle: true,
  },
  {
    id: 3,
    label: 'Dashboards',
    icon: 'ri-dashboard-2-line',
    isCollapsed: true,
    subItems: [
      { id: 31, label: 'Painel', link: '/dashboard', parentId: 3, },
      { id: 32, label: 'Analytics', link: '/analytics', parentId: 3, },
      { id: 34, label: 'NFT', link: '/nft', parentId: 3, },
      { id: 35, label: 'Vagas', link: '/job', parentId: 3, },
      { id: 36, label: 'Blog', link: '/dashboard-blog', parentId: 3, },
    ],
  },
  {
    id: 17,
    label: 'Tickets',
    icon: 'ri-customer-service-2-line',
    isCollapsed: true,
    subItems: [
      { id: 171, label: 'Geral', link: '/tickets/list', parentId: 17 },
    ],
  },

  {
    id: 1000,
    label: 'Cadastro',
    icon: 'ri-file-list-3-line',
    isCollapsed: true,
    subItems: [
      { id: 1001, label: 'Cliente', link: '/cadastro/clientes', parentId: 1000, },
      { id: 1002, label: 'Operador', link: '/cadastro/operadores', parentId: 1000, },
      { id: 1003, label: 'Funcionário', link: '/cadastro/funcionarios', parentId: 1000, },
      { id: 1004, label: 'Indicação', link: '/cadastro/indicacoes', parentId: 1000, },
      { id: 1005, label: 'Cliente Grupo', link: '/cadastro/cliente-grupos', parentId: 1000, },
    ],
  },
  {
    id: 1100,
    label: 'Configuração',
    icon: 'ri-settings-3-line',
    link: '/configuracao',
  },
  {
    id: 3100,
    label: 'Widgets',
    icon: 'ri-layout-masonry-line',
    link: '/widgets',
  },
];
