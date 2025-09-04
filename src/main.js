import { createApp } from 'vue'
import VueMoment from 'vue-moment'
import { ToastPlugin, ModalPlugin } from 'bootstrap-vue-next'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import router from './router'
import store from './store'
import App from './App.vue'

// Global Components
import './global-components'

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

// BSV Plugin Registration
app.use(ToastPlugin)
app.use(ModalPlugin)

// moment
app.use(VueMoment)

// Global component registration
app.component('VueCtkDateTimePicker', VueCtkDateTimePicker)

// Use router and store
app.use(router)
app.use(store)

app.mount('#app')
