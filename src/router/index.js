import Vue from 'vue'
import VueRouter from 'vue-router'

// Routes
import { getHomeRouteForLoggedInUser, getUserData } from '@/auth/utils'
import { Role } from '@/_helpers/role.js'
import work_pool from '@/router/routes/work_pool'
import finances from '@/router/routes/finances'
import dashboard from './routes/dashboard'
import pages from './routes/pages'
import others from './routes/others'

const root = getUserData() ? getHomeRouteForLoggedInUser(getUserData().role) : getHomeRouteForLoggedInUser(-1)

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/learning',
      name: 'Learning',
      component: () => import('@/views/pages/learning/Learning.vue'),
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
      path: '/client-info/:id',
      name: 'Client-Info',
      component: () => import('@/views/pages/work_pool/ClientInfoMain.vue'),
      meta: {
        pageTitle: 'Client Info',
        authorize: [Role.Admin],
        breadcrumb: [
          {
            text: 'Clients',
            to: '/work-pool',
          },
          {
            text: 'Client Info',
            active: true,
          },
        ],
        parent: 'Clients',
      },
    },
    {
      path: '/comrades',
      name: 'WordsToLearn',
      component: () => import('@/views/pages/words_to_learn/WordsToLearn.vue'),
      meta: {
        pageTitle: 'Words To Learn',
        authorize: [Role.Admin],
        breadcrumb: [
          {
            text: 'Comrades',
            active: true,
          },
        ],
      },
    },
    {
      path: '/project-info/:id',
      name: 'Project-Info',
      component: () => import('@/views/pages/projects/ProjectInfo.vue'),
      meta: {
        pageTitle: 'Project Info',
        authorize: [Role.Admin],
        breadcrumb: [
          {
            text: 'Clients',
            to: '/work-pool',
          },
          {
            text: 'Project Info',
            active: true,
          },
        ],
        parent: 'Clients',
      },
    },
    {
      path: '/comrade-info/:id',
      name: 'Comrade-Info',
      component: () => import('@/views/pages/comrades/Comrade/ComradeMain.vue'),
      meta: {
        pageTitle: 'Comrade Info',
        authorize: [Role.Admin],
        breadcrumb: [
          {
            text: 'Comrades',
            to: '/comrades',
          },
          {
            text: 'Comrade Info',
            active: true,
          },
        ],
        parent: 'Comrades',
      },
    },
    {
      path: '/interviews/settings',
      name: 'InterviewsSettings',
      component: () => import('@/views/pages/interviews/Setting.vue'),
      meta: {
        pageTitle: 'Interviews Settings',
        authorize: [Role.Admin],
      },
    },
    {
      path: '/interviews/candidate/:hash',
      name: 'CandidateInterview',
      component: () => import('@/views/pages/interviews/CandidateInterviewForm.vue'),
      meta: {
        pageTitle: 'Interview',
        authorize: [Role.Admin],
      },
    },
    {
      path: '/reports/comrades',
      name: 'Reports-Comrades',
      component: () => import('@/views/pages/reporting/Reporting.vue'),
      meta: {
        pageTitle: 'Comrades Report (Hubstaff/Upwork)',
        authorize: [Role.Admin],
      },
    },
    {
      path: '/reports/projects',
      name: 'Reports-Projects',
      component: () => import('@/views/pages/reports/Projects.vue'),
      meta: {
        pageTitle: 'Projects For Report',
        authorize: [Role.Admin],
      },
    },
    {
      path: '/reports/workload',
      name: 'Reports-Workloads',
      component: () => import('@/views/pages/reports/Workloads.vue'),
      meta: {
        pageTitle: 'Workload and Salaries (Hubstaff/Upwork)',
        authorize: [Role.Admin, Role.User],
      },
    },
    {
      path: '/reports/projects/project/:id',
      name: 'Reports-Projects-Project',
      component: () => import('@/views/pages/reports/Project.vue'),
      meta: {
        pageTitle: 'Activities Report (ClickUp)',
        authorize: [Role.Admin],
        breadcrumb: [
          {
            text: 'Projects reports',
            to: '/reports/projects',
          },
          {
            text: 'Activities Report',
            active: true,
          },
        ],
      },
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/pages/settings/Settings.vue'),
      meta: {
        pageTitle: 'Settings',
        authorize: [Role.Admin],
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
    ...finances,
    ...work_pool,
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
