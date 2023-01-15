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
          Add New Account Group
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
            v-model="accountGroupData.name"
            autofocus
            trim
            placeholder="Bank"
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
} from 'bootstrap-vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import axios from 'axios'
import ToastificationContent from '@core/components/toastification/ToastificationContent'
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
    BFormSelect,

    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple
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
      accountGroupData: {
        name: null
      },
      defaultData: {
        name: null
      },
    }
  },
  watch: {
    isAddNewUserSidebarActive(newVal) {
      if (newVal) {
        this.accountGroupData = { ...this.defaultData }
      }
    },
  },
  methods: {
    clearAndHide() {
      this.$emit('update:is-add-new-user-sidebar-active', false)
      this.accountGroupData = { ...this.defaultData }
    },
    submit() {
      axios.post(`${process.env.VUE_APP_API_URL}/accounts_group`, {
        name: this.accountGroupData.name
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
