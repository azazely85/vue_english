export default [
  {
    path: '/error-404',
    name: 'error-404',
    component: () => import('@/views/error/Error404.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      action: 'read',
    },
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomePage.vue'),
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/login',
    name: 'auth-login',
    component: () => import('@/views/authentication/Login.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true,
    },
  },
  // {
  //   path: '/register',
  //   name: 'auth-register',
  //   component: () => import('@/views/pages/authentication/Register.vue'),
  //   meta: {
  //     layout: 'full',
  //     resource: 'Auth',
  //     redirectIfLoggedIn: true,
  //   },
  // },
  {
    path: '/pages/miscellaneous/not-authorized',
    name: 'misc-not-authorized',
    component: () => import('@/views/error/NotAuthorized.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
    },
  },
]
