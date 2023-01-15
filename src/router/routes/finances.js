import { Role } from '@/_helpers/role'

export default [
  {
    path: '/finances/cashflow',
    name: 'CashFlow',
    component: () => import('@/views/pages/finances/cashflow/MainComponent.vue'),
    meta: {
      pageTitle: 'CashFlow',
      authorize: [Role.Admin],
      breadcrumb: [
        {
          text: 'CashFlow',
          active: true,
        },
      ],
    },
  },
  {
    path: '/finances/salaries',
    name: 'Salaries',
    component: () => import('@/views/pages/finances/salaries/MainComponent.vue'),
    meta: {
      pageTitle: 'Salaries payout',
      authorize: [Role.Admin],
      breadcrumb: [
        {
          text: 'Salaries',
          active: true,
        },
      ],
    },
  },
]
