<template>
  <div>
    <note-sidebar
      :is-notes-show.sync="isNotesShow"
      :count-of-new-notes="countOfNewNotes"
      :target-transaction="targetTransaction"
      @refetch-transactions="refetchTransaction()"
    />
    <b-container class="bv-example-row" style="top: 4px;position: absolute; z-index: 10">
      <b-row align-h="end">
        <b-col
            lg="2"
            md="4"
            sm="4"
            cols="4"
        >
          <b-form-input
              id="search"
              placeholder="Search"
              v-model="searchString"
              trim
          />

        </b-col>
        <b-col
            cols="1"
        >
          <feather-icon
              icon="SearchIcon"
              size="24"
              class="cursor-pointer"
              style="margin-top: 8px;margin-left: -20px"
              v-on:click="getTransactions"
          />
        </b-col>
      </b-row>
    </b-container>
    <b-tabs
      v-model="tabIndex"
      class="w-100"
    >

      <b-tab
        v-for="tab in tabs"
        :key="tab.title"
        :title="tab.title"
        :lazy="tab.lazy"
        @click="switchTransactions(tab.onlyTrashed)"
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
          <p v-if="transactions.length === 0">
            Nothing to Show
          </p>
          <b-table
            v-else
            hover
            responsive
            :per-page="0"
            :current-page="currentPage"
            :items="transactions"
            :fields="fields"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-desc="true"
            @filtered="onFiltered"
            @sort-changed="sortChanged"
            @row-contextmenu="contextOpen"
            @row-clicked="toggleDetails"
          >

            <!-- Column: date -->
            <template
              #cell(date_bill)="data"
            >
              <div
                id="transaction_date"
                style="display: flex; flex-direction: column;"
              >
                <div>
                  {{ data.item.date_bill | moment("MM-DD-YYYY") }}
                </div>
              </div>
            </template>

            <!-- Column: category -->
            <template #cell(category)="data">
              <div style="display: flex; flex-direction: column;">
                <div>
                  {{ data.item.category.name }}
                </div>
              </div>
            </template>

            <template #cell(action)="data">
              <b-form-group>
                <feather-icon
                  v-for="menuItem in menuData"
                  :id="menuItem.text + data.item.id"
                  :key="menuItem.text"
                  :icon="menuItem.icon"
                  class="mr-50"
                  size="20"
                  @click="optionClicked(menuItem.text, menuItem.icon, data.item.id)"
                />
              </b-form-group>
            </template>

            <!-- Column: description -->
            <template #cell(description)="data">
              <div style="display: flex; flex-direction: column;">
                <div>
                  {{ data.value }}
                </div>
              </div>
            </template>

            <!-- Column: to_account -->
            <template #cell(to_account)="data">
              <div v-if="data.item.transaction_flag === 'T'">
                {{ data.item.from_account.name }} -> {{ data.item.to_account.name }}
              </div>

              <div v-else>
                {{ data.item.to_account.name }}
              </div>
            </template>

            <template #row-details="row">
              <b-table
                :items="row.item.logs"
                :fields="fieldsForLog"
              >

                <template #cell(date)="data">
                  {{ data.item.updated_at | moment("MM-DD-YYYY") }}
                </template>

                <template #cell(user)="data">
                  <span style="text-transform: uppercase">
                    <b>
                      {{ data.item.user_data[0].firstname }} {{ data.item.user_data[0].lastname }}
                      {{ data.item.user_data[0].patronymic }}
                    </b>
                  </span>
                </template>

                <template #cell(description)="data">
                  <p v-html="data.item.description" />
                </template>

              </b-table>
            </template>

            <!-- Column: amount -->
            <template
              #cell(amount)="data"
            >
              <b-badge
                :variant="getColorStatus(data.item)"
              >
                <span v-if="data.item.currency_type === 'H'">
                  <span
                    v-b-tooltip.hover.v-primary
                    :title="formatToDollar(data.item.amount * data.item.exchange_rate)"
                  >
                    {{ formatToHryvna(data.item.amount) }}
                  </span>
                </span>
                <span v-else>
                  <span
                    v-b-tooltip.hover.v-primary
                    :title="formatToHryvna(data.item.amount * data.item.exchange_rate)"
                  >
                    {{ formatToDollar(data.item.amount) }}
                  </span>
                </span>
              </b-badge>
            </template>

            <template
              #cell(toBalance)="data"
            >
              <b-badge
                v-if="data.item.to_account.currency_type === 'H'"
                :variant="data.item.to_account_balance > 0 ? `light-success` : data.item.to_account_balance < 0
                  ? `light-danger` : ``"
              >
                {{ data.item.to_account.name + ' ' + formatToHryvna(data.item.to_account_balance) }}
              </b-badge>

              <b-badge
                v-else
                :variant="data.item.to_account_balance > 0 ? `light-success` : data.item.to_account_balance < 0
                  ? `light-danger` : ``"
              >
                {{ data.item.to_account.name + ' ' + formatToDollar(data.item.to_account_balance) }}
              </b-badge>

            </template>
            <template
              #cell(fromBalance)="data"
            >
              <span v-if="!data.item.from_account">
                -
              </span>

              <b-badge
                v-else-if="data.item.from_account && data.item.from_account.currency_type === 'H'"
                :variant="data.item.from_account_balance > 0 ? `light-success` : data.item.from_account_balance < 0
                  ? `light-danger` : ``"
              >
                {{ data.item.from_account.name + ' ' +  formatToHryvna(data.item.from_account_balance) }}
              </b-badge>

              <b-badge
                v-else
                :variant="data.item.from_account_balance > 0 ? `light-success` : data.item.from_account_balance < 0
                  ? `light-danger` : ``"
              >
                {{ data.item.from_account.name + ' ' +  formatToDollar(data.item.from_account_balance) }}
              </b-badge>

            </template>
          </b-table>
        </b-overlay>

      </b-tab>
    </b-tabs>
    <b-container class="bv-example-row" v-if="transactions.length > 0">
      <b-row align="end">
        <b-col
            cols="10"
        >
          <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              align="center"
              size="sm"
              class="my-0"
              @change="pagination"
          />
        </b-col>
        <b-col
            cols="2"
            align="end"
        >
          <b-form-select
              id="pages"
              size="sm"
              @change="getTransactions"
              v-model="perPage"
              :options="perPages"
              value-field="name"
              text-field="name"
          />
        </b-col>
      </b-row>
    </b-container>
    <b-form-group>
      <div
        class="fixed-bottom text-right"
      >
        <b-button
          v-if="showCreateTransaction"
          variant="primary"
          class="m-2"
          @click="$emit('open-close-create-transaction-sidebar', true)"
        >
          Create Transaction
        </b-button>
      </div>
    </b-form-group>
    <!-- context -->
    <vue-context ref="transaction_context">
      <li>
        <b-link
          v-for="data in menuData"
          :key="data.text"
          class="d-flex align-items-center"
          @click="optionClicked(data.text,data.icon)"
        >
          <feather-icon
            :icon="data.icon"
            size="16"
          />
          <span
            class="ml-75"
          >{{ data.text }}</span>
        </b-link>
      </li>
    </vue-context>
  </div>
