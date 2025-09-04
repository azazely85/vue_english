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
          Edit Group Account
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
                v-model="editGroupAccount.name"
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
import { ref } from '@vue/composition-api'
import { required, alphaNum, email } from '@validations'
import formValidation from '@core/comp-functions/forms/form-validation'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import axios from 'axios'
import ToastificationContent from '@core/components/toastification/ToastificationContent'
import Vuex from 'vuex'
import useJwt from '@/auth/jwt/useJwt'
import { analysError } from '@/_helpers/analys_error'
import vue from "vue";

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
    editGroupAccount: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      required,
    }
  },
  methods: {
    submit() {
      this.$emit('update-loading', true)
      axios.put(`${process.env.VUE_APP_API_URL}/accounts_group/${this.editGroupAccount.id}`, {
        name: this.editGroupAccount.name,
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
