<template>
  <b-sidebar
    id="add-new-user-sidebar"
    :visible="isAddNewUserSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @change="(val) => $emit('update:is-add-new-user-sidebar-active', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">
          Add New Account
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
        @submit.prevent="submit()"
      >

        <!-- Full Name -->
        <b-form-group
          label="Title"
          label-for="title"
        >
          <b-form-input
            id="title"
            v-model="accountData.name"
            autofocus
            trim
            placeholder="Bank"
          />
        </b-form-group>
        <b-form-group
            label="Group"
            label-for="group"
        >
          <v-select
              :options="groups"
              v-model="group"
              label="name"
          >
            <template v-slot:no-options="{ search, searching }">
              <template v-if="searching">
                <b-button
                    v-if="!loading"
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    variant="primary"
                    class="mr-2"
                    v-on:click="addGroup(search)"
                >
                  Add {{ search }}
                </b-button>
              </template>
            </template>
          </v-select>
        </b-form-group>
        <!-- Balance -->
        <b-form-group
          label="Opening balance"
          label-for="balance"
        >
          <b-form-input
            v-if="accountData.currency_type === 'D'"
            v-model="accountData.balance"
            v-money="money"
            trim
          />
          <b-form-input
            v-else
            v-model="accountData.balance"
            v-money="money_hryvna"
            trim
          />
        </b-form-group>

        <!-- Currency -->
        <b-form-group
          label="Currency"
          label-for="currency"
        >
          <b-form-select
            id="currency"
            v-model="accountData.currency_type"
            :options="currencies"
            value-field="flag"
            text-field="name"
          />
        </b-form-group>

        <!-- Form Actions -->
        <div class="d-flex mt-2">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="mr-2"
            type="submit"
          >
            Create
          </b-button>
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
  BSidebar, BForm, BFormGroup, BFormInput, BFormInvalidFeedback, BButton, BFormSelect,
} from 'bootstrap-vue-next'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { ref } from '@vue/composition-api'
import formValidation from '@core/comp-functions/forms/form-validation'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import axios from 'axios'
import ToastificationContent from '@core/components/toastification/ToastificationContent'
import { VMoney } from 'v-money'
import store from '@/store'
import useJwt from '@/auth/jwt/useJwt'
import { analysError } from '@/_helpers/analys_error'
import vue from "vue";
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

    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
    money: VMoney,
  },
  model: {
    props: 'isAddNewUserSidebarActive',
    events: 'update:is-add-new-user-sidebar-active',
  },
  props: {
    isAddNewUserSidebarActive: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      accountData: {
        name: null,
        balance: null,
        currency_type: 'D',
      },
      money: {
        decimal: ',',
        thousands: ' ',
        prefix: '$ ',
        precision: 2,
        masked: false,
        min: 0,
      },
      group: '',
      groups: [],
      loading: false,
      money_hryvna: {
        decimal: ',',
        thousands: ' ',
        prefix: '₴ ',
        precision: 2,
        masked: false,
        min: 0,
      },
      currencies: [
        { name: 'UAH', flag: 'H' },
        { name: 'USD', flag: 'D' },
      ],
      defaultData: {
        name: null,
        balance: null,
        currency_type: 'D',
      },
    }
  },
  watch: {
    isAddNewUserSidebarActive(newVal) {
      if (newVal) {
        this.accountData = { ...this.defaultData }
      }
    },
  },
  beforeMount() {
    this.getGroups()
  },
  methods: {
    getGroups() {
      axiosIns.get('accounts_group').then(response => {
        this.groups = response.data.data
        this.loading = false
      }).catch(error => {
        const errorRes = analysError(error.response)
        const self = this
        this.loading = false
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
    addGroup(search) {
      this.loading = true
      const data = {
        name: search
      }
      axiosIns.post('accounts_group', data).then(response => {
        this.group = response.data.data
        this.getGroups()
        this.$emit('refetch-data', response.data.data)
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
    clearAndHide() {
      this.$emit('update:is-add-new-user-sidebar-active', false)
      this.accountData = { ...this.defaultData }
    },
    validAmount(balance) {
      if (this.accountData.currency_type === 'H') {
        return balance.replace('₴', '').replace(/\s+/g, '').replace(',', '.')
      }
      return balance.replace('$', '').replace(/\s+/g, '').replace(',', '.')
    },
    submit() {
      const balance = this.validAmount(this.accountData.balance)
      axios.post(`${process.env.VUE_APP_API_URL}/account`, {
        name: this.accountData.name, balance, currency_type: this.accountData.currency_type,
        accounts_group_id: this.group.id
      }, {
        headers:
            { Authorization: `Bearer ${useJwt.getToken()}` },
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
        this.$emit('refetch-data', response.data.data)
        this.clearAndHide()
      }).catch(error => {
        const errorRes = analysError(error.response)
        const self = vue
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

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';

#add-new-user-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
</style>
