<template>
  <div>
    <b-card>
      <b-row class="mb-2 mx-0 p-0">
        <b-col
          cols="12"
          sm="4"
          class="p-0"
        />
        <b-col
          cols="12"
          sm="8"
          class="d-flex p-0 justify-content-end"
        >
          <div class="d-flex align-items-center">
            <b-form-select
              v-model="selected"
              :options="options"
              size="md"
              @change="getContracts"
            />
          </div>
        </b-col>
      </b-row>
      <b-overlay
        :show="loading"
        spinner-type="grow"
        spinner-variant="primary"
        :variant="`transparent`"
        :opacity="1"
        :blur="`2px`"
        rounded="sm"
      >
        <crud-table
          :create-endpoint="`contracts`"
          :update-endpoint="`contracts`"
          :delete-endpoint="`contracts`"
          :empty-item="{}"
          :table-fields="fields"
          :table-items="contracts"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :data-as-select="['comrade', 'project']"
          :data-for-select="dataForSelect"
          :not-editable-data="['type', 'tracked_mtd', 'tracked_last_30_days']"
          :required-fields="['title', 'comrade', 'project']"
          :show-create-item="false"
        />
      </b-overlay>
      <b-col
        cols="12"
      >
        <b-pagination
          v-if="contracts.length > 0"
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="center"
          size="sm"
          class="my-0"
          @change="pagination"
        />
      </b-col>
    </b-card>
  </div>
</template>

<script>
import {
  BTable,
  BRow,
  BCol,
  BFormSelect,
  VBTooltip,
  BCard,
  BPagination, BOverlay,
} from 'bootstrap-vue-next'
import Ripple from 'vue-ripple-directive'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { analysError } from '@/_helpers/analys_error'
import axiosIns from '@/libs/axios'
import CrudTable from '@/views/HelperComponents/CrudTable'
import axios from 'axios'
import useJwt from '@/auth/jwt/useJwt'

export default {
  components: {
    BTable,
    BCol,
    BRow,
    BCard,
    BFormSelect,
    BPagination,
    BOverlay,
    CrudTable,
  },
  directives: {
    Ripple,
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      filteredContracts: [],
      contracts: [],
      fields: [
        {
          key: 'title',
          label: 'Contract Name',
          sortable: true,
          tdClass: 'text-center ml-2',
          thClass: 'text-center',
        },
        {
          key: 'type',
          label: 'Source',
          sortable: false,
          tdClass: 'text-center ml-2',
          thClass: 'text-center',
        },
        {
          key: 'comrade',
          label: 'Comrade',
          sortable: true,
          tdClass: 'text-center ml-2',
          thClass: 'text-center',
        },
        {
          key: 'project',
          label: 'Project',
          sortable: true,
          tdClass: 'text-center ml-2',
          thClass: 'text-center',
        },
        {
          key: 'tracked_mtd',
          label: 'Tracked MTD',
          sortable: true,
          tdClass: 'text-center ml-2',
          thClass: 'text-center',
        },
        {
          key: 'tracked_last_30_days',
          label: 'Tracked Last 30d',
          sortable: true,
          tdClass: 'text-center ml-2',
          thClass: 'text-center',
        },
        {
          key: 'actions',
          label: 'Actions',
          sortable: false,
          tdClass: 'text-center',
          thClass: 'text-center',
          thStyle: 'width: 10%',
        },
      ],
      sortBy: 'title',
      sortDesc: false,
      sortDirection: 'asc',
      loading: false,
      selected: null,
      options: [
        { value: null, text: 'All' },
        { value: 'Hubstaff', text: 'Hubstaff' },
        { value: 'Upwork', text: 'Upwork' },
      ],
      perPage: 15,
      totalRows: 0,
      currentPage: 1,
      dataForSelect: {},
      projects: [],
      comrades: [],
    }
  },
  watch: {
    currentPage() {
      this.getContracts()
    },
  },
  beforeMount() {
    this.getProjects()
    this.getComradesList()
    this.getContracts()
  },
  methods: {
    pagination(value) {
      this.currentPage = value
    },
    getComradesList() {
      axios.get(`${process.env.VUE_APP_API_URL}/comrade`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.comrades = response.data.data
        this.dataForSelect.comrade = {
          options: this.comrades,
          label: 'name',
          reduce: item => item,
        }
        // payment_type: { options: this.defaultPaymentTypes, reduce: item => item },
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
    getProjects() {
      axiosIns.get('/project').then(response => {
        this.projects = response.data.data
        this.dataForSelect.project = {
          options: this.projects,
          label: 'name',
          reduce: item => item,
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
    getContracts() {
      this.loading = true
      let params = `?page=${this.currentPage}&perPage=${this.perPage}`
      if (this.selected) {
        params += `&filter=${this.selected}`
      }
      axiosIns
        .get(`${process.env.VUE_APP_API_URL}/contracts${params}`)
        .then(response => {
          this.loading = false
          this.contracts = response.data.data.data
          this.totalRows = response.data.data.total
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
  },
}
</script>

<style scoped></style>
