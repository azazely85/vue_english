import { createRouter, createWebHistory } from 'vue-router'

// Routes
import { getHomeRouteForLoggedInUser, getUserData } from '@/auth/utils'
import { Role } from '@/_helpers/role.js'
import dashboard from './routes/dashboard'
import pages from './routes/pages'
import others from './routes/others'

const root = getUserData() ? getHomeRouteForLoggedInUser(getUserData().role) : getHomeRouteForLoggedInUser(-1)

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior() {
    return { top: 0, left: 0 }
  },
  routes: [
    {
      path: '/learning',
      name: 'Learning',
      component: () => import('@/views/pages/learning/LearningHome.vue'),
      meta: {
        pageTitle: 'Learning',
        authorize: [Role.Admin],
        breadcrumb: [
          {
            text: 'Learning',
            active: true,
          },
        ],
      },
    },
    {
      path: '/learning/brain_storm',
      name: 'BrainStorm',
      component: () => import('@/views/pages/learning/BrainStorm.vue'),
      meta: {
        pageTitle: 'Brain Storm',
        authorize: [Role.Admin, Role.User],
        breadcrumb: [
          {
            text: 'Learning',
            active: false,
            to: '/learning',
          },
          {
            text: 'Brain Storm',
            active: true,
          },
        ],
      },
    },
    {
      path: '/learning/word_translate',
      name: 'WordTranslate',
      component: () => import('@/views/pages/learning/WordTranslate.vue'),
      meta: {
        pageTitle: 'Words Translate',
        authorize: [Role.Admin, Role.User],
        breadcrumb: [
          {
            text: 'Learning',
            active: false,
            to: '/learning',
          },
          {
            text: 'Word Translate',
            active: true,
          },
        ],
      },
    },
    {
      path: '/learning/translate_word',
      name: 'TranslateWord',
      component: () => import('@/views/pages/learning/TranslateWord.vue'),
      meta: {
        pageTitle: 'Translate Word',
        authorize: [Role.Admin, Role.User],
        breadcrumb: [
          {
            text: 'Learning',
            active: false,
            to: '/learning',
          },
          {
            text: 'Translate Word',
            active: true,
          },
        ],
      },
    },
    {
      path: '/learning/audio_train',
      name: 'AudioTrain',
      component: () => import('@/views/pages/learning/AudioTrain.vue'),
      meta: {
        pageTitle: 'Audio Train',
        authorize: [Role.Admin, Role.User],
        breadcrumb: [
          {
            text: 'Learning',
            active: false,
            to: '/learning',
          },
          {
            text: 'Audio Train',
            active: true,
          },
        ],
      },
    },
    {
      path: '/learning/repeat_train',
      name: 'RepeatTrain',
      component: () => import('@/views/pages/learning/RepeatTrain.vue'),
      meta: {
        pageTitle: 'Repeat Train',
        authorize: [Role.Admin, Role.User],
        breadcrumb: [
          {
            text: 'Learning',
            active: false,
            to: '/learning',
          },
          {
            text: 'Repeat Train',
            active: true,
          },
        ],
      },
    },
    {
      path: '/users',
      name: 'Users',
      component: () => import('@/views/pages/users/Users.vue'),
      meta: {
        pageTitle: 'Users',
        authorize: [Role.Admin],
      },
    },
    { path: '/', redirect: root },
    ...dashboard,
    ...pages,
    ...others,
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

router.beforeEach((to, _, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const { authorize } = to.meta
  const currentUser = getUserData()

  if (authorize) {
    if (!currentUser) {
      // not logged in so redirect to login page with the return url
      return next({ path: '/' })
    }

    // check if route is restricted by role
    if (authorize.length && !authorize.includes(currentUser.role)) {
      // role not authorised so redirect to home page
      return next({ name: 'misc-not-authorized' })
    }
  }

  return next()

  // const isLoggedIn = isUserLoggedIn()
  //
  // if (!canNavigate(to)) {
  //   // Redirect to login if not logged in
  //   if (!isLoggedIn) return next({ name: 'auth-login' })
  //
  //   // If logged in => not authorized
  //   return next({ name: 'misc-not-authorized' })
  // }
  //
  // // Redirect if logged in
  // if (to.meta.redirectIfLoggedIn && isLoggedIn) {
  //   const userData = getUserData()
  //   next(getHomeRouteForLoggedInUser(userData ? userData.role : null))
  // }
  //
  // return next()
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
