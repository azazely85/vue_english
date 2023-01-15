import { Role } from '@/_helpers/role'

export default [
  {
    path: '/work-pool/projects',
    name: 'Work-Pool-Projects',
    component: () => import('@/views/pages/work_pool/projects/Projects.vue'),
    meta: {
      pageTitle: 'Projects',
      authorize: [Role.Admin],
      breadcrumb: [
        {
          text: 'Work Pool',
          to: '/work-pool',
        },
        {
          text: 'Projects',
          active: true,
        },
      ],
    },
  },
  {
    path: '/work-pool/contracts',
    name: 'Work-Pool-Contracts',
    component: () => import('@/views/pages/work_pool/contracts/Contracts.vue'),
    meta: {
      pageTitle: 'Contracts',
      authorize: [Role.Admin],
      breadcrumb: [
        {
          text: 'Work Pool',
          to: '/work-pool',
        },
        {
          text: 'Contracts',
          active: true,
        },
      ],
    },
  },
  {
    path: '/work-pool/contracts/unconfirmed',
    name: 'Work-Pool-Unconfirmed-Contracts',
    component: () => import('@/views/pages/work_pool/contracts/unconfirmed/Contracts.vue'),
    meta: {
      pageTitle: 'Unconfirmed Contracts',
      authorize: [Role.Admin],
      breadcrumb: [
        {
          text: 'Work Pool',
          to: '/work-pool',
        },
        {
          text: 'Unconfirmed Contracts',
          active: true,
        },
      ],
    },
  },
]
