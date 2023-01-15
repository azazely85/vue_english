<template>
  <b-sidebar
    id="add-new-user-sidebar"
    :visible="isAddNewTransactionSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @change="(val) => this.$emit('update:is-add-new-transaction-sidebar-active', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">
          Add New Transaction
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
        <b-form-group
          label-for="flag"
        >
          <div
            id="flag"
            class="d-flex justify-content-center flex-row m-1"
          >
            <b-form-radio
              v-model="transactionFlag"
              value="E"
              class="m-1"
              @change="toggleTransactionData()"
            >
              Expense
            </b-form-radio>
            <b-form-radio
              v-model="transactionFlag"
              value="I"
              class="m-1"
              @change="toggleTransactionData()"
            >
              Income
            </b-form-radio>
            <b-form-radio
              v-model="transactionFlag"
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
          v-if="transactionFlag === 'T'"
          label="Account From"
          label-for="from_account"
        >
          <b-form-select
            id="from_account"
            v-model="transactionFromAccount"
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
          :label="transactionFlag === 'T' ? `Account To` : `Account`"
          label-for="to_wallet"
        >
          <b-form-select
            id="to_wallet"
            v-model="transactionToAccount"
            :options="transactionFlag !== 'T' ? accounts : walletsWithoutFromAccount"
            :disabled="transactionFlag === 'T' && blockFromAccount"
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

        <b-form-group
          label="Amount"
          label-for="amount"
        >
          <div class="d-flex flex-row flex-nowrap">
            <b-form-input
              v-if="transactionCurrencyType === 'H'"
              id="amount"
              v-model="transactionAmount"
              v-money="money"
              class="mr-1"
              @keydown="$event.key === '-' ? $event.preventDefault() : null"
              @focusout="calculateRecalculatedAmount"
            />
            <b-form-input
              v-else
              id="amount"
              v-model="transactionAmount"
              v-money="money_dollar"
              class="mr-1"
              @keydown="$event.key === '-' ? $event.preventDefault() : null"
              @focusout="calculateRecalculatedAmount"
            />
            <b-form-select
              id="currency_type"
              v-model="transactionCurrencyType"
              :options="currencies"
              value-field="flag"
              text-field="name"
            />
<!--            :disabled="transactionFlag === 'T'"-->
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
                v-model="transactionExchangeRate"
                type="number"
                step="0.000001"
                class="mr-1"
                @focusout="calculateRecalculatedAmount"
              />
              <div
                v-if="!editRecalculatedAmount"
                class="w-50"
                @click="editRecalculatedAmount=true"
              >
                {{ transactionRecalculatedAmount }}
              </div>

              <b-form-input
                v-if="editRecalculatedAmount"
                id="recalculated_amount"
                v-model="transactionRecalculatedAmount"
                v-money="transactionCurrencyType === 'H' ? money_dollar : money"
                @keydown="$event.key === '-' ? $event.preventDefault() : null"
                @focusout="calculateAmountFromRecalculated"
              />
            </div>
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
            v-model="transactionDateBill"
            class="form-control"
            :config="datePickerConfig"
            @input="getRate"
          />

        </b-form-group>

        <!-- Description -->
        <b-form-group
          label="Description"
          label-for="description"
        >
          <b-form-input
            id="description"
            v-model="transactionDescription"
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
              v-model="transactionFrequency"
              name="repeat"
              type="number"
            />

            <b-form-select
              v-model="transactionFrequencyType"
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
                v-model="transactionEnd"
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
            Add
          </b-button>
          <b-spinner
            v-if="loading"
            class="mr-2"
          />
          <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            type="button"
            variant="outline-secondary"
            @click="clearAndHide()"
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
  BButton,
  BForm,
  BFormCheckbox,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BFormRadio,
  BFormSelect,
  BSidebar,
  BTooltip,
  BSpinner,
} from 'bootstrap-vue'
import {
  alphaNum, email, min, required,
} from '@validations'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import axios from 'axios'
import { VMoney } from 'v-money'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import flatPickr from 'vue-flatpickr-component'
import useJwt from '@/auth/jwt/useJwt'
import { analysError } from '@/_helpers/analys_error'
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
    flatPickr,
    BTooltip,
    BFormCheckbox,
    BSpinner,
  },
  directives: {
    Ripple,
    money: VMoney,
  },
  categories: {
    type: [Object, Array]
  },
  model: {
    prop: 'isAddNewTransactionSidebarActive',
    event: 'update:is-add-new-transaction-sidebar-active',
  },
  props: {
    isAddNewTransactionSidebarActive: {
      type: Boolean,
      required: true,
    },
    datePickerConfig: {
      type: [Object, Array],
      required: true,
    },
    accounts: {
      type: [Object, Array],
      required: true,
    },
    selectedId: {
      type: Number,
    },
  },
  data() {
    return {
      required,
      alphaNum,
      email,
      min,
      loading: false,
      editRecalculatedAmount: false,
      category: '',
      types: [
        { name: 'Days' },
        { name: 'Weeks' },
        { name: 'Months' },
        { name: 'Years' },
      ],
      categories: [],
      transactionDescription: '',
      transactionFromAccount: '',
      transactionToAccount: this.selectedId !== 0 ? this.selectedId : this.accounts.length > 0 ?? this.accounts[0]?.id,
      transactionDateBill: this.$moment().format('YYYY-MM-DD H:mm:ss'),
      transactionAmount: 0,
      transactionFlag: 'E',
      transactionRepeat: null,
      transactionFrequency: null,
      transactionFrequencyType: null,
      transactionExchangeRate: null,
      transactionEnd: null,
      transactionRecalculatedAmount: null,
      transactionCurrencyType: this.selectedId === 0 ? 'D' : this.accounts.length > 0 ?? this.accounts[0]?.currency_type,
      // transactionData: {
      //   description: null,
      //   from_account: null,
      //   to_account: this.selectedAccount.id,
      //   date_bill: this.$moment().format('YYYY-MM-DD'),
      //   amount: null,
      //   transaction_flag: 'E',
      //   repeat: null,
      //   frequency: null,
      //   frequency_type: null,
      //   end: null,
      //   // exchange_rate: this.getExchangeRate(this.transactionData.to_account),
      //   exchange_rate: null,
      //   currency_type: this.selectedAccount.currency_type,
      //   recalculated_amount: null,
      // },
      currencies: [
        { name: 'UAH', flag: 'H' },
        { name: 'USD', flag: 'D' },
      ],
      is_repeat: false,
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
      walletsWithoutFromAccount: [],
      showRepeat: false,
      // showRate: false,
      targetAccountCurrencyType: '',
      amountForCalculation: 0,
    }
  },
  computed: {
    validTransactionAmount() {
      return this.transactionAmount ? this.transactionAmount.replace(/(₴|\$)/g, '')
        .replace(/\s+/g, '')
        .replace(',', '.') : ''
    },
    validRecalculatedAmount() {
      return this.transactionRecalculatedAmount ? this.transactionRecalculatedAmount.replace(/(₴|\$)/g, '')
        .replace(/\s+/g, '')
        .replace(',', '.') : ''
    },
    showRate() {
      if (!this.accounts.find(account => account.id === this.transactionToAccount)?.currency_type){
        return false
      }
      return this.transactionCurrencyType !== this.accounts.find(account => account.id === this.transactionToAccount)?.currency_type
    },
  },
  watch: {
    showRate(newVal) {
      if (newVal) {
        this.getRate()
        return
      }
      this.transactionExchangeRate = null
    },
    selectedId(newValue) {
      if (newValue !== 0) {
        this.transactionToAccount = newValue
        this.transactionCurrencyType = this.accounts
            .find(account => account.id === this.transactionToAccount).currency_type
      }
    }
  },
  beforeMount() {
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
    changeCurrencyType() {
      if (this.transactionFlag !== 'T') {
        this.transactionCurrencyType = this.accounts
            .find(account => account.id === this.transactionToAccount).currency_type
        return
      }
      this.transactionCurrencyType = this.accounts
          .find(account => account.id === this.transactionFromAccount).currency_type
    },
    calculateRecalculatedAmount() {
      if (this.transactionCurrencyType === 'H') {
        this.transactionRecalculatedAmount = `$ ${parseFloat((this.validTransactionAmount
            * (1 / this.transactionExchangeRate))).toFixed(2)}`
        return
      }
      this.transactionRecalculatedAmount = `₴ ${parseFloat((this.validTransactionAmount * this.transactionExchangeRate))
        .toFixed(2)}`
    },
    calculateAmountFromRecalculated() {
      this.editRecalculatedAmount = false
      if (this.transactionCurrencyType === 'H') {
        this.transactionAmount = `₴ ${parseFloat((this.validRecalculatedAmount
            * this.transactionExchangeRate)).toFixed(2)}`
        return
      }
      this.transactionAmount = `$ ${parseFloat((this.validRecalculatedAmount * (1 / this.transactionExchangeRate))).toFixed(2)}`
    },
    getRate() {
      if (!this.showRate) {
        return
      }
      axios.get(`${process.env.VUE_APP_API_URL}/getRate?date=${this.transactionDateBill}`, {
        headers:
            { Authorization: `Bearer ${useJwt.getToken()}` },
      })
        .then(response => {
          this.transactionExchangeRate = response.data.data
        })
    },
    clearAndHide(onlyClear = null) {
      this.transactionToAccount = this.selectedId !== 0 ? this.selectedId : this.accounts[0].id
      this.transactionAmount = ''
      this.transactionFromAccount = null
      this.transactionRecalculatedAmount = null
      this.transactionFlag = 'E'
      if (!onlyClear) {
        this.$emit('open-close-create-transaction-sidebar', false)
      }
    },
    unblockFromAccountSelect() {
      this.blockFromAccount = false
      this.walletsWithoutFromAccount = this.accounts.filter(account => account.id !== this.transactionFromAccount)
      this.transactionCurrencyType = this.accounts.find(account => account.id === this.transactionFromAccount).currency_type
    },
    toggleTransactionData() {
      switch (this.transactionFlag) {
        case 'I': {
          this.transactionFromAccount = null
          break
        }
        case 'E': {
          this.transactionFromAccount = null
          break
        }
        case 'T': {
          this.transactionDescription = null
          break
        }
      }
    },
    validAmount(amount) {
      if (this.transactionCurrencyType === 'H') {
        return amount.replace('₴', '').replace(/\s+/g, '').replace(',', '.')
      }
      return amount.replace('$', '').replace(/\s+/g, '').replace(',', '.')
    },
    Submit() {
      this.loading = true
      const amount = this.validAmount(this.transactionAmount)
      const data = {
        description: this.transactionDescription,
        to_account_id: this.transactionToAccount,
        from_account_id: this.transactionFlag === 'T' ? this.transactionFromAccount : '',
        amount,
        transaction_flag: this.transactionFlag,
        date_bill: this.transactionDateBill,
        frequency: this.transactionFrequency,
        frequency_type: this.transactionFrequencyType,
        repeat: this.transactionEnd,
        exchange_rate: this.transactionExchangeRate,
        recalculated_amount: this.validRecalculatedAmount,
        currency_type: this.transactionCurrencyType,
        category: this.category
      }
      axios.post(`${process.env.VUE_APP_API_URL}/transaction`, data, {
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
          this.clearAndHide(true)
          this.$emit('refetch-data')
          this.$emit('update-accounts-balances', response.data.data)
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
    // getDescription(num) {
    //   axios.get(`${process.env.VUE_APP_API_URL}/transaction?count=${num}`, {
    //     headers: {
    //       Authorization: `Bearer ${useJwt.getToken()}`,
    //     },
    //   })
    //     .then(response => {
    //       for (const value of response.data) {
    //         this.descriptions.push(value)
    //       }
    //     })
    //     .catch(error => error)
    // },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';

#add-new-user-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
</style>
