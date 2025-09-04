<template>
  <div>
    <b-card>
      <b-col cols="12">
        <b-row class="mb-2">
          <b-col
            cols="12"
            sm="4"
            class="p-0 d-flex justify-content-start align-items-center"
          >
            <months-toggler
              :loading="loading"
              :from="from"
              :to="to"
              @month-changed="monthChanged"
            />
          </b-col>
          <b-col
            cols="12"
            sm="8"
            class="d-flex p-0 justify-content-end"
          >
            <div class="d-flex">
              <b-button
                variant="success"
                :disabled="loading"
                @click="generatePDF()"
              >
                <span
                  v-if="!loading"
                  class="p-0 m-0"
                > Generate PDF </span>
                <b-spinner
                  v-else
                  variant="light"
                  small
                />
              </b-button>
            </div>
          </b-col>
        </b-row>
      </b-col>
      <vue-html2pdf
        ref="html2Pdf"
        :show-layout="false"
        :float-layout="false"
        :enable-download="false"
        :preview-modal="false"
        :paginate-elements-by-height="800"
        filename="comrades"
        :pdf-quality="2"
        :manual-pagination="false"
        pdf-orientation="landscape"
        pdf-content-width="100%"
        @beforeDownload="beforeDownload($event)"
      >
        <section slot="pdf-content">
          <b-row class="d-flex justify-content-center">
            <b-spinner
              v-if="loading"
              class="mt-2"
            />
          </b-row>
          <p
            v-if="comrads.length === 0"
            class="font-large-1"
          >
            Nothing to Show
          </p>
          <b-table
            v-else
            :fields="fields"
            :items="comrads"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            responsive
            bordered
            hover
            class="customTable"
            :busy="loading"
            @row-clicked="toggleDetails"
          >
            <template #table-busy>
              <div class="text-center my-2">
                <b-spinner class="align-middle mr-1" />
                <strong>Loading...</strong>
              </div>
            </template>
            <template #cell(name)="data">
              {{ data.item.name }}
            </template>
            <template #cell(salary)="data">
              {{ data.item.report.base_salary }}
            </template>
            <template #cell(offDays)="data">
              {{ data.item.report.off_days }}
            </template>
            <template #cell(billed_for)="data">
              <tr
                v-for="(obj, index) in data.item.report.report"
                :key="index"
                class="d-flex justify-content-center"
              >
                <td class="w-100 borderless text-center">
                  <span>
                    {{ obj.billed_for }}
                  </span>
                </td>
              </tr>
            </template>
            <template #cell(hours)="data">
              <tr
                v-for="(obj, index) in data.item.report.report"
                :key="index"
                class="d-flex justify-content-center"
              >
                <td class="w-100 borderless text-center">
                  <span>
                    {{ secToTime(obj.hours) }}
                  </span>
                </td>
              </tr>
            </template>
            <template #cell(to_pay)="data">
              <tr
                v-for="(obj, index) in data.item.report.report"
                :key="index"
                class="d-flex justify-content-center"
              >
                <td class="w-100 borderless text-center">
                  <span>
                    {{ obj.to_pay }} $
                  </span>
                </td>
              </tr>
            </template>
            <template #cell(totalPaid)="data">
              {{ data.item.report.total_paid }} $
            </template>
            <template #cell(project_in_percent)="data">
              <tr
                v-for="(obj, index) in data.item.report.report"
                :key="index"
                class="d-flex justify-content-center"
              >
                <td class="w-100 borderless text-center">
                  <span>
                    {{ obj.project_in_percent }}
                  </span>
                </td>
              </tr>
            </template>
            <template #cell(per_project)="data">
              <tr
                v-for="(obj, index) in data.item.report.report"
                :key="index"
                class="d-flex justify-content-center"
              >
                <td class="w-100 borderless text-center">
                  <span>
                    {{ obj.per_project }} $
                  </span>
                </td>
              </tr>
            </template>
            <template #cell(totalToPay)="data">
              {{ data.item.report.total_to_pay }} $
            </template>
            <template #cell(overtime)="data">
              <div
                :class="
                  data.value.includes('-', 0) ? `text-danger` : `text-success`
                "
              >
                {{ data.item.overtime }}
              </div>
            </template>
          </b-table>
        </section>
      </vue-html2pdf>
    </b-card>

    <b-modal
      v-if="blobUrl"
      id="reportModal"
      :centered="true"
      ok-title="Email it"
      cancel-title="Download it"
      size="xl"
      title="Choose an option"
    >
      <iframe
        :src="blobUrl"
        width="100%"
        height="600px"
        frameborder="0"
      />

      <template #modal-footer>
        <div class="w-100">
          <!-- <p class="float-left">Modal Footer Content</p> -->
          <b-button
            variant="primary"
            size="xl"
            class="float-right d-flex justify-content-center align-items-center"
            @click="downloadReport()"
          >
            <download-icon
              size="1.5x"
              class="custom-class"
            />
            <span class="ml-1">Download</span>
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BTable,
  BLink,
  BSpinner,
  BButton,
} from 'bootstrap-vue-next'
import VueHtml2pdf from 'vue-html2pdf'
import axios from 'axios'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useJwt from '@/auth/jwt/useJwt'
import { analysError } from '@/_helpers/analys_error'
import { DownloadIcon } from 'vue-feather-icons'
import MonthsToggler from '@/views/HelperComponents/MonthsToggler.vue'
import { secToTime } from '@/_helpers/time'

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BTable,
    BLink,
    BSpinner,
    BButton,
    VueHtml2pdf,
    DownloadIcon,
    MonthsToggler,
  },
  data() {
    return {
      from: '',
      to: '',
      comrads: [],
      projectWorkload: [],
      needleTime: '',
      sortBy: 'name',
      sortDesc: false,
      fields: [
        {
          key: 'name',
          label: 'Name',
          sortable: true,
          tdClass: 'text-center',
          thClass: 'text-center',
        },
        {
          key: 'salary',
          label: 'Base Salary',
          sortable: false,
          tdClass: 'text-center',
          thClass: 'text-center',
        },
        {
          key: 'offDays',
          label: 'Off Days',
          sortable: false,
          tdClass: 'text-center',
          thClass: 'text-center',
          thStyle: 'width: 50%',
        },
        {
          key: 'billed_for',
          label: 'Billed For',
          sortable: false,
          tdClass: 'text-center',
          thClass: 'text-center',
          thStyle: 'width: 100%',
        },
        {
          key: 'hours',
          label: 'Hours',
          sortable: false,
          tdClass: 'text-center w-100 p-0',
          thClass: 'text-center',
          thStyle: 'width: 100%',
        },
        {
          key: 'to_pay',
          label: 'To Pay',
          sortable: false,
          tdClass: 'text-center w-120 p-0',
          thClass: 'text-center',
          thStyle: 'width: 100%',
        },
        {
          key: 'totalToPay',
          label: 'Total To Pay',
          sortable: false,
          tdClass: 'text-center',
          thClass: 'text-center',
          thStyle: 'width: 50%',
        },
        {
          key: 'totalPaid',
          label: 'Total Paid',
          sortable: false,
          tdClass: 'text-center',
          thClass: 'text-center',
          thStyle: 'width: 50%',
        },
        {
          key: 'project_in_percent',
          label: 'Project In %',
          sortable: false,
          tdClass: 'text-center',
          thClass: 'text-center',
          thStyle: 'width: 50%',
        },
        {
          key: 'per_project',
          label: '$ Paid Per Project',
          sortable: false,
          tdClass: 'text-center',
          thClass: 'text-center',
          thStyle: 'width: 50%',
        },
      ],
      loading: false,
      pdfReport: null,
      blobUrl: null,
      html2PdfSetup: null,
    }
  },
  beforeMount() {
    this.from = this.$moment().startOf('month').format('YYYY-MM-DD')
    this.to = this.$moment().endOf('month').format('YYYY-MM-DD')
    this.getComrads()
  },
  methods: {
    secToTime,
    toggleDetails(item) {
      if (item._showDetails) item._showDetails = false
      else this.$set(item, '_showDetails', true)
    },
    getComrads() {
      this.loading = true
      if (
        this.from === null
        || this.to === null
      ) return
      axios.get(`${process.env.VUE_APP_API_URL}/reporting/financial/comrades?from=${this.from}&to=${this.to}`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.loading = false
        this.comrads = response.data.data
        // this.projectWorkload = this.comrads.map(e => e?.report)
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
    monthChanged(ranges) {
      [this.from, this.to] = ranges
      this.getComrads()
    },
    async generatePDF() {
      this.$refs.html2Pdf.generatePdf()
    },
    async beforeDownload({ html2pdf, options, pdfContent }) {
      this.html2PdfSetup = html2pdf().set(options).from(pdfContent)
      this.blobUrl = await this.html2PdfSetup.output('bloburl')

      if (this.blobUrl) {
        const res = await fetch(this.blobUrl)
        this.pdfReport = await res.blob()
      }
      this.$bvModal.show('reportModal')
    },
    downloadReport() {
      this.html2PdfSetup.save()
    },
  },
}
</script>

<style>
.customTable > tbody > tr > td:nth-child(2) {
  padding: 0;
}

.customTable > tbody > tr > td:nth-child(2) > div {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem 0;
}

.customTable > tbody > tr > td:nth-child(2) > div:nth-child(1) {
  border-bottom: 1px solid #141414 !important;
}

.customTable th{
  min-width: 180px !important;
}
.hidden_header {
  display: none;
}

.borderless {
    border: none !important;
    display: flex !important;
    justify-content: center !important;
}

</style>
