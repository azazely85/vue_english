import { createStore } from 'vuex'

// Modules
import app from './app'
import appConfig from './app-config'
import verticalMenu from './vertical-menu'
import notes from './notes'

export default createStore({
  modules: {
    app,
    appConfig,
    verticalMenu,
    notes,
  },
  strict: process.env.NODE_ENV !== 'production',
})
