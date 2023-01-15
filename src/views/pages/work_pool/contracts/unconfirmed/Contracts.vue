<template>
  <div>
    <b-row
      class="d-flex justify-content-end"
    >
      <b-button
        :disabled="loading"
        variant="link"
        @click="getUnconfirmedContracts"
      >
        <feather-icon
          icon="RefreshCwIcon"
          size="22"
          class="cursor-pointer"
        />
      </b-button>
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
      <b-table
        :items="contracts"
        :fields="fields"
        show-empty
        responsive
      >
        <template #empty="scope">
          <h4>There are not exists any of unconfirmed contract</h4>
        </template>
        <template
          #cell(tracked_YTD)="data"
        >
          {{ secToTime(data.value) }}
        </template>
        <template
          #cell(action)="data"
        >
          <b-button
            :disabled="loading"
            variant="primary"
            @click="checkComrade(data.item)"
          >
            Attach Contract
          </b-button>
        </template>
      </b-table>
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
    <b-modal
      closable="true"
      centered
      :visible="modalShow"
      size="lg"
      title="Fill information"
      hide-footer
      no-close-on-backdrop
      @close="(val) => this.modalShow = val"
      @change="(val) => this.modalShow = val"
    >
      <b-row
        v-if="modalLoading"
        class="d-flex justify-content-center"
      >
        <b-spinner
          variant="primary"
        />
      </b-row>
      <b-row
        v-else
      >
        <b-col
          cols="12"
          lg="4"
          md="5"
          sm="12"
        >
          <b-form-group
            :state="attachableContract.hasOwnProperty('project_id') && attachableContract.project_id > 0"
          >
            <label
              for="projectSelect"
              class="mr-sm-2"
            >
              Project
            </label>
            <v-select
              id="projectSelect"
              v-model="attachableContract.project_id"
              :clearable="false"
              single-line
              :options="projects"
              :reduce="item => item.id"
              label="name"
              class="mb-2 mr-sm-2 mb-sm-0"
            />
          </b-form-group>
        </b-col>
        <b-col
          cols="12"
          lg="4"
          md="5"
          sm="12"
        >
          <b-form-group
            :state="Boolean(attachableContract.payment_type)"
          >
            <label
              for="paymentTypeSelect"
              class="mr-sm-2"
            >
              Payment Type
            </label>
            <v-select
              id="paymentTypeSelect"
              v-model="attachableContract.payment_type"
              :clearable="false"
              single-line
              :options="attachableContract.type === 'Hubstaff' ? hubstaffPaymentTypes : upworkPaymentTypes"
              :reduce="item => item"
              label="name"
              class="mb-2 mr-sm-2 mb-sm-0"
            />
          </b-form-group>
        </b-col>
        <b-col
          cols="12"
          sm="12"
          lg="2"
          md="2"
        >
          <b-form-group>
            <label for="rateInput">Rate</label>
            <b-form-input
              id="rateInput"
              v-model="attachableContract.rate"
              :state="attachableContract.hasOwnProperty('rate') && attachableContract.rate > 0"
              type="number"
              class="mb-2 mr-sm-2 mb-sm-0"
            />
          </b-form-group>
        </b-col>
        <b-col
          cols="12"
          lg="2"
          md="2"
          class="d-flex align-content-center p-1"
        >
          <b-button
            variant="success"
            @click="attachContract()"
          >
            Attach
          </b-button>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import {
  BTable, BCol, BOverlay, BPagination, BButton, BModal, BSpinner, BRow, BFormGroup, BFormInput,
} from 'bootstrap-vue'
import axiosIns from '@/libs/axios'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { analysError } from '@/_helpers/analys_error'
import { secToTime } from '@/_helpers/time'
import vSelect from 'vue-select'
import { hubstaffPaymentTypes, upworkPaymentTypes } from '@/_helpers/payments_types'
import axios from 'axios'
import useJwt from '@/auth/jwt/useJwt'

export default {
  components: {
    BTable,
    BCol,
    BOverlay,
    BPagination,
    BButton,
    BModal,
    BSpinner,
    BRow,
    BFormGroup,
    BFormInput,

    vSelect,
  },
  data() {
    return {
      contracts: [],
      loading: false,
      fields: [
        {
          key: 'title',
          label: 'Contract',
          tdClass: 'text-center',
          thClass: 'text-center',
          sortable: true,
        },
        {
          key: 'comrade',
          label: 'Comrade',
          tdClass: 'text-center',
          thClass: 'text-center',
          sortable: true,
        },
        {
          key: 'type',
          label: 'Source',
          tdClass: 'text-center',
          thClass: 'text-center',
          sortable: true,
        },
        {
          key: 'tracked_YTD',
          label: 'tracked YTD',
          tdClass: 'text-center',
          thClass: 'text-center',
        },
        {
          key: 'action',
          label: 'Action',
          tdClass: 'text-center',
          thClass: 'text-center',
        },
      ],
      perPage: 15,
      totalRows: 0,
      currentPage: 1,
      modalShow: false,
      projects: [],
      projectToAttach: 0,
      modalLoading: false,
      attachableContract: {},
      hubstaffPaymentTypes,
      upworkPaymentTypes,
    }
  },
  watch: {
    currentPage() {
      this.getUnconfirmedContracts()
    },
    modalShow(newVal) {
      if (newVal) {
        this.getProjects()
        return
      }
      this.attachableContract = {}
    },
  },
  beforeMount() {
    this.getUnconfirmedContracts()
  },
  methods: {
    attachContract() {
      this.modalLoading = true
      axios.post(`${process.env.VUE_APP_API_URL}/attach/contract`, this.attachableContract, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.attachableContract = {}
        this.modalLoading = false
        this.modalShow = false
        this.getUnconfirmedContracts()
      }).catch(error => {
        this.modalLoading = false
        const errorRes = analysError(error.response)
        const self = this
        errorRes.forEach(value => {
          self.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: value,
              icon: 'XIcon',
              variant: 'danger',
            },
          })
        })
      })
    },
    getProjects() {
      this.modalLoading = true
      axiosIns.get('/project').then(response => {
        this.modalLoading = false
        this.projects = response.data.data
      }).catch(error => {
        this.modalLoading = false
        const errorRes = analysError(error.response)
        const self = this
        errorRes.forEach(value => {
          self.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: value,
              icon: 'XIcon',
              variant: 'danger',
            },
          })
        })
      })
    },
    checkComrade(contractData) {
      this.loading = true
      axiosIns(`/exists/comrade?name=${contractData.comrade}`).then(response => {
        this.loading = false
        if (!response.data.data) {
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: response.data.message,
              icon: 'XIcon',
              variant: 'danger',
            },
          })
          return
        }
        this.attachableContract = contractData
        this.modalShow = true
      }).catch(error => {
        this.loading = false
        const errorRes = analysError(error)
        const self = this
        errorRes.forEach(value => {
          self.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: value,
              icon: 'XIcon',
              variant: 'danger',
            },
          })
        })
      })
    },
    pagination(value) {
      this.currentPage = value
    },
    secToTime,
    getUnconfirmedContracts() {
      this.loading = true
      const params = `?page=${this.currentPage}&perPage=${this.perPage}`
      axiosIns(`/unconfirmed/contracts${params}`).then(response => {
        this.contracts = response.data.data.data
        this.totalRows = response.data.data.total
        this.loading = false
      }).catch(error => {
        this.loading = false
        const errorRes = analysError(error)
        const self = this
        errorRes.forEach(value => {
          self.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: value,
              icon: 'XIcon',
              variant: 'danger',
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
