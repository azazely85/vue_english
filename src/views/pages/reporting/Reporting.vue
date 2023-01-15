<template>
  <div>
    <!-- <b-card>
      <b-row
        class="d-flex flex-nowrap"
      >
        <VueCtkDateTimePicker
          v-model="dateModel"
          format="YYYY-MM-DD"
          range
          locale="en"
          class="w-50"
          auto-close
          :dark="this.$store.state.appConfig.layout.skin === 'dark'"
          color="#F05A28"
          :custom-shortcuts="myRanges"
          :shortcut="'mtd'"
          @input="getReport()"
        />
      </b-row>
      <b-row class="d-flex justify-content-center">
        <b-spinner
          v-if="loading"
          class="mt-2"
        />
        <div
          v-else
          class="font-large-1 pt-1"
        >
          {{ needleTime }}
        </div>
      </b-row>
    </b-card> -->
    <b-card>
      <b-col cols="12">
        <b-row>
          <b-col
            cols="12"
            sm="4"
            class="p-0"
          >
            <VueCtkDateTimePicker
              v-model="dateModel"
              format="YYYY-MM-DD"
              range
              locale="en"
              auto-close
              :dark="this.$store.state.appConfig.layout.skin === 'dark'"
              color="#F05A28"
              :first-day-of-week=1
              :custom-shortcuts="myRanges"
              :shortcut="'mtd'"
              @input="getReport()"
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
            v-if="report.length === 0"
            class="font-large-1"
          >
            Nothing to Show
          </p>
          <b-table
            v-else
            :fields="fields"
            :items="report"
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
              <b-link
                :to="`/comrade-info/${data.item.id}`"
                target="_blank"
              >
                {{ data.item.name }}
              </b-link>
            </template>
            <template #cell(total_time_tracked)="data">
              {{ data.item.tracked_for_range }}
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
            <template #row-details="row">
              <b-table
                :items="row.item.report.projects"
                :fields="projectsFields"
                borderless
              />
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
} from 'bootstrap-vue'
import VueHtml2pdf from 'vue-html2pdf'
import axios from 'axios'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useJwt from '@/auth/jwt/useJwt'
import { analysError } from '@/_helpers/analys_error'
import { DownloadIcon } from 'vue-feather-icons'

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
  },
  data() {
    return {
      dateModel: {},
      report: [],
      myRanges: [
        { key: 'thisWeek', label: 'This week', value: 'isoWeek' },
        { key: 'lastWeek', label: 'Last week', value: '-isoWeek' },
        { key: 'thisMonth', label: 'This month', value: 'month' },
        { key: 'lastMonth', label: 'Last month', value: '-month' },
        {
          key: 'ytd',
          label: 'YTD',
          value: () => ({
            start: this.$moment().startOf('year'),
            end: this.$moment(),
          }),
        },
        {
          key: 'mtd',
          label: 'MTD',
          value: () => ({
            start: this.$moment().startOf('month'),
            end: this.$moment(),
          }),
        },
      ],
      fields: [
        {
          key: 'name',
          label: 'Name',
          sortable: false,
          tdClass: 'text-center',
          thClass: 'text-center',
          thStyle: 'width: 15%',
        },
        {
          key: 'total_time_tracked',
          label: 'Tracked for range',
          sortable: true,
          tdClass: 'text-center',
          thClass: 'text-center',
          thStyle: 'width: 13%',
        },
        {
          key: 'overtime',
          label: 'Overtime',
          sortable: false,
          tdClass: 'text-center',
          thClass: 'text-center',
          thStyle: 'width: 10%',
        },
        {
          key: 'needleTracked',
          label: 'Needle Tracked',
          sortable: false,
          tdClass: 'text-center',
          thClass: 'text-center',
          thStyle: 'width: 10%',
        },
      ],
      projectsFields: [
        {
          key: 'name',
          label: 'Name',
          sortable: false,
          tdClass: 'text-center',
          thClass: 'text-center',
          thStyle: 'width: 50%',
        },
        {
          key: 'tracked_for_range',
          label: 'Tracked',
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
  methods: {
    toggleDetails(item) {
      if (item._showDetails) item._showDetails = false
      else this.$set(item, '_showDetails', true)
    },
    getReport() {
      if (
        this.dateModel === null
        || this.dateModel.start === null
        || this.dateModel.end === null
      ) return
      this.loading = true
      axios
        .get(
          `${process.env.VUE_APP_API_URL}/reporting/comrades?from=${this.dateModel.start}&to=${this.dateModel.end}`,
          {
            headers: { Authorization: `Bearer ${useJwt.getToken()}` },
          },
        )
        .then(response => {
          this.loading = false
          this.report = response.data.data.result
          this.needleTime = response.data.data.needleTracked
        })
        .catch(error => {
          console.error(error)
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

<style scoped>
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
#modal-footer{

}
</style>
