<template>
  <b-sidebar
    id="edit-account-sidebar"
    :visible="isEdit"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @hidden="resetForm"
    @change="(val) => $emit('update:is-edit', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">
          Edit Account
        </h5>

        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          size="16"
          @click="hide"
        />

      </div>

      <!-- BODY -->
      <validation-observer
        #default="{ handleSubmit }"
        ref="refFormObserver"
      >
        <!-- Form -->
        <b-form
          class="p-2"
          @submit.prevent="handleSubmit(submit())"
          @reset.prevent="resetForm"
        >

          <!-- Full Name -->
          <validation-provider
            #default="validationContext"
            name="Title"
            rules="required"
          >
            <b-form-group
              label="Title"
              label-for="title"
            >
              <b-form-input
                id="title"
                v-model="editAccount.name"
                autofocus
                :state="getValidationState(validationContext)"
                trim
                placeholder="Bank"
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
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
          <!-- Form Actions -->
          <div class="d-flex mt-2">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-2"
              type="submit"
            >
              Save
            </b-button>
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              type="button"
              variant="outline-secondary"
              @click="hide"
            >
              Cancel
            </b-button>
          </div>
        </b-form>
      </validation-observer>
    </template>
  </b-sidebar>
</template>

<script>
import {
  BSidebar, BForm, BFormGroup, BFormInput, BFormInvalidFeedback, BButton,
} from 'bootstrap-vue-next'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { ref } from 'vue'
import { required, alphaNum, email } from '@validations'
import formValidation from '@core/comp-functions/forms/form-validation'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import axios from 'axios'
import ToastificationContent from '@core/components/toastification/ToastificationContent'
import { VMoney } from 'v-money'
import Vuex from 'vuex'
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

    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
    Vuex,
    money: VMoney,
  },
  model: {
    props: 'isEdit',
    events: 'update:is-edit',
  },
  props: {
    isEdit: {
      type: Boolean,
      required: true,
    },
    editAccount: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      group: '',
      groups: [],
      loading: false,
      money: {
        decimal: ',',
        thousands: ' ',
        prefix: '$ ',
        precision: 2,
        masked: false,
        min: 0,
        loading: false,
      },
      required,
      alphaNum,
      email,
      // countries,
    }
  },
  watch: {
    isEdit(newVal) {
      this.group = this.editAccount.accounts_group
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
    submit() {
      this.$emit('update-loading', true)
      axios.put(`${process.env.VUE_APP_API_URL}/account/${this.editAccount.id}`, {
        name: this.editAccount.name, is_update: true,
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
        this.$emit('refetch-data', { account: response.data.data, is_edit: true })
        this.$emit('update:is-edit', false)
        this.$emit('update-loading', false)
      }).catch(error => {
        this.$emit('update-loading', false)
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
  setup(props, { emit }) {
    const blankWalletData = {
      name: '',
      balance: '',
      status: 1,
    }

    const accountData = ref(JSON.parse(JSON.stringify(blankWalletData)))
    const resetuserData = () => {
      accountData.value = JSON.parse(JSON.stringify(blankWalletData))
    }

    const {
      refFormObserver,
      getValidationState,
      resetForm,
    } = formValidation(resetuserData)

    return {
      accountData,

      refFormObserver,
      getValidationState,
      resetForm,
    }
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
