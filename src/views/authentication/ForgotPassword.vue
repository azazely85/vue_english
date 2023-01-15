<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">

      <!-- Forgot Password v1 -->
      <b-card class="mb-0">
        <b-link class="brand-logo">
          <!-- logo -->
          <vuexy-logo />

          <h2 class="brand-text text-primary ml-1">
            DCMS
          </h2>
        </b-link>

        <b-card-title class="mb-1">
          First Login? 🔒
        </b-card-title>
        <b-card-text class="mb-2">
          Enter your email and we'll send you reset link
        </b-card-text>

        <!-- form -->
        <validation-observer ref="simpleRules">
          <b-form
            class="auth-forgot-password-form mt-2"
            @submit.prevent="validationForm"
          >
            <!-- email -->
            <b-form-group
              label="Email"
              label-for="forgot-password-email"
            >
              <validation-provider
                #default="{ errors }"
                name="Email"
                rules="required|email"
              >
                <b-form-input
                  id="forgot-password-email"
                  v-model="userEmail"
                  :state="errors.length > 0 ? false:null"
                  name="forgot-password-email"
                  placeholder="john@example.com"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- submit button -->
            <b-button
              variant="primary"
              block
              type="submit"
              :hidden="blockButton"
              :class="(blockButton)?'disabled':''"
            >
              Send reset link
            </b-button>
            <div style="width: 100%; display: flex; justify-content: center">
              <cube-spin v-if="blockButton" />
            </div>
          </b-form>
        </validation-observer>

        <b-card-text class="text-center mt-2">
          <b-link :to="{name:'auth-login'}">
            <feather-icon icon="ChevronLeftIcon" /> Back to login
          </b-link>
        </b-card-text>
      </b-card>
    <!-- /Forgot Password v1 -->
    </div>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import {
  BCard, BLink, BCardText, BCardTitle, BFormGroup, BFormInput, BForm, BButton,
} from 'bootstrap-vue'
import { required, email } from '@validations'
import ToastificationContent from '@core/components/toastification/ToastificationContent'
import CubeSpin from 'vue-loading-spinner/src/components/Circle'
import useJwt from '@/auth/jwt/useJwt'

export default {
  components: {
    VuexyLogo,
    BCard,
    BLink,
    BCardText,
    BCardTitle,
    BFormGroup,
    BFormInput,
    BButton,
    BForm,
    ValidationProvider,
    ValidationObserver,
    CubeSpin,
  },
  data() {
    return {
      userEmail: '',
      blockButton: false,
      // validation
      required,
      email,
    }
  },
  methods: {
    validationForm() {
      this.$refs.simpleRules.validate().then(success => {
        if (success) {
          this.blockButton = true
          useJwt.resetPassLink({
            email: this.userEmail,
          })
            .then(response => {
              this.blockButton = false
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: response.data.data,
                  icon: 'EditIcon',
                  variant: 'success',
                },
              })
            })
        }
      })
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
