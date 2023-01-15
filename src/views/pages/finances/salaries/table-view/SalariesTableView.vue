<template>
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
        :items="tableData"
        :fields="fields"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        show-empty
        responsive
      >
        <template #cell(bonus)="data">
          <span
            :class="Number(data.item.bonus) < 0 ? `text-danger` : Number(data.item.bonus) !== 0 ? `text-success` : ``"
          >
            {{ data.item.bonus }} $
          </span>
        </template>
        <template #cell(to_pay)="data">
          <span>
            {{ data.item.to_pay }} $
          </span>
        </template>
        <template #cell(base_salary)="data">
          <span v-if="data.item.base_salary">
            {{ data.item.base_salary }} $
          </span>
          <span v-else>-</span>
        </template>
        <template #cell(paid)="data">
          <b-form-input
            v-model="data.item.paid"
            @focusout="changeTotalPaid(data.item.paid, data.item.comrade_id)"
            @focusin="comradeTotalPaidCopy = data.item.paid"
          />
        </template>
        <template #empty="scope">
          <h4>{{ scope.emptyText }}</h4>
        </template>
      </b-table>
    </b-overlay>
  </div>
</template>

<script>
import {
  BTable, BFormInput, BOverlay,
} from 'bootstrap-vue'
import { analysError } from '@/_helpers/analys_error'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import axios from 'axios'
import useJwt from '@/auth/jwt/useJwt'
import SalariesPayoutView from '@/views/pages/finances/salaries/payout-view/SalariesPayoutView.vue'

export default {
  components: {
    BTable,
    BFormInput,
    BOverlay,
    SalariesPayoutView,
  },
  props: {
    tableData: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    from: {
      type: [Date, String],
      required: true,
    },
    to: {
      type: [Date, String],
      required: true,
    },
  },
  data() {
    return {
      comradeTotalPaidCopy: '',
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
          key: 'base_salary',
          label: 'Base Salary',
          tdClass: 'text-center',
          thClass: 'text-center',
        },
        {
          key: 'approved_overtime',
          label: 'Approved Overtime',
          tdClass: 'text-center',
          thClass: 'text-center',
        },
        {
          key: 'bonus',
          label: 'Bonus/Deduction',
          tdClass: 'text-center',
          thClass: 'text-center',
        },
        {
          key: 'to_pay',
          label: 'To Pay',
          tdClass: 'text-center',
          thClass: 'text-center',
        },
        {
          key: 'paid',
          label: 'Paid',
          tdClass: 'text-center',
          thClass: 'text-center',
        },
      ],
    }
  },
  methods: {
    // emitId(item){
    //   this.$emit('emit_comrade_id', item.comrade_id)
    // },
    changeTotalPaid(totalPaid, comradeId) {
      if (Number(this.comradeTotalPaidCopy) === Number(totalPaid)) { return }
      this.$emit('update-loading', true)
      const data = {
        from: this.from,
        to: this.to,
        comrade_id: comradeId,
        total_paid: totalPaid,
        salaries_payout_table_view: true,
      }
      axios.post(`${process.env.VUE_APP_API_URL}/comradeTP`, data, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.$emit('update-loading', false)
      }).catch(error => {
        this.$emit('update-loading', false)
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
