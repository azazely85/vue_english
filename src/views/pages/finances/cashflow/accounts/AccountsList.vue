<template>

  <div>
    <account-add
      :is-add-new-user-sidebar-active.sync="isAddNewUserSidebarActive"
      @refetch-data="refetchData"
    />
    <account-group-add-new
        :is-add-new-user-sidebar-active.sync="isAddAccountGroupSidebarActive"
        @refetch-data="refetchData"
    />

    <account-edit
      :is-edit.sync="isEdit"
      :edit-account="editAccount"
      @refetch-data="refetchData()"
      @update-loading="updateLoading"
    />

    <account-group-edit
        :is-edit.sync="isEditGroup"
        :edit-group-account="editGroupAccount"
        @refetch-data="refetchData()"
        @update-loading="updateLoading"
    />

    <!-- Table Container Card -->
    <b-tabs>
      <b-tab
        v-for="tab in tabs"
        :key="tab.title"
        :title="tab.title"
        @click="switchAccountsList(tab.onlyDeleted)"
      >
        <b-overlay
          :show="loading"
          spinner-type="grow"
          spinner-variant="primary"
          :variant="`transparent`"
          :opacity="1"
          :blur="`2px`"
          rounded="sm"
          style="overflow-x: hidden !important;"
        >
          <p v-if="!accounts.length">
            Nothing to show
          </p>
          <b-container class="bv-example-row list-group" style="margin-bottom: 10px" v-else>
            <b-row v-for="accountGroup in accountsGroup" :key="accountGroup.id" class="list-group-item">
              <b-col class="cursor-pointer"
                  cols="9" v-on:click="accountGroup.show = !accountGroup.show">
                {{accountGroup.name}} <animated-number
                  :class="accountGroup.total < 0 ? `text-danger` : accountGroup.total > 0 ? `text-success` : ``"
                  :value="accountGroup.total"
                  :format-value="formatToDollar"
                  :duration="2000"
              />
              </b-col>
              <b-col
                  cols="1"
              >
                <b-dropdown
                    variant="link"
                    toggle-class="text-decoration-none"
                    no-caret
                >
                  <template v-slot:button-content>
                    <feather-icon
                        icon="MoreVerticalIcon"
                        size="16"
                        class="text-body align-middle mr-25"
                    />
                  </template>
                  <b-dropdown-item
                      v-for="menuItem in actionsMenu"
                      :key="menuItem.text"
                      @click="optionClickedGroup(menuItem.text, menuItem.icon, accountGroup.id)"
                  >
                    <feather-icon
                        :icon="menuItem.icon"
                        class="mr-50"
                    />
                    <span>{{ menuItem.text }}</span>
                  </b-dropdown-item>
                </b-dropdown>
              </b-col>
              <b-col cols="12" >
                <draggable class="list-group" v-model="accounts2[accountGroup.id]"
                           group="people" @change="(event) => changeGroup(event, accountGroup.id)"
                           :class="accountGroup.show ?  '' : !accounts2[accountGroup.id].length ? '' :'hidden'">
                  <b-row
                      class="list-group-item check"
                      v-for="(element, index) in accounts2[accountGroup.id]"
                      :key="index"
                      @click="selectAccount(element)"
                  >
                    <b-col
                        cols="1"
                    >
                        <input
                            :checked="isChecked(element)"
                            style="height: 20px; width: 20px"
                            type="checkbox"
                            @click="selectAccount(element)"
                        >
                    </b-col>
                    <b-col
                        cols="8"
                    >
                      <b-col
                          cols="12"
                      >
                        {{ element.name }}
                      </b-col>
                      <b-col
                          cols="12"
                      >
                        <animated-number
                            v-if="element.currency_type === 'D'"
                            :class="element.balance < 0 ? `text-danger` : element.balance > 0 ? `text-success` : ``"
                            :value="element.balance"
                            :format-value="formatToDollar"
                            :duration="2000"
                        />
                        <animated-number
                            v-else
                            :class="element.balance < 0 ? `text-danger` : element.balance > 0 ? `text-success` : ``"
                            :value="element.balance"
                            :format-value="formatToHryvna"
                            :duration="2000"
                        />
                      </b-col>
                    </b-col>
                    <b-col
                        cols="1"
                    >
                        <b-dropdown
                            variant="link"
                            toggle-class="text-decoration-none"
                            no-caret
                        >
                          <template v-slot:button-content>
                            <feather-icon
                                icon="MoreVerticalIcon"
                                size="16"
                                class="text-body align-middle mr-25"
                            />
                          </template>
                          <b-dropdown-item
                              v-for="menuItem in actionsMenuForDeleted"
                              v-if="!!element.deleted_at"
                              :key="menuItem.text"
                              @click="optionClicked(menuItem.text, menuItem.icon, element.id)"
                          >
                            <feather-icon
                                :icon="menuItem.icon"
                                class="mr-50"
                            />
                            <span>{{ menuItem.text }}</span>
                          </b-dropdown-item>
                          <b-dropdown-item
                              v-for="menuItem in actionsMenu"
                              v-else
                              :key="menuItem.text"
                              @click="optionClicked(menuItem.text, menuItem.icon, element.id)"
                          >
                            <feather-icon
                                :icon="menuItem.icon"
                                class="mr-50"
                            />
                            <span>{{ menuItem.text }}</span>
                          </b-dropdown-item>
                        </b-dropdown>
                    </b-col>
                  </b-row>
                </draggable>
