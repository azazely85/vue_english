<template>
  <b-card>
    <b-tabs
      content-class="pt-1"
    >
      <b-tab title="General">
        <client-info
          :client-info="clientInfo"
          @update-client-info="updateClientInfo"
        />
      </b-tab>
      <b-tab title="Projects">
        <projects-list
          :projects-data="clientProjects"
        />
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
import axios from 'axios'
import {
  BCard,
  BTabs,
  BTab,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useJwt from '@/auth/jwt/useJwt'
import { analysError } from '@/_helpers/analys_error'
import ClientInfo from '@/views/pages/work_pool/ClientInfo.vue'
import ProjectsList from '@/views/pages/projects/ProjectsList.vue'

export default {
  components: {
    BCard,
    BTabs,
    BTab,
    ClientInfo,
    ProjectsList,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      tabs: [
        { title: 'General', content: 'client' },
        { title: 'Projects', content: 'projects' },
      ],
      clientProjects: [],
      clientInfo: {},
      beforeUpdateClientInfo: {},
      menuData: [
        { icon: 'EditIcon', text: 'Edit' },
        { icon: 'DeleteIcon', text: 'Delete' },
      ],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      needUpdate: false,
      loading: false,
      newProjectData: {
        name: '',
        status: 0,
        contact_person: '',
        contract_type: '',
        billing_source: '',
        is_new: true,
      },
      isProjectEdit: false,
      projectEditable: 0,
      renderProjectsComponent: false,
      contentType: 'client',
    }
  },
  beforeMount() {
    this.getClientInfo()
  },
  methods: {
    updateClientInfo(clientData) {
      this.clientInfo = clientData
    },
    switchTab(content) {
      this.contentType = content
    },
    getClientInfo() {
      const clientId = this.$route.params.id
      axios.get(`${process.env.VUE_APP_API_URL}/client/${clientId}`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.clientInfo = { ...response.data.data[0] }
        this.clientProjects = this.clientInfo.projects
        this.loading = false
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
  #first_column {
    display: flex !important;
    justify-content: center !important;;
    flex-wrap: wrap !important;;
  }
}

@media (max-width: 500px) {
  #first_column_item {
    width: 50%;
  }
  #textarea_block {
    width: 62%;
  }
  #textarea_block .form-group {
    margin-left: 1rem!important;
    margin-right: 1rem;
  }
  #table_container {
    align-items: center;
  }
  #table_container .table-responsive {
    width:67%
  }
  #bottom_buttons_container {
    width: 55% !important;
  }
  #bottom_buttons_container button {
    width: auto !important
  }
}

</style>
