import { createApp } from 'vue'
import moment from 'moment'
import { ToastPlugin, ModalPlugin } from 'bootstrap-vue-next'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import FeatherIcon from '@core/components/feather-icon/FeatherIcon.vue'
import router from './router'
import store from './store'
import App from './App.vue'
import axiosIns from '@/libs/axios'

// 3rd party plugins
import '@/libs/toastification'
import './registerServiceWorker'
import '@/libs/sweet-alerts'

// date picker
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

const app = createApp(App)

// Vue 3: Set global properties
app.config.globalProperties.$http = axiosIns
app.config.globalProperties.$moment = moment

// BSV Plugin Registration
app.use(ToastPlugin)
app.use(ModalPlugin)

// Global component registration
app.component('VueCtkDateTimePicker', VueCtkDateTimePicker)
app.component(FeatherIcon.name, FeatherIcon)

// Use router and store
app.use(router)
app.use(store)

app.mount('#app')
