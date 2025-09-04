<template>
  <div>
    <b-card>
      <b-card-header class="pt-0">
        <span
          class="font-weight-bolder font-medium-3"
        >
          {{ projectName }}
        </span>
      </b-card-header>
      <b-card-body>
        <b-row>
          <b-col cols="12">
            <b-row>
              <b-col
                cols="12"
                sm="4"
              >
                <VueCtkDateTimePicker
                  v-model="dateModel"
                  format="YYYY-MM-DD"
                  range
                  locale="en"
                  auto-close
                  :first-day-of-week=1
                  :dark="this.$store.state.appConfig.layout.skin === 'dark'"
                  color="#5acdae"
                  :custom-shortcuts="myRanges"
                  :shortcut="'mtd'"
                  @input="getReport()"
                />
              </b-col>
              <b-col
                cols="12"
                sm="8"
                class="d-flex justify-content-end"
              >
                <div
                  class="d-flex"
                >
                  <b-button
                    v-if="report.length > 0"
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
                  <b-button
                    class="ml-1"
                    variant="primary"
                    @click="showComradesFunc()"
                  >
                    {{ showComrades ? "Hide Comrades" : "Show Comrades" }}
                  </b-button>
                </div>
              </b-col>
            </b-row>
          </b-col>
          <b-col
            cols="12"
            sm="12"
            class="mt-2"
          >
            <vue-html2pdf
              ref="html2Pdf"
              :show-layout="false"
              :float-layout="false"
              :enable-download="false"
              :preview-modal="false"
              :paginate-elements-by-height="800"
              filename="report"
              :pdf-quality="2"
              :manual-pagination="false"
              pdf-orientation="landscape"
              pdf-content-width="100%"
              @beforeDownload="beforeDownload($event)"
            >
              <section slot="pdf-content">
                <b-row
                  class="d-flex flex-nowrap align-self-md-stretch position-relative"
                >
                  <b-col
                    v-if="!showComrades"
                    :xs="showComrades ? 6 : 12"
                    class="pr-0"
                  >
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
                        responsive
                        :busy="loading"
                        :items="report"
                        :fields="fields"
                        bordered
                        class="h-100"
                        show-empty
                      >
                        <template #empty="scope">
                          <h4>{{ scope.emptyText }}</h4>
                        </template>
                      </b-table>
                    </b-overlay>
                  </b-col>
                  <b-col
                    v-else
                    :xs="6"
                    class="pl-1 pr-0"
                  >
                    <b-table
                      responsive
                      :items="reportWithComrades"
                      bordered
                      class="h-100"
                    />
                  </b-col>
                </b-row>
              </section>
            </vue-html2pdf>
          </b-col>
          <b-col
            v-if="discrepancy"
            cols="12"
            sm="12"
          >
            <span class="font-weight-bolder font-medium-1">Discrepancy</span>
          </b-col>
          <b-col v-if="discrepancy && !loading">
            <table class="mt-2 mt-xl-0">
              <tr
                v-for="(discrepancyItem, index) in discrepancy"
                :key="index"
              >
                <th class="pb-50">
                  <feather-icon
                    icon="UsersIcon"
                    class="mr-75"
                  />
                  <span class="font-weight-bold">{{ index }}</span>
                </th>
                <td class="pb-50 pl-50">
                  (ClickUp - {{ discrepancyItem.ClickUp }},
                </td>
                <td class="pb-50 pl-50">
                  Hubstaff/Upwork - {{ discrepancyItem.Hubstaff_Upwork }})
                </td>
              </tr>
            </table>
          </b-col>
          <b-col
            v-else-if="loading"
            cols="12"
          >
            <b-spinner variant="danger" />
          </b-col>
        </b-row>
      </b-card-body>
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

          <b-form-input
            id="input-email"
            v-model="email"
            type="email"
            trim
            :state="emailValidate"
            debounce="500"
            class="mb-1"
            aria-describedby="input-email-help input-email-feedback"
          />
          <b-form-invalid-feedback id="input-email-feedback">
            Email consists of at least 6 chars
          </b-form-invalid-feedback>

          <!-- This is a form text block (formerly known as help block) -->
          <b-form-text id="input-email-help">
            Enter a clients email
          </b-form-text>

          <b-button
            :disabled="loading"
            variant="success"
            size="xl"
            class="float-right d-flex justify-content-center align-items-center"
            @click="emailReport()"
          >
            <mail-icon
              v-if="!loading"
              size="1.5x"
              class="custom-class"
            />
            <b-spinner
              v-else
              variant="light"
              style="width: 1.5em; height: 1.5em"
            />
            <span class="ml-1">Email</span>
          </b-button>
          <b-button
            variant="primary"
            size="xl"
            class="float-right d-flex justify-content-center align-items-center"
            style="margin-right: 1rem"
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
  BTable,
  BRow,
  BCardBody,
  BButton,
  BCol,
  BSpinner,
  BModal,
  BEmbed,
  BFormInput,
  BFormInvalidFeedback,
  BFormText,
  BOverlay,
  BCardHeader
} from 'bootstrap-vue-next'
import VueHtml2pdf from 'vue-html2pdf'
import axios from 'axios'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useJwt from '@/auth/jwt/useJwt'
import { analysError } from '@/_helpers/analys_error'
import { MailIcon, DownloadIcon } from 'vue-feather-icons'

