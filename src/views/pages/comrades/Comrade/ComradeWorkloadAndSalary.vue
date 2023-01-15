<template>
  <b-card
    no-body
    border-variant="primary"
  >
    <b-card-header
      class="d-flex justify-content-between align-items-center pt-75 pb-25"
    >
      <h5 class="mb-0">
        Workload & Salary Breakdown
      </h5>
      <months-toggler
        :from="from"
        :to="to"
        :loading="loading"
        @month-changed="monthChanged"
      />
    </b-card-header>

    <b-overlay
      :show="loading"
      spinner-type="grow"
      spinner-variant="primary"
      :variant="`transparent`"
      :opacity="1"
      :blur="`2px`"
      rounded="sm"
    >
      <b-card-body>
        <b-container
            class="p-0"
        >
          <b-col
              cols="12"
              class="p-0"
          >
            <b-row>
              <b-col
                  cols="12"
                  class="flex-column"
              >
                <div
                    class="d-flex justify-content-between mb-1"
                >
                  <span
                      class="d-flex flex-row flex-nowrap align-items-center font-weight-bold text-capitalize"
                  >
                    <feather-icon
                        icon="DollarSignIcon"
                        class="mr-50"
                    />
                    Base Salary
                  </span>
                  <div v-if="salaryEdit">
                    <div class="d-flex flex-row flex-nowrap align-items-center" >
                      <b-form-input
                          v-model="mockSalaryReport.base_salary"
                          size="sm"
                          type="number"
                          style="margin-right: 10px"
                      />
                      <feather-icon
                          size="28"
                          icon="CheckIcon"
                          style="margin-bottom: 2px; color: #28c76f;"
                          v-on:click="updateSalary"
                      />
                    </div>
                  </div>
                  <div v-else>
                    <span
                        v-if="mockSalaryReport.base_salary"
                        style="max-width: 50%;"
                    >{{ mockSalaryReport.base_salary }} <feather-icon
                        size="15"
                        icon="Edit3Icon"
                        class="mr-50 btn-link"
                        style="margin-bottom: 2px"
                        v-on:click="salaryEdit = true"
                    /></span>
                    <span v-else>-<feather-icon
                        size="15"
                        icon="Edit3Icon"
                        class="mr-50 btn-link"
                        style="margin-bottom: 2px"
                        v-on:click="salaryEdit = true"
                    /></span>
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-col>
        </b-container>
        <b-container
            class="p-0"
        >
          <b-col
              cols="12"
              class="p-0"
          >
            <b-row>
              <b-col
                  cols="12"
                  class="flex-column"
              >
                <div
                    class="d-flex justify-content-between mb-1"
                >
                  <span
                      class="d-flex flex-row flex-nowrap align-items-center font-weight-bold text-capitalize"
                  >
                    <feather-icon
                        icon="ClockIcon"
                        class="mr-50"
                    />
                    Base Work Hours
                  </span>
                  <div v-if="workHoursEdit">
                    <div class="d-flex flex-row flex-nowrap align-items-center" >
                      <b-form-input
                          v-model="mockSalaryReport.base_work_hours"
                          size="sm"
                          type="number"
                          style="margin-right: 10px"
                      />
                      <feather-icon
                          size="28"
                          icon="CheckIcon"
                          style="margin-bottom: 2px; color: #28c76f;"
                          v-on:click="updateWorkHours"
                      />
                    </div>
                  </div>
                  <div v-else>
                    <span
                        v-if="mockSalaryReport.base_work_hours"
                        style="max-width: 50%;"
                    >{{ mockSalaryReport.base_work_hours }} <feather-icon
                        size="15"
                        icon="Edit3Icon"
                        class="mr-50 btn-link"
                        style="margin-bottom: 2px"
                        v-on:click="workHoursEdit = true"
                    /></span>
                    <span v-else>-<feather-icon
                        size="15"
                        icon="Edit3Icon"
                        class="mr-50 btn-link"
                        style="margin-bottom: 2px"
                        v-on:click="workHoursEdit = true"
                    /></span>
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-col>
        </b-container>
        <label
          v-if="mockSalaryReport && !mockSalaryReport.report"
        >No data</label>
        <b-container
          v-else
          class="p-0"
        >
          <b-col
            cols="12"
            class="p-0"
          >
            <b-row>
              <b-col
                cols="12"
                class="flex-column"
              >
                <div
                  class="d-flex justify-content-between mb-1"
                >
                  <span
                    class="d-flex flex-row flex-nowrap align-items-center font-weight-bold text-capitalize"
                  >
                    <feather-icon
                      icon="CoffeeIcon"
                      class="mr-50"
                    />
                    Off Days
                  </span>
                  <span
                    v-if="mockSalaryReport.off_days"
                    style="max-width: 50%;"
                  >
                    {{ mockSalaryReport.off_days }}
                  </span>
                  <span v-else>-</span>
                </div>
                <hr>
                <div
                  v-for="report in mockSalaryReport.report"
                  :key="report.id"
                  class="d-flex flex-column"
                >
                  <div
                    v-for="field in fields"
                    :key="field.value"
                    class="d-flex justify-content-between mb-1"
                  >
                    <span
                      class="d-flex flex-row flex-nowrap align-items-center font-weight-bold text-capitalize"
                    >
                      <feather-icon
                        :icon="field.icon"
                        class="mr-50"
                      />
                      {{ field.title }}
                    </span>
                    <span
                      v-if="report[field.value]"
                      style="max-width: 50%; text-align: right"
                    >
                      {{ report[field.value] }}
                    </span>
                    <span v-else>-</span>
                  </div>
                  <br>
                </div>
                <hr>
                <div
                  class="d-flex justify-content-between mb-1"
                >
                  <span
                    class="d-flex flex-row flex-nowrap align-items-center font-weight-bold text-capitalize"
                  >
                    <feather-icon
                      icon="DollarSignIcon"
                      class="mr-50"
                    />
                    Total to pay
                  </span>
                  <span
                    v-if="mockSalaryReport.total_to_pay"
                    style="max-width: 50%;"
                  >
                    {{ mockSalaryReport.total_to_pay }}
                  </span>
                  <span v-else>-</span>
                </div>
                <div
                  class="d-flex justify-content-between mb-1"
                >
                  <span
                    class="d-flex flex-row flex-nowrap align-items-center font-weight-bold text-capitalize"
                  >
                    <feather-icon
                      icon="DollarSignIcon"
                      class="mr-50"
                    />
                    Total Paid
                  </span>
                  <div class="d-flex flex-row flex-nowrap align-items-center" >
                    <b-form-input
                      v-model="mockSalaryReport.total_paid"
                      @focusin="totalPaidCopy = mockSalaryReport.total_paid"
                      style="margin-right: 8px;"
                      size="sm"
                    />
                    <feather-icon
                        size="28"
                        icon="CheckIcon"
                        style="margin-top: 2px; color: #28c76f;"
                        v-on:click="changeTotalPaid"
                    />
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-col>
        </b-container>
      </b-card-body>
    </b-overlay>
  </b-card>
