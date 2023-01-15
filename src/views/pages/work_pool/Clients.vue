<template>
  <div>
    <clients-list/>
  </div>
</template>

<script>
import Ripple from 'vue-ripple-directive'
import axios from 'axios'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useJwt from '@/auth/jwt/useJwt'
import { analysError } from '@/_helpers/analys_error'
import ClientsList from '@/views/pages/work_pool/ClientsList.vue'

export default {
  components: {
    ClientsList,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      tabs: [
        { title: 'General', content: 'client' },
        { title: 'Projects', content: 'project' },
      ],
      contentType: 'client',
      showProjectInfo: false,
      showCreateClientModal: false,
      loading: true,
    }
  },
  methods: {
    switchTab(content) {
      this.contentType = content
    },
    createClient() {
      axios.post(`${process.env.VUE_APP_API_URL}/client`, this.newClientInfo, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        // this.clientsList = { ...response.data.data }
        this.$router.push({ name: 'Client-Info', params: { id: response.data.data } })
        this.$toast({
          component: ToastificationContent,
          position: 'top-right',
          props: {
            title: response.data.message,
            icon: 'CheckIcon',
            variant: 'success',
          },
        })
      }).catch(error => {
        const errorRes = analysError(error.response)
        const self = this
        errorRes.forEach(value => {
          self.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: value,
              icon: 'CoffeeIcon',
              variant: 'error',
            },
          })
        })
      })
    },
  },
}
</script>

<style scoped>

@media (max-width: 578px) {
  #clients_container {
    justify-content: center;
  }
}

</style>