</template>

<script>
import {
  BTable, BBadge, BFormGroup, BPagination, BContainer, BRow,BFormInput,
  BButton, BLink, BTabs, BTab, BOverlay, BCol, VBTooltip, BFormSelect,
} from 'bootstrap-vue'
import axios from 'axios'
import VueContext from 'vue-context'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useJwt from '@/auth/jwt/useJwt'
import { analysError } from '@/_helpers/analys_error'
import { formatToHryvna, formatToDollar } from '@/_helpers/currency_format'
import NoteSidebar from './notes/NoteSidebar.vue'

export default {
  components: {
    BTable,
    BBadge,
    BFormGroup,
    BPagination,
    BFormSelect,
    BButton,
    BLink,
    BTabs,
    BTab,
    BOverlay,
    BCol,
    BContainer,
    BRow,
    BFormInput,
    // Context Menu
    VueContext,
    NoteSidebar,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  props: {
    selectedAccounts: {
      type: [Array, Object],
      required: true,
    },
    onlyDeletedAccountsFlag: {
      type: Boolean,
      required: true,
    },
    showCreateTransaction: {
      type: Boolean,
      required: true,
    },
    refetchTransactions: {
      type: [String],
    },
  },
  data() {
    return {
      onlyTrashedTransactions: false,
      perPage: 10,
      totalRows: 0,
      perPages: [
        {name: 10},
        {name: 25},
        {name: 50},
        {name: 100}
      ],
      searchString: '',
      sortBy: 'date_bill',
      sortDesc: false,
      currentPage: 1,
      isNotesShow: false,
      fields: [
        {
          key: 'date_bill', label: 'Date', sortable: true, tdClass: 'text-center', thClass: 'text-center',
        },
        {
          key: 'category', label: 'Category', sortable: true, tdClass: 'text-center', thClass: 'text-center',
        },
        {
          key: 'amount', label: 'Amount', sortable: true, tdClass: 'text-center', thClass: 'text-center',
        },
        {
          key: 'fromBalance', label: 'Payer', sortable: false, tdClass: 'text-center', thClass: 'text-center',
        },
        {
          key: 'toBalance', label: 'Payee', sortable: false, tdClass: 'text-center', thClass: 'text-center',
        },
        {
          key: 'description', label: 'Description', sortable: true, tdClass: 'text-center', thClass: 'text-center',
        },
        {
          key: 'action', label: 'Action', sortable: false, tdClass: 'text-center', thClass: 'text-center',
        },
      ],
      fieldsForLog: [
        { key: 'date', label: 'Date', thClass: 'transperent-color' },
        { key: 'user', label: 'User', thClass: 'transperent-color' },
        { key: 'description', label: 'Description', thClass: 'transperent-color' },
      ],
      transactions: [],
      isAddNewTransactionSidebarActive: false,
      isEdit: false,
      accountsAlistKey: 0,
      transactionsAddComponentKey: 1,
      transactionEditKey: 2,
      menuData: [
        { icon: 'EditIcon', text: 'Edit' },
        { icon: 'DeleteIcon', text: 'Delete' },
        { icon: 'MessageSquareIcon', text: 'Notes' },
      ],
      targetTransaction: 0,
      editTransaction: {
        amount: null,
        transaction_flag: null,
        currency_type: null,
        description: null,
        id: null,
        exchange_rate: null,
        category_id: null,
        from_account_id: null,
        to_account_id: null,
        frequency: null,
        frequency_type: null,
        repeat: null,
        date_bill: null,
        recalculated_amount: null,
      },
      tabs: [
        {
          title: 'Main', onlyTrashed: false, active: true, isMain: true, lazy: false,
        },
        {
          title: 'Deleted', onlyTrashed: true, active: false, lazy: true,
        },
      ],
      tabIndex: 0,
      formatedDescription: [],
      windowWidth: window.innerWidth,
      isMobile: false,
      onlyDeletedFlag: false,
      refetchBalanceFlag: false,
      refetchAccountTransactions: false,
      countOfNewNotes: 0,
      loading: false,
    }
  },
  watch: {
    selectedAccounts() {
      this.getTransactions()
    },
    onlyTrashedTransactions() {
      this.getTransactions()
    },
    refetchTransactions() {
      this.getTransactions()
    },
    currentPage() {
      this.getTransactions()
    },
  },
  created() {
    this.switchTransactions(this.onlyTrashedTransactions)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    formatToDollar,
    formatToHryvna,
    sortChanged(ctx){
      this.sortBy = ctx.sortBy;
      this.sortDesc = ctx.sortDesc;
      this.getTransactions();
    },
    getTransactions() {
      if (this.selectedAccounts.length === 0) {
        this.transactions = []
        return
      }
      this.loading = true
      const accountsIds = this.selectedAccounts.map(account => account.id)
      const getQuery = this.onlyTrashedTransactions
        ? `?page=${this.currentPage}&per_page=${this.perPage}&accounts=${accountsIds}&onlyDeleted&search=${this.searchString}&sortBy=${this.sortBy}&sortType=${this.sortDesc}`
        : `?page=${this.currentPage}&per_page=${this.perPage}&accounts=${accountsIds}&search=${this.searchString}&sortBy=${this.sortBy}&sortType=${this.sortDesc}`
      axios.get(`${process.env.VUE_APP_API_URL}/account/transactions${getQuery}`, {
        headers: {
          Authorization: `Bearer ${useJwt.getToken()}`,
        },
      }).then(response => {
        this.loading = false
        this.transactions = response.data.data.data
        this.totalRows = response.data.data.total
      }).catch(error => {
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
    clearEditTransaction() {
      this.isEdit = false
      this.editTransaction = {
        amount: 0,
        transaction_flag: null,
        currency_type: null,
        description: null,
        id: null,
        exchange_rate: null,
        category_id: null,
        from_account_id: null,
        to_account_id: null,
        frequency: null,
        frequency_type: null,
        repeat: null,
        date_bill: null,
        recalculated_amount: null,
      }
    },
    toggleDetails(item) {
      if (item._showDetails) item._showDetails = false
      else this.$set(item, '_showDetails', true)

      this.formatedDescription = []
      item.logs.map(log => {
        const splitted = log.description.split('|')
        this.formatedDescription.push(splitted)
      })
    },
    switchTransactions(onlyTrashedFlag) {
      this.onlyTrashedTransactions = onlyTrashedFlag
    },
    pagination(value) {
      this.currentPage = value
    },
    changeTab() {
      this.tabIndex = 0
      this.onlyTrashedTransactions = false
    },
    contextOpen(transaction, index, event) {
      event.preventDefault()
      if (transaction.deleted_at) {
        return
      }
      this.targetTransaction = transaction.id
      this.$refs.transaction_context.open(event)
    },
    optionClicked(text, icon, transactionId = null) {
      if (this.onlyTrashedTransactions) {
        return
      }
      if (transactionId) {
        this.targetTransaction = transactionId
      }
      if (text === 'Edit') {
        const self = this
        const trans = this.transactions.find(transaction => transaction.id === self.targetTransaction)
        this.editTransaction = { ...trans }
        this.$emit('init-editable-transaction', this.editTransaction)
        this.$emit('open-close-edit-transaction-sidebar', true)
        // this.editTransaction = { ...this.items.find(transaction => transaction.id === self.targetTransaction) }
      } else if (text === 'Delete') {
        this.deleteTransaction(this.targetTransaction)
      } else if (text.includes('Notes')) {
        this.isNotesShow = true
      }
    },
    isTargetTransaction(element, index, array) {
      return element.id === this.targetTransaction
    },
    deleteTransaction(transactionId) {
      // this.isTargetTransaction()
      if (confirm('Are you sure?')) {
        this.loading = true
        axios.delete(`${process.env.VUE_APP_API_URL}/transaction/${transactionId}`, {
          headers: {
            Authorization: `Bearer ${useJwt.getToken()}`,
          },
        }).then(response => {
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
          const index = this.transactions.findIndex(this.isTargetTransaction)
          this.transactions.splice(index, 1)
          this.$emit('update-accounts-balances', response.data.data)
          this.$emit('refetch-data', { account: response.data.data, is_edit: true })
        }).catch(error => {
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
      }
    },
    refetchAccountsForTransactionAdd() {
      this.transactionsAddComponentKey += 1
    },
    refetchAccountsForTransactionEdit() {
      this.transactionEditKey += 1
    },
    getColorStatus(transaction) {
      let flag = transaction.transaction_flag
      const account = this.selectedAccounts
      const accountNew = account.filter(value => value !== 'NaN')
      if (flag === 'T') {
        if (transaction.from_account_id === String(accountNew)
            || (accountNew.includes(String(transaction.from_account_id))
                && !accountNew.includes(String(transaction.from_account_id))
                && !accountNew.includes(String(transaction.to_account_id)))) {
          flag = 'E'
        } else if (transaction.to_account_id === String(accountNew)
            || (accountNew.includes(String(transaction.to_account_id))
                && !accountNew.includes(String(transaction.from_account_id))
                && !accountNew.includes(String(transaction.to_account_id)))) {
          flag = 'I'
        }
      }
      switch (flag) {
        case 'I': {
          return 'light-success'
        }
        case 'E': {
          return 'light-danger'
        }
        case 'T': {
          return 'light-warning'
        }
        default: {
          return 'light'
        }
      }
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    refetchTransaction() {
      this.accountsAlistKey += 1
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-context.scss';
</style>

<style>
.hidden_header {
  display: none;
}
.loading {
  opacity: 0.5;
}
.transperent-color {
  background-color: transparent!important;
}
.app-content {
  padding: calc(2rem + 4.45rem + 1.3rem) 2rem 0!important;
}
</style>
