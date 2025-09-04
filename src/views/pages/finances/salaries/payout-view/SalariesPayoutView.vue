<template>
  <b-modal
    no-close-on-backdrop
    id="comradeSalaryPayoutModal"
    centered
    :visible="payoutVisible"
    @close="handleClose"
    @change="handleClose"
    @cancel="handleClose"
  >
    <div
      class="d-flex w-100 justify-content-between"
    >
      <div class="d-flex h-100 align-content-center">
        <b-button
          :disabled="blockLeftSwitcher"
          class="position-relative p-0"
          variant="link"
          @click="changeComrade('decrease')"
        >
          <feather-icon
            icon="ArrowLeftIcon"
            size="22"
            class="cursor-pointer"
          />
        </b-button>
      </div>
      <div class="d-flex h-100 align-content-center">
        <b-button
          class="position-relative p-0"
          variant="link"
          :disabled="blockRightSwitcher"
          @click="changeComrade('increase')"
        >
          <feather-icon
            icon="ArrowRightIcon"
            size="22"
            class="cursor-pointer disabled"
          />
        </b-button>
      </div>
    </div>
    <div class="p-1">
      <b-row class="d-flex flex-row justify-content-between align-items-center w-100 mb-1 mr-0 ml-0">
        <span class="font-small-5">Tracked For A Month</span>
        <span class="font-small-5">{{ secToTime(trackedForAMonth) }}</span>
      </b-row>
      <b-row class="d-flex flex-row justify-content-between align-items-center w-100 mb-1 mr-0 ml-0">
        <span class="font-small-5">Base Salary</span>
        <span class="font-small-5">{{ comrades[index].report.base_salary }} $</span>
      </b-row>
      <b-row class="d-flex flex-row justify-content-between align-items-center w-100 mb-1 mr-0 ml-0">
        <span class="font-small-5">Payoneer Email</span>
        <b-link
          class="font-small-5"
          :href="`mailto:${comrades[index].payoneer_email}`"
        >
          {{ comrades[index].payoneer_email }}
        </b-link>
      </b-row>
      <b-row class="d-flex flex-row justify-content-between align-items-center w-100 mb-1 mr-0 ml-0">
        <span class="font-small-5">Off Days</span>
        <span class="font-small-5">{{ comrades[index].report.off_days }}</span>
      </b-row>
      <b-row
        v-if="withBonus || bonusString !== null"
        class="d-flex flex-row justify-content-between align-items-center w-100 mb-1 mr-0 ml-0"
      >
        <span class="font-small-5">Bonus / Deduction</span>
        <b-form-input
          id="bonus-change-field"
          v-model="bonusString"
          class="font-small-5 w-50 text-right"
          :class="[bonusColor]"
          type="number"
          :size="'sm'"
          @input="handleBonusChange"
        />
      </b-row>
      <b-row
        v-if="withBonus || bonusString !== null"
        class="d-flex flex-row justify-content-between align-items-center w-100 mb-1 mr-0 ml-0"
      >
        <span class="font-small-5">Note</span>
        <b-form-input
          id="note-change-field"
          v-model="bonusStringNote"
          class="font-small-5 w-50 text-right"
          :size="'sm'"
        />
      </b-row>
      <b-row class="d-flex flex-row justify-content-between align-items-center w-100 mb-1 mr-0 ml-0">
        <span class="font-small-5">Total To Pay</span>
        <span
          id="tooltip-button-interactive"
          class="font-small-5"
        >{{ bonusDisplayValue }} $</span>
        <b-tooltip
          target="tooltip-button-interactive"
          variant="primary"
        >
          <span
            v-html="toPayToolTip"
          >
            {{ toPayToolTip }}
          </span>
        </b-tooltip>
      </b-row>
      <b-row class="d-flex flex-row justify-content-between align-items-center w-100 mb-1 mr-0 ml-0">
        <span class="font-small-5">Total Paid</span>
        <span class="font-small-5">{{ comrades[index].report.total_paid }} $</span>
      </b-row>
      <b-row class="d-flex flex-row justify-content-between align-items-center w-100 mb-1 mr-0 ml-0">
        <span class="font-small-5">To Pay Now</span>
        <b-form-input
          v-model="comrades[index].report.to_pay_now"
          class="font-small-5 w-50 text-right"
          :placeholder="toPayNow"
          :size="'sm'"
        />
      </b-row>
    </div>
    <template #modal-footer>
      <b-button
        size="md"
        variant="primary"
        :disabled="bonusString !== null"
        @click="changeWithBonus"
      >
        {{ withBonusButtonText }}
      </b-button>
      <b-spinner
        v-if="loading"
        variant="primary"
        class="m-1"
      />
      <b-button
        v-else
        size="md"
        variant="success"
        id='buttonOK-tooltip'
        @click="updateReport"
      >

        <b-tooltip
          v-if="bonusChanged"
          target="buttonOK-tooltip"
          variant="primary"
          :show="bonusChanged"
          :disabled="bonusChanged"
        >
          <span
            v-html="bonusChanged ? 'Click To Save' : ''"
          >
            {{ bonusChanged ? 'Click To Save' : '' }}
          </span>
        </b-tooltip>
        OK
      </b-button>
    </template>
    <template #modal-header>
      <b-row class="d-flex flex-row justify-content-center w-100 mb-1 mr-0 ml-0 text-capitalize">
        <b-col
          cols="12"
        >
          <span class="font-large-1">{{ comrades[index].name }}</span>
        </b-col>
        <b-col
          cols="12"
        >
          <span class="font-medium-5">{{ month }} / {{ workingDays }} days ({{ hoursInMonth }} hours)</span>
        </b-col>

      </b-row>
      <b-button size="sm" class="close" variant='light'  @click="handleClose()">
        ×
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import {
   BRow, BCol, BFormInput, BButton, BLink, BTooltip, BSpinner
} from 'bootstrap-vue-next'
import axiosIns from '@/libs/axios'
import ToastificationContentVue from '@/@core/components/toastification/ToastificationContent.vue'
import { secToTime } from '@/_helpers/time'