<!--                <b-table-->
<!--                    v-else-->
<!--                    id="accounts-table"-->
<!--                    :items="accounts"-->
<!--                    :fields="fields"-->
<!--                    responsive-->
<!--                    style="overflow-x: hidden !important;"-->
<!--                    @row-contextmenu="contextOpen"-->
<!--                >-->
<!--                  &lt;!&ndash;        thead-class="hidden"&ndash;&gt;-->
<!--                  <template #cell(action)="data">-->
<!--                    <b-form-group>-->
<!--                      <b-dropdown-->
<!--                          variant="link"-->
<!--                          toggle-class="text-decoration-none"-->
<!--                          no-caret-->
<!--                      >-->
<!--                        <template v-slot:button-content>-->
<!--                          <feather-icon-->
<!--                              icon="MoreVerticalIcon"-->
<!--                              size="16"-->
<!--                              class="text-body align-middle mr-25"-->
<!--                          />-->
<!--                        </template>-->
<!--                        <b-dropdown-item-->
<!--                            v-for="menuItem in actionsMenuForDeleted"-->
<!--                            v-if="!!data.item.deleted_at"-->
<!--                            :key="menuItem.text"-->
<!--                            @click="optionClicked(menuItem.text, menuItem.icon, data.item.id)"-->
<!--                        >-->
<!--                          <feather-icon-->
<!--                              :icon="menuItem.icon"-->
<!--                              class="mr-50"-->
<!--                          />-->
<!--                          <span>{{ menuItem.text }}</span>-->
<!--                        </b-dropdown-item>-->
<!--                        <b-dropdown-item-->
<!--                            v-for="menuItem in actionsMenu"-->
<!--                            v-else-->
<!--                            :key="menuItem.text"-->
<!--                            @click="optionClicked(menuItem.text, menuItem.icon, data.item.id)"-->
<!--                        >-->
<!--                          <feather-icon-->
<!--                              :icon="menuItem.icon"-->
<!--                              class="mr-50"-->
<!--                          />-->
<!--                          <span>{{ menuItem.text }}</span>-->
<!--                        </b-dropdown-item>-->
<!--                      </b-dropdown>-->
<!--                    </b-form-group>-->
<!--                  </template>-->

