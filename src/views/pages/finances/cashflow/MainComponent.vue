<template>
  <b-card>
    <b-row>
      <b-col
        cols="12"
        xl="2"
        lg="4"
        md="5"
        sm="6"
      >
        <accounts-list
          :account-balances="accountBalances"
          @account-selected="accountSelected"
          @fill-accounts-list-at-sidebars="fillAccounts"
          @only-deleted-accounts="onlyDeletedAccounts"
          @render-transaction-add="renderTransactionAddFunc"
        />
      </b-col>
      <b-col
        cols="12"
        xl="10"
        lg="8"
        md="7"
        sm="6"
      >
        <transactions-list
          :selected-accounts="selectedAccounts"
          :refetch-transactions="refetchTransactionsFlag"
          :only-deleted-accounts-flag="onlyDeletedAccountsFlag"
          :show-create-transaction="renderTransactionAdd"
          @open-close-create-transaction-sidebar="openCloseCreateTransactionSidebar"
          @open-close-edit-transaction-sidebar="openCloseEditTransactionSidebar"
          @update-accounts-balances="updateAccountsBalances"
          @init-editable-transaction="initEditableTransaction"
          @refetch-data="refetchTransactions()"
        />
      </b-col>
    </b-row>

    <transactions-add
      v-if="renderTransactionAdd"
      :accounts="accounts"
      :selected-id="selectedId"
      :is-add-new-transaction-sidebar-active.sync="isAddNewTransactionSidebarActive"
      :date-picker-config="datePickerConfig"
      @open-close-create-transaction-sidebar="openCloseCreateTransactionSidebar"
      @refetch-data="refetchTransactions()"
      @update-accounts-balances="updateAccountsBalances"
    />
    <transaction-edit
      v-if="renderTransactionEdit"
      :is-edit.sync="isEditTransactionSidebarActive"
      :editable-transaction="editableTransaction"
      :date-picker-config="datePickerConfig"
      :accounts="accounts"
      @open-close-edit-transaction-sidebar="openCloseEditTransactionSidebar"
      @refetch-data="refetchTransactions()"
      @update-accounts-balances="updateAccountsBalances"
    />
  </b-card>
</template>

<script>
import {
  BRow, BCol, BCard,
} from 'bootstrap-vue-next'

import AccountsList from '@/views/pages/finances/cashflow/accounts/AccountsList.vue'
import TransactionsList from '@/views/pages/finances/cashflow/transactions/TransactionsList.vue'
import TransactionEdit from '@/views/pages/finances/cashflow/transactions/transaction-edit/TransactionEdit.vue'
import TransactionsAdd from '@/views/pages/finances/cashflow/transactions/transaction-add/TransactionsListAddNew.vue'

export default {
  components: {
    BRow,
    BCol,
    BCard,
    AccountsList,
    TransactionsList,
    TransactionsAdd,
    TransactionEdit,
  },
  data() {
    return {
      tabs: [
        { title: 'Main', onlyDeleted: false, active: true },
        { title: 'Archived', onlyDeleted: true, active: false },
      ],
      onlyDeletedAccountsFlag: false,
      selectedAccounts: [],
      isAddNewTransactionSidebarActive: false,
      isEditTransactionSidebarActive: false,
      refetchTransactionsFlag: '',
      accounts: [],
      datePickerConfig: {
        dateFormat: 'Y-m-d H:i:s',
        enableTime: true,
        enableSeconds: true,
        time_24hr: true,
      },
      renderTransactionAdd: false,
      renderTransactionEdit: false,
      accountBalances: [],
      editableTransaction: {},
      selectedId: 0
    }
  },
  methods: {
    initEditableTransaction(transaction) {
      this.editableTransaction = transaction
      this.renderTransactionEdit = true
    },
    updateAccountsBalances(balances) {
      this.accountBalances = balances
    },
    renderTransactionAddFunc(flag) {
      this.renderTransactionAdd = flag
    },
    onlyDeletedAccounts(flag) {
      this.onlyDeletedAccountsFlag = flag
    },
    fillAccounts(accounts) {
      this.accounts = accounts
    },
    refetchTransactions() {
      this.refetchTransactionsFlag = new Date().toString() // new date for unique
    },
    openCloseCreateTransactionSidebar(flag) {
      if (this.accounts.length > 0) {
        this.isAddNewTransactionSidebarActive = flag
      }
      if (this.selectedAccounts.length) {
        this.selectedId = this.selectedAccounts[0].id
      }
    },
    openCloseEditTransactionSidebar(flag) {
      this.renderTransactionEdit = flag
      this.isEditTransactionSidebarActive = flag
    },
    accountSelected(accounts) {
      this.selectedAccounts = accounts
    },
    switchAccountsList(onlyDeletedFlag) {
      this.onlyDeletedFlag = onlyDeletedFlag
    },
  },
}
</script>