export default {

  name: 'SalariesPayoutView',

  components: {
    
    BRow,
    BCol,
    BLink,
    BFormInput,
    BButton,
    BTooltip,
    BSpinner,
  },

  props: {
    comrades: {
      type: [Object, Array],
      required: true,
    },
    payoutVisible: {
      type: Boolean,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    from: {
      type: [String, Date],
      required: true,
    },
    to: {
      type: [String, Date],
      required: true,
    },
  },

  data() {
    return {
      targetComrade: null,
      index: 0, // default first
      withBonus: false,
      bonusString: null,
      bonusStringNote: null,
      workingDays: 0,
      loading: false,
      originalBonus: null,
    }
  },

  computed: {
    toPayNow() {
      return (parseFloat(this.comrades[this.index]?.report?.total_to_pay) - parseFloat(this.comrades[this.index]?.report?.total_paid)).toFixed(2)
    },
    bonusColor() {
      return Number(this.bonusString) > 0 ? 'text-success'
        : Number(this.bonusString) < 0 ? 'text-danger' : ''
    },
    blockRightSwitcher() {
      return this.comrades.length - 1 === this.index
    },
    blockLeftSwitcher() {
      return this.index === 0
    },
    trackedForAMonth() {
      const hours = this.comrades[this.index].report.report.map(v => parseFloat(v.hours))
      const sum = hours.reduce((hoursSum, value) => hoursSum + parseFloat(value))
      return sum
    },
    withBonusButtonText() {
      return this.withBonus ? 'Hide Bonus' : 'Add Bonus'
    },
    toPayToolTip() {
      return this.comrades[this.index].report.report
        .map(e => `${e.billed_for} - ${e.to_pay} $`).join('<br>')
    },
    hoursInMonth() {
      return this.workingDays * 6.5
    },
    bonusChanged(){
      return this.originalBonus != this.bonusString
    },
    bonusDisplayValue(){
      return this.bonusChanged ? (parseFloat(this.comrades[this.index].report.total_to_pay) - parseFloat(this.originalBonus) + parseFloat(this.bonusString)).toFixed(2) : this.comrades[this.index].report.total_to_pay
    }
  },

  beforeMount() {
    axiosIns.get(`business-day/${this.from}`).then(res => this.workingDays = res.data.data).catch(e => console.error(e))
    this.originalBonus = this.comrades[this.index]?.report?.bonus
    this.bonusString = this.comrades[this.index]?.report?.bonus
    this.bonusStringNote = this.comrades[this.index]?.report?.bonus_note
  },
  created() {
    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') {
        if (this.blockRightSwitcher) {
          return
        }
        this.changeComrade('increase')
      } else if (e.key === 'ArrowLeft') {
        if (this.blockLeftSwitcher) {
          return
        }
        this.changeComrade('decrease')
      }
    })
  },
  methods: {
    secToTime,
    handleBonusChange(value){
      if( value.length < 1 ){
        this.bonusString = 0
      }
    },
    changeWithBonus() {
      this.withBonus = !this.withBonus
    },
    changeComrade(type) {
      if (type === 'increase') {
        this.index += 1
        this.originalBonus = this.comrades[this.index]?.report?.bonus
        this.bonusString = this.comrades[this.index]?.report?.bonus
        this.bonusStringNote = this.comrades[this.index]?.report?.bonus_note
        this.withBonus = false;
        return
      }
      this.index -= 1
      this.originalBonus = this.comrades[this.index]?.report?.bonus
      this.bonusString = this.comrades[this.index]?.report?.bonus
      this.bonusStringNote = this.comrades[this.index]?.report?.bonus_note
      this.withBonus = false;
    },
    handleClose() {
      this.$emit('closePayout', false)
      this.index = 0
    },
    updateReport() {
      if (!this.bonusStringNote) {
        this.$toast({
          component: ToastificationContentVue,
          position: 'top-right',
          props: {
            title: 'Note was not provided',
            icon: 'XIcon',
            variant: 'danger',
          },
        })

        return
      }

      this.loading = true
      const dataToSend = this.withBonus || this.comrades[this.index].report.bonus !== null ? {
        bonus: this.bonusString,
        from: this.from,
        to: this.to,
        note: this.bonusStringNote,
        to_pay_now: this.comrades[this.index].report.to_pay_now,
      } : {
        from: this.from,
        to: this.to,
        to_pay_now: this.comrades[this.index].report.to_pay_now,
      }

      axiosIns.put(`/comrade/${this.comrades[this.index].id}`, dataToSend)
        .then(res => {
          this.loading = false
          this.$emit('bonus-change', { id: this.comrades[this.index].id, note: this.comrades[this.index].bonus_note })
          this.originalBonus = this.comrades[this.index]?.report?.bonus
          if (!this.blockRightSwitcher) this.changeComrade('increase')

          this.$toast({
            component: ToastificationContentVue,
            position: 'top-right',
            props: {
              title: 'Success',
              icon: 'XIcon',
              variant: 'success',
            },
          })
        })
        .catch(e => {
          this.loading = false
          console.error(e)
          this.$toast({
            component: ToastificationContentVue,
            position: 'top-right',
            props: {
              title: e,
              icon: 'XIcon',
              variant: 'danger',
            },
          })
        })
    },
  },
}
</script>

<style>
  /* span {
    color: #b4b7bd !important;
  } */

  /* .modal-close-button{
      right: 0 !important; padding: 0.2rem 0.62rem;
      box-shadow: 0 5px 20px 0 rgb(34 41 47 / 10%) !important;
      border-radius: 0.357rem !important;
      background: #fff !important;
      color: #5e5873 !important;
      width: 34px !important;
      height: 34px !important;
  }

  .modal-close-button-dark{
      right: 0 !important; padding: 0.2rem 0.62rem;
      box-shadow: 0 5px 20px 0 rgb(34 41 47 / 10%) !important;
      border-radius: 0.357rem !important;
      background: #fff !important;
      color: #5e5873 !important;
      width: 34px !important;
      height: 34px !important;
  } */

  #tooltip-button-interactive{
    cursor: pointer;
  }
</style>
