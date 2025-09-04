<template>
  <b-card>
    <b-card-body>
      <b-row>
        <b-col
          cols="12"
          sm="4"
        >
          <b-row
            v-for="button in buttonsMTD"
            :key="button.title"
            class="mb-1"
          >
            <b-col
              cols="12"
              class="d-flex align-items-center"
            >
              <b-button
                :variant="button.variant"
                class="mr-2"
                :disabled="button.loading"
                style="width: 20rem"
                @click="get(button)"
              >
                {{ button.title }}
              </b-button>
              <b-spinner
                v-if="button.loading"
                variant="primary"
              />
              <span
                v-if="button.status && !button.loading"
                :class="button.status.status ? `text-success font-weight-bolder` : `text-danger font-weight-bolder`"
              >
                {{ button.status.title }}
              </span>
            </b-col>
          </b-row>
        </b-col>
        <b-col
          cols="12"
          sm="8"
        >
          <b-col
            v-for="button in buttonsYTD"
            :key="button.title"
            cols="12"
            sm="6"
            class="d-flex align-items-center mb-1"
          >
            <b-button
              :variant="button.variant"
              class="mr-2"
              :disabled="button.loading"
              style="width: 20rem"
              @click="get(button)"
            >
              {{ button.title }}
            </b-button>
            <b-spinner
              v-if="button.loading"
              variant="primary"
            />
            <span
              v-if="button.status && !button.loading"
              :class="button.status.status ? `text-success font-weight-bolder` : `text-danger font-weight-bolder`"
            >
              {{ button.status.title }}
            </span>
          </b-col>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          cols="12"
        >
          <span class="font-weight-bold font-large-1">Import Transactions</span>
        </b-col>
        <b-col
          cols="12"
          sm="3"
          md="3"
        >
          <b-form-file
            v-model="file"
            placeholder="Choose a file or drop it here..."
            drop-placeholder="Drop file here..."
            :accept="acceptedTypes"
          />
        </b-col>
        <b-col
          cols="12"
          sm="3"
          md="3"
        >
          <b-spinner
            v-if="loading"
            variant="primary"
          />
          <b-button
            v-else
            variant="primary"
            @click="importTransactions"
          >
            Import
          </b-button>
        </b-col>
        <b-col
          cols="12"
        >
          <b-link
            :href="sampleDownload"
          >
            Sample File
          </b-link>
        </b-col>
        <b-col
            cols="12"
            class="mt-1"
        >
          <span class="font-weight-bold font-large-1">
            Log Import
          </span>
          <feather-icon
              size="24"
              icon="RefreshCcwIcon"
              class="mr-50 cursor-pointer"
              style="margin-bottom: 10px"
              v-on:click="getLogImports"
          />
        </b-col>

        <b-overlay
            :show="loading2"
            spinner-type="grow"
            spinner-variant="primary"
            :variant="`transparent`"
            :opacity="1"
            :blur="`2px`"
            rounded="lg"
        >
          <p v-if="logImports.length === 0">
            Nothing to Show
          </p>
        <b-table
            v-else
            hover
            responsive
            :items="logImports"
            :fields="fields"
        >

          <template
              #cell(created_at)="data"
          >

              {{ data.item.created_at | moment("MM-DD-YYYY HH-mm-ss") }}


          </template>
          <template
              #cell(status)="data"
          >
            <b-badge
                :variant="data.item.status === 'Finished' ? `light-success` : data.item.status === 'Failed'
                  ? `light-danger` : `light-primal`"
            >
              {{ data.item.status }}
            </b-badge>

          </template>
        </b-table>
        </b-overlay>
        <b-col
          cols="12"
          class="mt-1"
        >
          <span class="font-weight-bold font-large-1">
            Wrong Naming
          </span>
        </b-col>
        <b-col
          v-for="wname in wrongNames"
          :key="wname.id"
          cols="12"
        >
          <span class="font-weight-bolder">
            {{ wname.name }}
          </span> parsed from
          <span class="font-weight-bolder">
            {{ wname.source }}
          </span>
          doesn’t have a match
        </b-col>
      </b-row>
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BButton, BSpinner, BRow, BCol, BCard, BCardBody, BFormFile, BLink, BTable, BBadge, BOverlay
} from 'bootstrap-vue-next'
import axiosIns from '@/libs/axios'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { analysError } from '@/_helpers/analys_error'

