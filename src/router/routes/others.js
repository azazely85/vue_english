import { Role } from '@/_helpers/role'

export default [
  {
    path: '/access-control',
    name: 'access-control',
    component: () => import('@/views/extensions/acl/AccessControl.vue'),
    meta: {
      authorize: [Role.Admin, Role.User],
    },
  },
]
