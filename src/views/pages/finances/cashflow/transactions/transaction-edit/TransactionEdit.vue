<template>
  <b-sidebar
    id="edit-transaction-sidebar"
    :visible="isEdit"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @change="(val) => $emit('open-close-edit-transaction-sidebar', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">
          Edit Transaction
        </h5>

        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          size="16"
          @click="hide"
        />

      </div>

      <!-- BODY -->
      <!-- Form -->
      <b-form
        class="p-2"
        @submit.prevent="Submit()"
      >
        <!-- Flag -->
        <b-form-group
          label-for="flag"
        >
          <div
            id="flag"
            class="d-flex justify-content-center flex-row m-1"
          >
            <b-form-radio
              v-model="editableTransactionFlag"
              value="E"
              class="m-1"
              @change="toggleTransactionData()"
            >
              Expense
            </b-form-radio>
            <b-form-radio
              v-model="editableTransactionFlag"
              value="I"
              class="m-1"
              @change="toggleTransactionData()"
            >
              Income
            </b-form-radio>
            <b-form-radio
              v-model="editableTransactionFlag"
              value="T"
              class="m-1"
              @change="toggleTransactionData()"
            >
              Transfer
            </b-form-radio>
          </div>
        </b-form-group>

        <!-- From Account -->
        <b-form-group
          v-if="editableTransactionFlag === 'T'"
          label="From"
          label-for="from_account"
        >
          <b-form-select
            id="from_account"
            v-model="editableTransactionFromAccount"
            :options="accounts"
            value-field="id"
            text-field="name"
            @change="unblockFromAccountSelect()"
          >
            <template v-slot:first>
              <option
                value="null"
                selected
              >
                - Select Account -
              </option>
            </template>
          </b-form-select>
        </b-form-group>

        <!-- To Account -->
        <b-form-group
          label="To"
          label-for="to_wallet"
        >
          <b-form-select
            id="to_wallet"
            v-model="editableTransactionToAccount"
            :options="editableTransactionFlag !== 'T' ? accounts : walletsWithoutFromAccount"
            value-field="id"
            text-field="name"
            @change="changeCurrencyType"
          >
            <template v-slot:first>
              <option
                value="null"
                selected
                disabled
              >
                - Select Account -
              </option>
            </template>
          </b-form-select>

        </b-form-group>

        <!-- Amount -->
        <b-form-group
          label="Amount"
          label-for="amount"
        >
          <div class="d-flex flex-row flex-nowrap">
            <b-form-input
              v-if="editableTransactionCurrencyType === 'H'"
              id="amount"
              v-model="editableTransactionAmount"
              v-money="money"
              class="mr-1"
              @keydown="$event.key === '-' ? $event.preventDefault() : null"
              @focusout="calculateRecalculatedAmount"
            />
            <b-form-input
              v-else
              id="amount"
              v-model="editableTransactionAmount"
              v-money="money_dollar"
              class="mr-1"
              @keydown="$event.key === '-' ? $event.preventDefault() : null"
              @focusout="calculateRecalculatedAmount"
            />
            <b-form-select
              id="currency_type"
              v-model="editableTransactionCurrencyType"
              :options="currencies"
              value-field="flag"
              text-field="name"
              :disabled="editableTransactionFlag === 'T'"
            />
          </div>
        </b-form-group>

        <b-form-group
          v-if="showRate"
          label="Exchange Rate"
          label-for="exchange_rate"
        >
          <div class="d-flex flex-row flex-nowrap">
            <div class="d-flex align-items-center">
              <b-form-input
                id="exchange_rate"
                v-model="editableTransactionExchangeRate"
                type="number"
                step="0.00000001"
                class="mr-1"
                @focusout="calculateRecalculatedAmount"
              />
              <div
                v-if="!editRecalculatedAmount"
                ref="recalculated_amount"
                class="w-50"
                @click="editRecalculatedAmount=true"
              >
                {{ editableTransactionRecalculatedAmount }}
              </div>

            </div>
            <b-form-input
              v-if="editRecalculatedAmount"
              id="recalculated_amount"
              v-model="editableTransactionRecalculatedAmount"
              v-money="editableTransactionCurrencyType === 'H' ? money_dollar : money"
              @keydown="$event.key === '-' ? $event.preventDefault() : null"
              @focusout="calculateAmountFromRecalculated"
            />
          </div>
        </b-form-group>
        <b-form-group
            label="Category"
            label-for="category"
        >
          <v-select
              :options="categories"
              v-model="category"
              label="name"
          >
            <template v-slot:no-options="{ search, searching }">
              <template v-if="searching">
                <b-button
                    v-if="!loading"
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    variant="primary"
                    class="mr-2"
                    v-on:click="addCategory(search)"
                >
                  Add {{ search }}
                </b-button>
              </template>
            </template>
          </v-select>
        </b-form-group>
        <!-- Date&time -->
        <b-form-group
          label="Date and time"
          label-for="date_time"
        >

          <flat-pickr
            id="date_time"
            v-model="editableTransactionDateBill"
            class="form-control"
            :config="datePickerConfig"
            @input="getRateByDate"
          />
        </b-form-group>

        <!-- Description -->
        <b-form-group
          label="Description"
          label-for="description"
        >
          <b-form-input
            id="description"
            v-model="editableTransactionDescription"
            autofocus
            trim
          />
        </b-form-group>

        <!-- Repeat -->
        <b-form-group
          v-if="showRepeat"
          label="Repeat"
          label-for="is_repeat"
        >
          <b-form-checkbox
            id="is_repeat"
            v-model="is_repeat"
            name="is_repeat"
            @change="toggleRepeatData()"
          >
            Repeat
          </b-form-checkbox>
        </b-form-group>

        <div v-if="is_repeat">
          <!-- Repeat -->
          <b-form-group
            label="Every"
            label-for="every"
          >
            <b-form-input
              id="every"
              v-model="editTransaction.repeat"
              name="repeat"
              type="number"
            />

            <b-form-select
              v-model="editTransaction.frequency_type"
              :options="types"
              value-field="name"
              text-field="name"
            >
              <template v-slot:first>
                <option
                  value="null"
                  selected
                  disabled
                >
                  - Select Type -
                </option>
              </template>
            </b-form-select>

            <b-form-group
              label="End"
              label-for="end"
            >
              <b-form-input
                id="end"
                v-model="editTransaction.end"
                type="number"
              />
            </b-form-group>
          </b-form-group>
        </div>

        <!-- Form Actions -->
        <div class="d-flex mt-2">
          <b-button
            v-if="!loading"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="mr-2"
            type="submit"
          >
            Edit
          </b-button>
          <b-spinner
            v-if="loading"
            class="mr-2"
          />
          <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            type="button"
            variant="outline-secondary"
            @click="clearAndHide"
          >
            Cancel
          </b-button>
        </div>
      </b-form>
    </template>
  </b-sidebar>
