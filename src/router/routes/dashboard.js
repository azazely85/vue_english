import { Role } from '@/_helpers/role'

export default [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard/Home.vue'),
    meta: {
      authorize: [Role.Admin],
    },
  },
]