export default {
  components: {
    BCard,
    BRow,
    BTable,
    BCardBody,
    BButton,
    BCol,
    BModal,
    BEmbed,
    BSpinner,
    BFormInput,
    BFormInvalidFeedback,
    BFormText,
    BOverlay,
    BCardHeader,
    VueHtml2pdf,
    MailIcon,
    DownloadIcon,
  },

  data() {
    return {
      report: [],
      reportWithComrades: [],
      dateModel: {},
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
      loading: false,
      fields: [
        {
          key: 'task',
          label: 'Task',
          sortable: false,
          // tdClass: 'text-center p-15',
          // thClass: 'text-center',
          // thStyle: 'width: 15%',
        },
        {
          key: 'status',
          label: 'Status',
          sortable: true,
          // tdClass: 'text-center p-15',
          // thClass: 'text-center',
          // thStyle: 'width: 15%',
        },
        {
          key: 'estimation',
          label: 'Estimation',
          sortable: false,
          // tdClass: 'text-center p-15',
          // thClass: 'text-center',
          // thStyle: 'width: 10%',
        },
        {
          key: 'total_spent',
          label: 'Total Spent',
          sortable: false,
          // tdClass: 'text-center p-15',
          // thClass: 'text-center',
          // thStyle: 'width: 30%',
        },
      ],
      showComrades: false,
      pdfReport: null,
      blobUrl: null,
      html2PdfSetup: null,
      email: null,
      discrepancy: [],
      projectName: '',
    }
  },
  computed: {
    emailValidate() {
      if (this.email.length > 3) {
        const re = /(.+)@(.+){2,}\.(.+){2,}/
        return re.test(this.email.toLowerCase())
      }
      return false
    },
    comrades() {
      const mapped = this.report.map(e => e.comrades)
      const result = []
      let obj = {}

      for (let i = 0; i < mapped?.length; i++) {
        for (let j = 0; j < mapped[i]?.length; j++) {
          obj[Object.keys(mapped[i][j])[0]] = Object.values(mapped[i][j])[0]
        }

        result.push(obj)

        obj = {}
      }
      this.test = result
      return result
    },
  },
  beforeMount() {
    axios
      .get(
        `${process.env.VUE_APP_API_URL}/project/clients/${this.$route.params.id}`,
        {
          headers: { Authorization: `Bearer ${useJwt.getToken()}` },
        },
      )
      .then(response => {
        this.email = response?.data?.data[0]?.client?.email
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
  methods: {
    async beforeDownload({ html2pdf, options, pdfContent }) {
      this.html2PdfSetup = html2pdf().set(options).from(pdfContent)
      this.blobUrl = await this.html2PdfSetup.output('bloburl')

      if (this.blobUrl) {
        const res = await fetch(this.blobUrl)
        this.pdfReport = await res.blob()
      }
      this.$bvModal.show('reportModal')
    },
    sendReport() {
      this.loading = true
      const formData = new FormData()
      formData.append('report', this.pdfReport)
      formData.append('project_id', this.$route.params.id)
      formData.append('from', this.dateModel.start)
      formData.append('to', this.dateModel.end)
      formData.append('email', this.email)
      formData.append('isGenerateReport', true)
      axios
        .post(`${process.env.VUE_APP_API_URL}/reporting/projects`, formData, {
          headers: {
            Authorization: `Bearer ${useJwt.getToken()}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          this.loading = false
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: response.data.message,
              icon: 'CheckIcon',
              variant: 'success',
            },
          })
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
    async generatePDF() {
      this.$refs.html2Pdf.generatePdf()
    },
    showComradesFunc() {
      this.showComrades = !this.showComrades
    },
    updateDate(date) {
      this.dateModel = date
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
          `${process.env.VUE_APP_API_URL}/reporting/projects?from=${this.dateModel.start}&to=${this.dateModel.end}&project_id=${this.$route.params.id}`,
          {
            headers: { Authorization: `Bearer ${useJwt.getToken()}` },
          },
        )
        .then(response => {
          this.loading = false
          this.projectName = response.data.data.project_name
          this.report = response.data.data.data
          this.reportWithComrades = [...this.report]
          for (let i = 0; i < this.reportWithComrades.length; i++) {
            Object.keys(this.comrades[i]).forEach((e, index) => {
              this.reportWithComrades[i][e] = Object.values(this.comrades[i])[
                index
              ]
            })
            delete this.reportWithComrades[i].comrades
          }
          this.discrepancy = response.data.data.discrepancy
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
    emailReport() {
      this.sendReport()
    },
    downloadReport() {
      this.html2PdfSetup.save()
    },
  },
}
</script>

<style>
/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-fade-enter-active {
  transition: all 0.1s ease;
}

.slide-fade-leave-active {
  transition: all 0.1s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  width: 0;
  max-width: 0;
  min-width: 0;
  opacity: 0;
}

.unslide-fade-enter-active {
  transition: all 0.25s ease-out;
}

.unslide-fade-leave-active {
  transition: all 0.25s ease-out;
}

.unslide-fade-enter-from,
.unslide-fade-leave-to {
  opacity: 1;
}
</style>