</template>

<script>
import {
  BSidebar, BForm, BFormGroup, BFormInput, BFormInvalidFeedback, BButton, BFormSelect, BFormRadio,
  BFormDatepicker, BTooltip, BFormCheckbox, BSpinner,
} from 'bootstrap-vue-next'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import axios from 'axios'
import { VMoney } from 'v-money'
import flatPickr from 'vue-flatpickr-component'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useJwt from '@/auth/jwt/useJwt'
import { analysError } from '@/_helpers/analys_error.js'
import axiosIns from "@/libs/axios";

export default {
  components: {
    BSidebar,
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BButton,
    vSelect,
    BFormSelect,
    BFormRadio,
    BFormDatepicker,
    BTooltip,
    BFormCheckbox,
    BSpinner,

    flatPickr,

    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
    money: VMoney,
  },
  model: {
    props: 'isEdit',
    events: 'update:is-edit',
  },
  props: {
    accounts: {
      type: [Array, Object],
      required: true,
    },
    isEdit: {
      type: Boolean,
      required: true,
    },
    editableTransaction: {
      type: Object,
      required: true,
    },
    datePickerConfig: {
      type: [Object, Array],
      required: true,
    },
  },
  data() {
    return {
      categories: [],
      loading: false,
      editRecalculatedAmount: false,
      types: [
        { name: 'Days' },
        { name: 'Weeks' },
        { name: 'Months' },
        { name: 'Years' },
      ],
      category: '',
      is_repeat: false,
      showRepeat: false,
      descriptions: [],
      money: {
        decimal: ',',
        thousands: ' ',
        prefix: '₴ ',
        precision: 2,
        masked: false,
      },
      money_dollar: {
        decimal: ',',
        thousands: ' ',
        prefix: '$ ',
        precision: 2,
        masked: false,
      },
      blockFromAccount: true,
      walletsWithoutFromAccount: this.accounts.filter(account => account.id !== this.editableTransactionFromAccount),
      currencies: [
        { name: 'UAH', flag: 'H' },
        { name: 'USD', flag: 'D' },
      ],
      targetAccountCurrencyType: null,
      defaultValues: {
        amount: null,
        transaction_flag: null,
        currency_type: null,
        description: null,
        id: null,
        exchange_rate: null,
        category_id: null,
        category: null,
        from_account_id: null,
        to_account_id: null,
        frequency: null,
        frequency_type: null,
        repeat: null,
        date_bill: null,
      },
      amountForCalculation: 0,
      editableTransactionDescription: '',
      editableTransactionFromAccount: this.accounts[1] ? this.accounts[1].id : '',
      editableTransactionToAccount: this.accounts[0].id,
      editableTransactionDateBill: '',
      editableTransactionAmount: '',
      editableTransactionFlag: 'E',
      editableTransactionRepeat: null,
      editableTransactionFrequency: null,
      editableTransactionFrequencyType: null,
      editableTransactionExchangeRate: null,
      editableTransactionEnd: null,
      editableTransactionRecalculatedAmount: '',
      editableTransactionCurrencyType: '',
    }
  },
  computed: {
    validTransactionAmount() {
      return this.editableTransactionAmount.replace(/(₴|\$)/g, '')
        .replace(/\s+/g, '')
        .replace(',', '.')
    },
    validRecalculatedAmount() {
      return this.editableTransactionRecalculatedAmount.replace(/(₴|\$)/g, '')
        .replace(/\s+/g, '')
        .replace(',', '.')
    },
    showRate() {
      return this.editableTransactionCurrencyType !== this.accounts.find(account => account.id
          === this.editableTransactionToAccount).currency_type
    },
  },
  watch: {
    showRate(newVal) {
      if (newVal) {
        this.getTransactionRate()
        return
      }
      this.editableTransactionExchangeRate = null
    },
  },
  beforeMount() {
    this.category = this.editableTransaction.category
    this.editableTransactionDescription = this.editableTransaction.description
    this.editableTransactionFromAccount = this.editableTransaction.from_account
      ? this.editableTransaction.from_account.id : ''
    this.editableTransactionToAccount = this.editableTransaction.to_account
      ? this.editableTransaction.to_account.id : ''
    this.editableTransactionDateBill = this.editableTransaction.date_bill
    this.editableTransactionAmount = parseFloat(this.editableTransaction.amount.replace(/(₴|\$)/g, '')
      .replace(/\s+/g, '')
      .replace(',', '.')).toFixed(2)
    this.editableTransactionFlag = this.editableTransaction.transaction_flag
    this.editableTransactionExchangeRate = this.editableTransaction.exchange_rate < 1
      ? parseFloat((1 / parseFloat(this.editableTransaction.exchange_rate)).toFixed(8))
      : parseFloat(this.editableTransaction.exchange_rate)
    this.editableTransactionCurrencyType = this.editableTransaction.currency_type
    this.editableTransactionRecalculatedAmount = ''
    this.getCategories()
  },
  methods: {
    getCategories() {
      axiosIns.get('categories').then(response => {
        this.categories = response.data.data
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
    addCategory(search) {
      const data = {
        name: search
      }
      axiosIns.post('categories', data).then(response => {
        this.category = response.data.data
        this.getCategories()
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
    calculateAmountFromRecalculated() {
      this.editRecalculatedAmount = false
      if (this.editableTransactionCurrencyType === 'H') {
        this.editableTransactionAmount = `₴ ${parseFloat((this.validRecalculatedAmount
            * this.editableTransactionExchangeRate)).toFixed(2)}`
        return
      }
      this.editableTransactionAmount = `$ ${parseFloat((this.validRecalculatedAmount
          * (1 / this.editableTransactionExchangeRate))).toFixed(2)}`
    },
    calculateRecalculatedAmount() {
      if (this.editableTransactionCurrencyType === 'H') {
        this.editableTransactionRecalculatedAmount = `$ ${parseFloat((this.validTransactionAmount
            * (1 / this.editableTransactionExchangeRate))).toFixed(2)}`
        return
      }
      this.editableTransactionRecalculatedAmount = `₴ ${parseFloat((this.validTransactionAmount * this.editableTransactionExchangeRate))
        .toFixed(2)}`
    },
    changeCurrencyType() {
      if (this.editableTransactionFlag !== 'T') {
        this.editableTransactionCurrencyType = this.accounts.find(account => account.id
            === this.editableTransactionToAccount).currency_type
        return
      }
      this.editableTransactionCurrencyType = this.accounts.find(account => account.id
          === this.editableTransactionFromAccount).currency_type
    },
    getTransactionRate() {
      if (!this.showRate) {
        return
      }
      axios.get(`${process.env.VUE_APP_API_URL}/getRate?transaction=${this.editableTransaction.id}`, {
        headers:
            { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.editableTransactionExchangeRate = response.data.data < 1 ? 1 / response.data.data : response.data.data
      })
    },
    getRateByDate() {
      if (!this.showRate) {
        return
      }
      axios.get(`${process.env.VUE_APP_API_URL}/getRate?date=${this.editableTransactionDateBill}`, {
        headers:
            { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.editableTransactionExchangeRate = response.data.data
      })
    },
    unblockFromAccountSelect() {
      this.blockFromAccount = false
      this.walletsWithoutFromAccount = this.accounts.filter(account => account.id !== this.editableTransactionFromAccount)
      this.transactionCurrencyType = this.accounts.find(account => account.id === this.editableTransactionFromAccount).currency_type
    },
    clearAndHide() {
      // this.editTransaction = this.defaultValues
      this.editRecalculatedAmount = false
      this.$emit('open-close-edit-transaction-sidebar', false)
    },
    toggleTransactionData() {
      switch (this.editableTransactionFlag) {
        case 'I': {
          this.editableTransactionFromAccount = null
          break
        }
        case 'E': {
          this.editableTransactionFromAccount = null
          break
        }
        case 'T': {
          this.editableTransactionDescription = null
          break
        }
        // default: {
        //   this.editTransaction = null
        //   break
        // }
      }
    },
    toggleRepeatData() {
      if (this.is_repeat === false) {
        this.editTransaction.repeat = null
        this.editTransaction.frequency = null
        this.editTransaction.frequency_type = null
        this.editTransaction.end = null
      }
    },
    validAmount(amount) {
      return amount.replace(/(₴|\$)/g, '').replace(/\s+/g, '').replace(',', '.')
    },
    Submit() {
      this.loading = true
      const amount = this.validAmount(this.editableTransactionAmount)
      const data = {
        description: this.editableTransactionDescription,
        to_account_id: this.editableTransactionToAccount,
        from_account_id: this.editableTransactionFromAccount,
        amount,
        category: this.category,
        transaction_flag: this.editableTransactionFlag,
        date_bill: this.editableTransactionDateBill,
        exchange_rate: this.editableTransactionExchangeRate,
        recalculated_amount: this.validRecalculatedAmount,
        currency_type: this.editableTransactionCurrencyType,
      }
      axios.put(`${process.env.VUE_APP_API_URL}/transaction/${this.editableTransaction.id}`, data, {
        headers:
            { Authorization: `Bearer ${useJwt.getToken()}` },
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
          this.$emit('open-close-edit-transaction-sidebar', false)
          this.$emit('refetch-data')
          this.$emit('update-accounts-balances', response.data.data)
        })
        .catch(error => {
          this.loading = false
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: analysError(error.response),
              icon: 'XIcon',
              variant: 'danger',
            },
          })
        })
    },
    getAccounts() {
      axios.get(`${process.env.VUE_APP_API_URL}/account`, {
        headers: {
          Authorization: `Bearer ${useJwt.getToken()}`,
        },
      })
        .then(response => {
          const options = response.data.data

          for (const value of options) {
            this.accounts.push(value)
          }
          this.getCurrencyType()
        })
        .catch(error => analysError(error.response))
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/libs/vue-flatpicker.scss';
#add-new-user-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
</style>