export default {
  components: {
    BButton,
    BSpinner,
    BRow,
    BCol,
    BCard,
    BCardBody,
    BFormFile,
    BOverlay,
    BLink,
    BTable,
    BBadge
  },
  data() {
    return {
      file: [],
      acceptedTypes: '.csv',
      logImports: [],
      fields: [
        {
          key: 'created_at', label: 'Created Date', sortable: false, tdClass: 'text-center', thClass: 'text-center',
        },
        {
          key: 'status', label: 'Status', sortable: false, tdClass: 'text-center', thClass: 'text-center',
        },
        {
          key: 'message', label: 'message', sortable: false, tdClass: 'text-left', thClass: 'text-center',
        },
      ],
      buttonsMTD: [
        {
          title: 'Get Hubstaff tracking data MTD',
          url: 'tracking/get',
          urlParams: '?MTD&source=Hubstaff',
          variant: 'primary',
          loading: false,
          status: {},
        },
        {
          title: 'Get Upwork tracking data MTD',
          url: 'tracking/get',
          urlParams: '?MTD&source=Upwork',
          variant: 'primary',
          loading: false,
          status: {},
        },
        {
          title: 'Get ClickUp tracking data MTD',
          url: 'tracking/get',
          urlParams: '?MTD&source=Clickup',
          variant: 'primary',
          loading: false,
          status: {},
        },
        {
          title: 'Get ClickUp spaces',
          url: 'clickUp/spaces',
          variant: 'primary',
          loading: false,
          status: {},
        },
        {
          title: 'Get ClickUp comrades',
          url: 'clickUp/comrades',
          variant: 'primary',
          loading: false,
          status: {},
        },
      ],
      buttonsYTD: [
        {
          title: 'Get Hubstaff tracking data YTD',
          url: 'tracking/get',
          urlParams: '?YTD&source=Hubstaff',
          variant: 'primary',
          loading: false,
          status: {},
        },
        {
          title: 'Get Upwork tracking data YTD',
          url: 'tracking/get',
          urlParams: '?YTD&source=Upwork',
          variant: 'primary',
          loading: false,
          status: {},
        },
        {
          title: 'Get ClickUp tracking data YTD',
          url: 'tracking/get',
          urlParams: '?YTD&source=Clickup',
          variant: 'primary',
          loading: false,
          status: {},
        },
      ],
      wrongNames: [],
      loading: false,
      loading2: false,
      sampleDownload: `${process.env.VUE_APP_API_URL}/download/transactions/import-example`,
    }
  },
  beforeMount() {
    this.getWrongNames()
    this.getLogImports()
  },
  methods: {
    importTransactions() {
      if (!this.file) {
        return
      }
      this.loading = true
      const formData = new FormData()
      formData.append('file', this.file)
      axiosIns.post('/transaction/import', formData).then(response => {
        this.loading = false
        this.$swal({
          title: response.data.message,
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-primary',
          },
          buttonsStyling: false,
        })
        this.getLogImports()
      }).catch(error => {
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
    get(button) {
      button.loading = true
      let url = button.url
      if (button?.urlParams) {
        url = button.url + button.urlParams
      }
      axiosIns.get(`/settings/${url}`).then(response => {
        button.loading = false
        button.status = response.data.data
      }).catch(error => {
        button.loading = false
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
    getWrongNames() {
      axiosIns.get('settings/wrong-names').then(response => {
        this.wrongNames = response.data.data
      }).catch(error => {
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
    getLogImports() {
      this.loading2 = true
      axiosIns.get('log_import').then(response => {
        this.logImports = response.data.data
        this.loading2 = false
      }).catch(error => {
        this.loading2 = false
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

</style>