</template>

<script>
import {
  BCol, BRow, BCard, BCardHeader, BCardBody, BContainer, BFormInput, BOverlay, BButton,
} from 'bootstrap-vue'
import { analysError } from '@/_helpers/analys_error'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import axiosIns from '@/libs/axios'
import axios from 'axios'
import useJwt from '@/auth/jwt/useJwt'
import MonthsToggler from '@/views/HelperComponents/MonthsToggler.vue'
import { secToTime } from '@/_helpers/time'

export default {
  components: {
    BCol,
    BRow,
    BCard,
    BCardHeader,
    BCardBody,
    BContainer,
    BFormInput,
    BOverlay,
    // switch month
    MonthsToggler,
  },
  props: {
    comradeId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      mockSalaryReport: [],
      from: '',
      to: '',
      fields: [
        { title: 'Billed For', value: 'billed_for', icon: 'GitlabIcon' },
        { title: 'Hours', value: 'hours', icon: 'ClockIcon' },
        { title: 'To Pay', value: 'to_pay', icon: 'DollarSignIcon' },
        { title: 'Project in %', value: 'project_in_percent', icon: 'PercentIcon' },
        { title: 'Paid Per Project $', value: 'per_project', icon: 'DollarSignIcon' },
      ],
      loading: false,
      totalPaidCopy: '',
      salaryEdit: false,
      workHoursEdit: false
    }
  },
  beforeMount() {
    this.from = this.$moment().startOf('month').format('YYYY-MM-DD')
    this.to = this.$moment().endOf('month').format('YYYY-MM-DD')
    this.getReport()
  },
  methods: {
    secToTime,
    monthChanged(ranges) {
      [this.from, this.to] = ranges
      this.getReport()
    },
    updateSalary() {
      this.loading = true
      this.salaryEdit = false;
      if (this.mockSalaryReport.base_salary == null) {
        return
      }
      const data = {
        salary: this.mockSalaryReport.base_salary,
        date: this.from
      }
      axios.put(`${process.env.VUE_APP_API_URL}/comrade/${this.comradeId}`, data, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.getReport()
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
              icon: 'XIcon',
              variant: 'danger',
            },
          })
        })
      })
    },
    updateWorkHours() {
      this.loading = true
      this.workHoursEdit = false;
      if (this.mockSalaryReport.base_work_hours == null) {
        return
      }
      const data = {
        work_hours: this.mockSalaryReport.base_work_hours,
        date: this.from
      }
      axios.put(`${process.env.VUE_APP_API_URL}/comrade/${this.comradeId}`, data, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.getReport()
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
              icon: 'XIcon',
              variant: 'danger',
            },
          })
        })
      })
    },
    changeTotalPaid() {
      if (Number(this.totalPaidCopy) === Number(this.mockSalaryReport.total_paid)) { return }
      this.loading = true
      const data = {
        from: this.from,
        to: this.to,
        comrade_id: this.comradeId,
        total_paid: this.mockSalaryReport.total_paid,
      }
      axios.post(`${process.env.VUE_APP_API_URL}/comradeTP`, data, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.loading = false
        this.mockSalaryReport = response.data.data
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
              icon: 'XIcon',
              variant: 'danger',
            },
          })
        })
      })
    },
    getReport() {
      this.loading = true
      axiosIns.get(`/reporting/financial/comrade?comrade=${this.comradeId}&isOneComrade`
          + `&from=${this.from}&to=${this.to}`)
        .then(response => {
          this.loading = false
          this.mockSalaryReport = response.data.data
          this.mockSalaryReport.report.forEach(report => report.hours = secToTime(report.hours))
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

<style scoped>

</style>
