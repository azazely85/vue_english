<template>
  <div>
    <b-row>
      <b-col
        class="d-flex align-items-center mb-2"
        cols="6"
        sm="6"
      >
        <months-toggler
          :from="from"
          :to="to"
          :loading="loading"
          @month-changed="monthChanged"
        />
      </b-col>
      <b-col
        class="d-flex justify-content-end mb-2"
        cols="6"
        sm="6"
      >
        <b-button
          :disabled="!mockData.length"
          variant="primary"
          @click="payoutVisible = true"
        >
          Payout View
        </b-button>
      </b-col>
    </b-row>
    <salaries-table-view
      :loading="loading"
      :from="from"
      :to="to"
      :table-data="tableData"
      @update-loading="updateLoading"
      @emit_comrade_id="receiveId"
    />
    <salaries-payout-view
      v-if="payoutVisible"
      :comrades.sync="mockData"
      :from="from"
      :to="to"
      :payout-visible.sync="payoutVisible"
      :month="month"
      @closePayout="hidePayout"
      @bonus-change="handleBonusChange"
    />
  </div>
</template>

<script>
import { BRow, BButton, BCol } from 'bootstrap-vue'
import SalariesTableView from '@/views/pages/finances/salaries/table-view/SalariesTableView.vue'
import SalariesPayoutView from '@/views/pages/finances/salaries/payout-view/SalariesPayoutView.vue'
import MonthsToggler from '@/views/HelperComponents/MonthsToggler.vue'
import axiosIns from '@/libs/axios'
import { analysError } from '@/_helpers/analys_error'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    // Bootstrap
    BRow,
    BButton,
    BCol,

    // Views
    SalariesTableView,
    SalariesPayoutView,

    MonthsToggler,
  },
  data() {
    return {
      from: '',
      to: '',
      loading: false,
      mockData: [],
      tableData: [],
      selectedComrade: null,
      payoutVisible: false,
    }
  },
  computed: {
    month() {
      return this.$moment(this.from).format('MMMM')
    },
  },
  beforeMount() {
    this.from = this.$moment()
      .subtract(1, 'months')
      .startOf('month')
      .format('YYYY-MM-DD')
    this.to = this.$moment()
      .subtract(1, 'months')
      .endOf('month')
      .format('YYYY-MM-DD')
    this.getSalariesTableView()
  },
  methods: {
    hidePayout(bool) {
      this.payoutVisible = bool
    },
    handleBonusChange(obj) {
      if (this.mockData.length > 0) {
        this.getSalariesTableView().then(
          res => this.selectedComrade = this.mockData.find(
            comrade => comrade.id === obj.id,
          ),
        )
      }
    },
    receiveId(id) {
      if (this.mockData.length > 0) {
        this.selectedComrade = this.mockData.find(
          comrade => comrade.id === id,
        )
        this.payoutVisible = true
      }
    },
    updateLoading(loadingFlag) {
      this.loading = loadingFlag
    },
    monthChanged(ranges) {
      [this.from, this.to] = ranges
      this.getSalariesTableView()
    },
    getSalariesTableView() {
      this.loading = true
      return axiosIns
        .get(`/finances/salaries/table?from=${this.from}&to=${this.to}`)
        .then(response => {
          this.loading = false
          this.mockData = response.data.data
          this.tableData = this.mockData.map(el => ({
            comrade_id: el.id,
            name: el.name,
            base_salary: el.report.base_salary,
            bonus: el.report.bonus ? el.report.bonus : 0,
            paid: el.report.total_paid,
            approved_overtime: '-',
            to_pay: el.report.total_to_pay,
          }))
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

<style scoped></style>