<!--                  <template #cell(checkbox)="data">-->
<!--                    <b-form-group>-->
<!--                      <input-->
<!--                          :checked="isChecked(data.item)"-->
<!--                          style="height: 20px; width: 20px"-->
<!--                          type="checkbox"-->
<!--                          @click="selectAccount(data.item)"-->
<!--                      >-->
<!--                    </b-form-group>-->
<!--                  </template>-->
<!--                  <template #cell(account)="data">-->
<!--                    <div class="d-flex flex-column">-->
<!--                      {{ data.item.name }}-->
<!--                      <animated-number-->
<!--                          v-if="data.item.currency_type === 'D'"-->
<!--                          :class="data.item.balance < 0 ? `text-danger` : data.item.balance > 0 ? `text-success` : ``"-->
<!--                          :value="data.item.balance"-->
<!--                          :format-value="formatToDollar"-->
<!--                          :duration="2000"-->
<!--                      />-->
<!--                      <animated-number-->
<!--                          v-else-->
<!--                          :class="data.item.balance < 0 ? `text-danger` : data.item.balance > 0 ? `text-success` : ``"-->
<!--                          :value="data.item.balance"-->
<!--                          :format-value="formatToHryvna"-->
<!--                          :duration="2000"-->
<!--                      />-->
<!--                    </div>-->
<!--                  </template>-->
<!--                </b-table>-->

              </b-col>
            </b-row>
          </b-container>
          <b-container class="bv-example-row" v-if="accounts2['none'].length">
            <b-row>
              <b-col
                  cols="12"
              >
                <draggable class="list-group" :list="accounts2['none']" group="people" @change="(event) => changeGroup(event, null)">
                  <b-row
                      class="list-group-item check-none"
                      v-for="(element2, index) in accounts2['none']"
                      :key="index"
                      @click="selectAccount(element2)"
                  >
                    <b-col
                        cols="1"
                    >
                      <input
                          :checked="isChecked(element2)"
                          style="height: 20px; width: 20px"
                          type="checkbox"
                          @click="selectAccount(element2)"
                      >
                    </b-col>
                    <b-col
                        cols="8"
                    >

                      <b-col
                          cols="12"
                      >
                        {{ element2.name }}
                      </b-col>
                      <b-col
                          cols="12"
                      >
                        <animated-number
                            v-if="element2.currency_type === 'D'"
                            :class="element2.balance < 0 ? `text-danger` : element2.balance > 0 ? `text-success` : ``"
                            :value="element2.balance"
                            :format-value="formatToDollar"
                            :duration="2000"
                        />
                        <animated-number
                            v-else
                            :class="element2.balance < 0 ? `text-danger` : element2.balance > 0 ? `text-success` : ``"
                            :value="element2.balance"
                            :format-value="formatToHryvna"
                            :duration="2000"
                        />
                      </b-col>
                    </b-col>
                    <b-col
                        cols="1"
                    >
                      <b-dropdown
                          variant="link"
                          toggle-class="text-decoration-none"
                          no-caret
                      >
                        <template v-slot:button-content>
                          <feather-icon
                              icon="MoreVerticalIcon"
                              size="16"
                              class="text-body align-middle mr-25"
                          />
                        </template>
                        <b-dropdown-item
                            v-for="menuItem in actionsMenuForDeleted"
                            v-if="!!element2.deleted_at"
                            :key="menuItem.text"
                            @click="optionClicked(menuItem.text, menuItem.icon, element2.id)"
                        >
                          <feather-icon
                              :icon="menuItem.icon"
                              class="mr-50"
                          />
                          <span>{{ menuItem.text }}</span>
                        </b-dropdown-item>
                        <b-dropdown-item
                            v-for="menuItem in actionsMenu"
                            v-else
                            :key="menuItem.text"
                            @click="optionClicked(menuItem.text, menuItem.icon, element2.id)"
                        >
                          <feather-icon
                              :icon="menuItem.icon"
                              class="mr-50"
                          />
                          <span>{{ menuItem.text }}</span>
                        </b-dropdown-item>
                      </b-dropdown>
                    </b-col>
                  </b-row>
                </draggable>
              </b-col>
            </b-row>
          </b-container>
        </b-overlay>
      </b-tab>
    </b-tabs>

    <div
      class="d-flex align-items-center justify-content-start mb-1 mb-md-0 p-1"
    >
      <b-button
        v-if="!onlyDeleted"
        variant="primary"
        @click="isAddNewUserSidebarActive = true"
      >
        Add Account
      </b-button>
    </div>
    <div
        class="d-flex align-items-center justify-content-start mb-1 mb-md-0 p-1"
    >
      <b-button
          v-if="!onlyDeleted"
          variant="primary"
          @click="isAddAccountGroupSidebarActive = true"
      >
        Add Group Account
      </b-button>
    </div>

    <!-- context -->
    <vue-context
      v-if="onlyDeleted"
      ref="menu_for_deleted"
    >
      <li>
        <b-link
          v-for="data in actionsMenuForDeleted"
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
    <vue-context ref="menu">
      <li>
        <b-link
          v-for="data in actionsMenu"
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
  BButton, BTable, BLink,
  BDropdown, BDropdownItem, BFormGroup, BTabs, BTab, BOverlay, BCol, BContainer, BRow,
} from 'bootstrap-vue-next'
import AnimatedNumber from 'animated-number-vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import axios from 'axios'
import { VMoney } from 'v-money'
import VueContext from 'vue-context'
import Vuex from 'vuex'
import useJwt from '@/auth/jwt/useJwt'
import { analysError } from '@/_helpers/analys_error'
import { formatToHryvna, formatToDollar } from '@/_helpers/currency_format'
import AccountAdd from './account-add/AccountListAddNew.vue'
import AccountEdit from './account-edit/AccountEdit.vue'
import draggable from 'vuedraggable'
import AccountGroupAddNew from "@/views/pages/finances/cashflow/accounts/account-group-add/AccountGroupAddNew";
import AccountGroupEdit from "@/views/pages/finances/cashflow/accounts/account-group-edit/AccountGroupEdit";
import vue from "vue";

