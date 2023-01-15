import Vue from 'vue'
import VueMoment from 'vue-moment'
import { ToastPlugin, ModalPlugin } from 'bootstrap-vue'
import VueCompositionAPI from '@vue/composition-api'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import router from './router'
import store from './store'
import App from './App.vue'

// Global Components
import './global-components'

// 3rd party plugins
import '@/libs/portal-vue'
import '@/libs/toastification'
import './registerServiceWorker'
import '@/libs/sweet-alerts'

// date picker
Vue.component('VueCtkDateTimePicker', VueCtkDateTimePicker)
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';

// BSV Plugin Registration
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)

// Composition API
Vue.use(VueCompositionAPI)

// moment
Vue.use(VueMoment)

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
