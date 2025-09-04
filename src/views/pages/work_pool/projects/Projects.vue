<template>
  <b-card>
    <div>
      <b-overlay
        :show="loading"
        spinner-type="grow"
        spinner-variant="primary"
        :variant="`transparent`"
        :opacity="1"
        :blur="`2px`"
        rounded="sm"
      >
        <b-table
          sticky-header="700px"
          :items="projects"
          :fields="fields"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          :busy="loading"
          responsive
          hover
          show-empty
          @row-clicked="toggleDetails"
        >
          <template #empty="scope">
            <h4>{{ scope.emptyText }}</h4>
          </template>
          <template
            #cell(name)="data"
          >
            <b-form-input
              v-if="data.item.is_new"
              v-model="data.item.name"
            />

            <span v-else>{{ data.item.name }}</span>
          </template>
          <template
            #cell(client)="data"
          >
            <v-select
              v-if="data.item.is_new"
              v-model="data.item.client_id"
              single-line
              dir="ltr"
              :options="clientsList"
              label="name"
              :close-on-select="true"
              :reduce="item => item.id"
            />

            <span v-else>{{ data.item.client.name }}</span>
          </template>
          <template
            #row-details="row"
          >
            <contracts-list
              v-if="!row.item.hasOwnProperty('is_new')"
              :contracts="row.item.contracts"
              :project-id="row.item.id"
              :data-for-select="dataForSelect"
            />
          </template>
          <template #cell(actions)="data">
            <b-form-group
              v-if="data.item.is_new"
            >
              <feather-icon
                v-for="action in confirmActions"
                :id="action.text + data.item.id"
                :key="action.text"
                :icon="action.icon"
                class="mr-50"
                size="20"
                @click="selectAction(action.text, action.icon, data.item)"
              />
            </b-form-group>
          </template>
        </b-table>
      </b-overlay>
      <b-row
        class="d-flex justify-content-center"
      >
        <b-button
          class="rounded"
          variant="primary"
          @click="selectAction('Insert', '+', {})"
        >
          +
        </b-button>
      </b-row>
    </div>
  </b-card>
</template>

<script>
import axiosIns from '@/libs/axios'
import {
  BTable, BRow, VBTooltip, BButton, BFormInput, BFormGroup, BCard, BOverlay,
} from 'bootstrap-vue-next'
import Ripple from 'vue-ripple-directive'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { analysError } from '@/_helpers/analys_error'
import ContractsList from '@/views/pages/projects/ContractsList.vue'
import axios from 'axios'
import useJwt from '@/auth/jwt/useJwt'
import vSelect from 'vue-select'

export default {
  components: {
    BTable,
    BRow,
    ContractsList,
    BButton,
    BFormInput,
    BFormGroup,
    vSelect,
    BCard,
    BOverlay,
  },
  directives: {
    Ripple,
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      projects: [],
      fields: [
        {
          key: 'name',
          label: 'Name',
          sortable: true,
          tdClass: 'text-center ml-2',
          thClass: 'text-center',
        },
        {
          key: 'client',
          label: 'Client',
          sortable: true,
          tdClass: 'text-center ml-2',
          thClass: 'text-center',
        },
        {
          key: 'tracked_MTD',
          label: 'Tracked MTD',
          tdClass: 'd-flex justify-content-center',
          thClass: 'text-center',
        },
        {
          key: 'tracked_YTD',
          label: 'Tracked YTD',
          tdClass: 'text-center ml-2',
          thClass: 'text-center',
        },
        {
          key: 'tracked_last_30_days',
          label: 'Tracked 30D',
          tdClass: 'text-center ml-2',
          thClass: 'text-center',
        },
        {
          key: 'actions',
          label: 'Actions',
          tdClass: 'text-center ml-2',
          thClass: 'text-center',
        },
      ],
      defaultActions: [
        { icon: 'EditIcon', text: 'Edit' },
        { icon: 'DeleteIcon', text: 'Delete' },
      ],
      confirmActions: [
        { icon: 'CheckIcon', text: 'Confirm' },
        { icon: 'XIcon', text: 'Cancel' },
      ],
      sortBy: 'name',
      sortDesc: false,
      sortDirection: 'asc',
      loading: false,
      comrades: [],
      dataForSelect: {},
      defaultPaymentTypes: [
        'hourly', 'monthly', 'fixed price',
      ],
      emptyProject: {
        name: '',
        client: '',
        status: true,
        tracked_MTD: 0,
        tracked_YTD: 0,
        tracked_last_30_days: 0,
        is_new: true,
      },
      clientsList: [],
    }
  },
  beforeMount() {
    this.getClientsList()
    this.getComradesList()
    this.getProjects()
  },
  methods: {
    getClientsList() {
      axios.get(`${process.env.VUE_APP_API_URL}/client`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.clientsList = response.data.data
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
    getComradesList() {
      axios.get(`${process.env.VUE_APP_API_URL}/comrade`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.comrades = response.data.data
        this.dataForSelect = {
          comrade: {
            options: this.comrades,
            label: 'name',
            reduce: item => item,
          },
          payment_type: { options: this.defaultPaymentTypes, reduce: item => item },
        }
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
    toggleDetails(item) {
      if (item._showDetails) item._showDetails = false
      else this.$set(item, '_showDetails', true)
    },
    selectAction(actionText, actionIcon, target) {
      switch (actionText) {
        case 'Edit':
          this.$set(target, 'edited', true)
          break

        case 'Confirm':
          if (target.edited) {
            this.update(target)
            break
          }
          this.create(target)
          break

        case 'Cancel':
          if (target.is_new) {
            const index = this.projects.indexOf(target)
            this.projects.splice(index, 1)
          }
          break

        case 'Delete':
          this.delete(target.id)
          break

        case 'Insert':
          this.projects.push({ ...this.emptyProject })
          break

        default:
          console.log('Default')
          break
      }
    },
    create(data) {
      this.loading = true
      axiosIns
        .post(`${process.env.VUE_APP_API_URL}/project`, data)
        .then(response => {
          this.loading = false
          const createdItem = this.projects.find(item => item === data)
          this.$delete(createdItem, 'is_new')
          this.projects[this.projects.indexOf(data)] = { ...response.data.data }
        })
        .catch(error => {
          this.loading = false
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
    getProjects() {
      axiosIns('/project?forWorkPool')
        .then(response => {
          this.projects = response.data.data
        })
        .catch(error => {
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

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>

<style>
.vs__dropdown-menu{
  position: fixed !important;
  top: auto !important;
  left: auto !important;
  width: inherit !important;
  overflow-y: auto !important;
  max-height: 200px !important;
}
</style>