export default {
  components: {
    AccountGroupEdit,
    AccountGroupAddNew,
    BTabs,
    BTab,
    BButton,
    BCol,
    BContainer,
    BRow,
    BTable,
    BLink,
    BDropdown,
    BDropdownItem,
    BOverlay,
    AccountAdd,
    BFormGroup,
    AccountEdit,
    draggable,
    // animated balances
    AnimatedNumber,

    // Context Menu
    VueContext,
  },
  directives: {
    money: VMoney,
    Vuex,
  },
  props: {
    refetchBalanceFlag: {
      type: Boolean,
      required: false,
    },
    accountBalances: {
      type: [Object, Array],
      required: false,
    },
  },
  data() {
    return {
      tabs: [
        { title: 'Main', onlyDeleted: false, active: true },
        { title: 'Deleted', onlyDeleted: true, active: false },
      ],
      onlyDeleted: false,
      accounts: [],
      accounts2: [],
      rate: 0,
      accountsGroup: [],
      lists: [],
      isAddNewUserSidebarActive: false,
      isAddAccountGroupSidebarActive: false,
      isEdit: false,
      isEditGroup: false,
      dataMeta: 0,
      selected: 0,
      money: {
        decimal: ',',
        thousands: ' ',
        prefix: '$ ',
        precision: 2,
        masked: false,
      },
      actionsMenu: [
        { icon: 'Edit2Icon', text: 'Edit' },
        { icon: 'TrashIcon', text: 'Delete' },
      ],
      actionsMenuForDeleted: [
        { icon: 'TrashIcon', text: 'Hard Delete' },
      ],
      fields: [
        {
          key: 'checkbox',
          label: '',
          sortable: false,
          tdClass: 'text-center pr-0 pl-1',
          thClass: 'text-center',
          thStyle: 'width: 10%',
        },
        {
          key: 'account',
          label: 'Account',
          sortable: false,
          tdClass: 'text-left p-0',
          thClass: 'text-left pl-0',
          thStyle: 'width: 80%',
        },
        {
          key: 'action',
          label: '',
          sortable: false,
          tdClass: 'text-left pl-0',
          thClass: 'text-center',
          thStyle: 'width: 10%',
        },
      ],
      contextAccountId: null,
      targetAccount: 0,
      targetGroupAccount: 0,
      selectedAccounts: [],
      editAccount: {},
      editGroupAccount: {},
      accountsAlistKey: 0,
      accountIndex: null,
      loading: false,
    }
  },
  computed: {
    isHardDelete() {
      return this.onlyDeleted
    },
  },
  watch: {
    refetchAccountTransactions(newVal) {
      if (newVal === true) {
        this.fetchAccountTransactions()
      }
    },
    selectedAccounts() {
      this.$emit('account-selected', this.selectedAccounts)
    },
    accountBalances(newVal) {
      this.accounts.map(account => { // change balance account to
        newVal.forEach(account_ => {
          if (account.id === account_.id) {
            account.balance = account_.balance
          }
        })
      })
    },
  },
  async beforeMount() {
    this.accounts2['none'] = []
    await this.getRate()
    await this.getAccountsGroupList()
    await this.getAccountsList()
  },
  methods: {
    updateLoading(flag) {
      this.loading = flag
    },
    formatToDollar,
    formatToHryvna,
    async switchAccountsList(onlyTrashedFlag) {
      this.selectedAccounts = []
      this.onlyDeleted = onlyTrashedFlag
      this.$emit('only-deleted-accounts', this.onlyDeleted)
      await this.getAccountsGroupList()
      await this.getAccountsList()
    },
    isChecked(account) {
      return this.selectedAccounts.includes(account)
    },
    contextOpen(account) {
      event.preventDefault()
      this.targetAccount = account.id
      if (account.deleted_at) {
        this.$refs.menu_for_deleted.open(event)
        return
      }
      this.$refs.menu.open(event)
    },
    optionClicked(text, icon, accountId) {
      if (accountId) {
        this.targetAccount = accountId
      }
      if (text === 'Edit') {
        this.isEdit = true
        this.accountIndex = this.accounts.findIndex(account => account.id === this.targetAccount)
        const self = this
        this.editAccount = { ...this.accounts.find(account => account.id === this.targetAccount) }
      } else if (text === 'Delete') {
        this.deleteAccount(this.targetAccount)
      } else if (text === 'Hard Delete') {
        this.deleteAccountHardDelete(this.targetAccount)
      }
    },
    optionClickedGroup(text, icon, accountId) {
      if (accountId) {
        this.targetGroupAccount = accountId
      }
      if (text === 'Edit') {
        this.isEditGroup = true
        this.editGroupAccount= { ...this.accountsGroup.find(account => account.id === this.targetGroupAccount) }
      } else if (text === 'Delete') {
        this.deleteGroupAccount(this.targetGroupAccount)
      }
    },
    deleteAccountHardDelete(accountId) {
      const account = this.accounts.find(account => account.id === accountId)
      this.$swal({
        title: 'Delete Account',
        html: `<span>Do you really want delete account <b>${account.name}?</b></span>`,
        icon: 'warning',
        input: 'text',
        inputLabel: `Typo ${account.name}`,
        inputPlaceholder: `${account.name}`,
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        allowEnterKey: true,
        focusCancel: true,
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        inputValidator: value => value !== account.name && 'Not equal',
        buttonsStyling: false,
      }).then(result => {
        if (!result.value) {
          return
        }
        this.loading = true
        axios.delete(`${process.env.VUE_APP_API_URL}/account/${accountId}/isHardDelete`, {
          headers: {
            Authorization: `Bearer ${useJwt.getToken()}`,
          },
        }).then(response => {
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: response.data.message,
              icon: 'CheckIcon',
              variant: 'success',
            },
          })
          this.loading = false
          this.selectedAccounts = this.selectedAccounts.filter(account => account.id !== this.targetAccount)
          const index = this.accounts.findIndex(this.isTargetAccount)
          this.accounts.splice(index, 1)
          this.$emit('fill-accounts-list-at-sidebars', this.accounts)
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
      })
    },
    deleteAccount(accountId) {
      this.$swal({
        title: 'Are you sure?',
        text: 'Do you really want delete this?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (!result.value) {
          return
        }
        this.loading = true
        axios.delete(`${process.env.VUE_APP_API_URL}/account/${accountId}`, {
          headers: {
            Authorization: `Bearer ${useJwt.getToken()}`,
          },
        }).then(response => {
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: response.data.message,
              icon: 'CheckIcon',
              variant: 'success',
            },
          })
          this.loading = false
          this.selectedAccounts = this.selectedAccounts.filter(account => account.id !== this.targetAccount)
          const index = this.accounts.findIndex(this.isTargetAccount)
          this.accounts.splice(index, 1)
          this.$emit('fill-accounts-list-at-sidebars', this.accounts)
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
      })
    },
    deleteGroupAccount(accountId) {
      this.$swal({
        title: 'Are you sure?',
        text: 'Do you really want delete this group?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (!result.value) {
          return
        }
        this.loading = true
        axios.delete(`${process.env.VUE_APP_API_URL}/accounts_group/${accountId}`, {
          headers: {
            Authorization: `Bearer ${useJwt.getToken()}`,
          },
        }).then(response => {
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: response.data.message,
              icon: 'CheckIcon',
              variant: 'success',
            },
          })
          this.refetchData()
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
      })
    },
    selectAccount(item) {
      if (!this.selectedAccounts.includes(item)) {
        this.selectedAccounts.push(item)
      } else {
        const index = this.selectedAccounts.indexOf(item)
        if (index > -1) {
          this.selectedAccounts.splice(index, 1)
        }
      }
    },
    fetchAccountTransactions() {
      if (this.selectedAccounts.length > 0) {
        const getQuery = this.onlyTrashedTransactions
          ? `?only_deleted=true&page=${this.page}&per_page=${this.perPage}&accounts=${this.selectedAccounts}`
          : `?page=${this.page}&per_page=${this.perPage}&accounts=${this.selectedAccounts}`
        axios.get(`${process.env.VUE_APP_API_URL}/account/transactions${getQuery}`, {
          headers: {
            Authorization: `Bearer ${useJwt.getToken()}`,
          },
        }).then(response => {
          this.refetchAccountTransactions = false
          this.$emit('refetch-transactions', response.data.data)
        }).catch(error => {
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
    isSelected(i) {
      return i === this.selected
    },
    getRate() {
      axios.get(`${process.env.VUE_APP_API_URL}/getRate?date=${this.$moment().format('YYYY-MM-DD')}`, {
        headers:
            { Authorization: `Bearer ${useJwt.getToken()}` },
      })
          .then(response => {
            console.log(response.data.data)
            this.rate = response.data.data
          })
    },
    getAccountsList() {
      this.loading = true
      return axios.get(`${process.env.VUE_APP_API_URL}/account?only_deleted=${this.onlyDeleted}`, {
        headers: {
          Authorization: `Bearer ${useJwt.getToken()}`,
        },
      }).then(response => {
        this.loading = false
        this.accounts = response.data.data
        for (let i = 0; i < response.data.data.length; i++) {
          if (response.data.data[i].accounts_group) {
            this.accounts2[response.data.data[i].accounts_group_id].push(response.data.data[i]);
            let index = this.accountsGroup
                .findIndex(account => account.id === response.data.data[i].accounts_group_id)
            if (parseFloat(response.data.data[i].balance)) {
              if (response.data.data[i].currency_type === 'D') {
                this.accountsGroup[index].total += parseFloat(response.data.data[i].balance)
              } else {
                this.accountsGroup[index].total += parseFloat(response.data.data[i].balance) / this.rate
              }
            }
          } else {
            this.accounts2['none'].push(response.data.data[i]);
          }
        }
        this.dataMeta = this.accounts.length
        this.$emit('render-transaction-add', true)
        if (!this.onlyDeleted) {
          this.$emit('fill-accounts-list-at-sidebars', this.accounts)
        }
      }).catch(error => {
        console.log(error)
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
    getAccountsGroupList() {
      this.loading = true
      this.accounts2['none'] = []
      return axios.get(`${process.env.VUE_APP_API_URL}/accounts_group`, {
        headers: {
          Authorization: `Bearer ${useJwt.getToken()}`,
        },
      }).then(response => {
        this.loading = false
        let newAccountGroups = this.accountsGroup;
        this.accountsGroup = []
        for (let i = 0; i < response.data.data.length; i++) {
          this.accounts2[response.data.data[i].id] = []
          let index = newAccountGroups.findIndex(account => account.id === response.data.data[i].id)
          if (index !== -1) {
            response.data.data[i].show = newAccountGroups[index].show
          } else {
            response.data.data[i].show = true;
          }
          response.data.data[i].total = 0;
          this.accountsGroup.push(response.data.data[i])
        }
      }).catch(error => {
        console.log(error)
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
    isTargetAccount(element, index, array) {
      return element.id === this.targetAccount
    },
    changeGroup(value, id) {
      if (value.added) {
        this.loading = true
        axios.put(`${process.env.VUE_APP_API_URL}/account/${value.added.element.id}`, {
          accounts_group_id: id, name: value.added.element.name
        }, {
          headers:
              { Authorization: `Bearer ${useJwt.getToken()}` },
        }).then(response => {
          this.loading = false
        }).catch(error => {
          const errorRes = analysError(error.response)
          const self = vue
          this.refetchData()
          this.loading = false
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
      }
    },
    async refetchData() {
      await this.getAccountsGroupList()
      await this.getAccountsList()
      this.$emit('refetch-accounts-for-transaction-add')
      this.$emit('refetch-accounts-for-transaction-edit')
    },
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}

.invoice-filter-select {
  min-width: 190px;

  ::v-deep .vs__selected-options {
    flex-wrap: nowrap;
  }

  ::v-deep .vs__selected {
    width: 100px;
  }
}

.hidden {
  display: none;
}
.container .list-group-item.row:active {
  background-color: #283046;
  border-color: #3b4253;
}
.list-group-item.row {
  display: flex;
  margin-left: 0;
}
.list-group-item.check {
  margin-right: -0.8rem;
  margin-left: -1.5rem;
  padding: 0.75rem 0;
  border-left: none;
  border-right: none;
}
.list-group-item.check-none {
  margin-right: -1rem;
  margin-left: -1rem;
  padding: 0.75rem 0;
}
.list-group-item.check:last-child {
  border-bottom: none;
}
.list-group-item.row .cursor-pointer {
  font-size: 16px;font-weight: 500;
  color: #fff;
}
.container .list-group-item.row:hover{
  background-color: #283046;
}
.amount-input {
  border: 0;
  width: 120px;
  opacity: 1!important;
  background-color: inherit;
}
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/libs/vue-context.scss';
</style>
