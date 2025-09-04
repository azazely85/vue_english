<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">
      <!-- Reset Password v1 -->
      <b-card class="mb-0">

        <b-card-title class="mb-1">
          Reset Password 🔒
        </b-card-title>
        <b-card-text class="mb-2">
          Your new password must be different from previously used passwords
        </b-card-text>

        <!-- form -->
        <validation-observer ref="simpleRules">
          <b-form
              method="POST"
              class="auth-reset-password-form mt-2"
              @submit.prevent="validationForm"
          >

            <!-- password -->
            <b-form-group
                label="New Password"
                label-for="reset-password-new"
            >
              <validation-provider
                  #default="{ errors }"
                  name="Password"
                  vid="Password"
                  rules="required|password"
              >
                <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid':null"
                >
                  <b-form-input
                      id="reset-password-new"
                      v-model="password"
                      :type="password1FieldType"
                      :state="errors.length > 0 ? false:null"
                      class="form-control-merge"
                      name="password"
                      placeholder="············"
                  />
                  <b-input-group-append is-text>
                    <feather-icon
                        class="cursor-pointer"
                        :icon="password1ToggleIcon"
                        @click="togglePassword1Visibility"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- confirm password -->
            <b-form-group
                label-for="reset-password-confirm"
                label="Confirm Password"
            >
              <validation-provider
                  #default="{ errors }"
                  name="Confirm Password"
                  rules="required|confirmed:Password"
              >
                <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid':null"
                >
                  <b-form-input
                      id="reset-password-confirm"
                      v-model="cPassword"
                      :type="password2FieldType"
                      class="form-control-merge"
                      :state="errors.length > 0 ? false:null"
                      name="password_confirmation"
                      placeholder="············"
                  />
                  <b-input-group-append is-text>
                    <feather-icon
                        class="cursor-pointer"
                        :icon="password2ToggleIcon"
                        @click="togglePassword2Visibility"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- submit button -->
            <b-button
                block
                type="submit"
                variant="primary"
            >
              Set New Password
            </b-button>
          </b-form>
        </validation-observer>

      </b-card>
      <!-- /Reset Password v1 -->
    </div>
  </div>

</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import {
  BCard, BCardTitle, BCardText, BForm, BFormGroup, BInputGroup, BInputGroupAppend, BLink, BFormInput, BButton,
} from 'bootstrap-vue-next'
import { required } from '@validations'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useJwt from '@/auth/jwt/useJwt'
import {decryptUserData} from "@/_helpers/encryption";
import axios from "axios";
import {analysError} from "@/_helpers/analys_error";

export default {
  components: {
    VuexyLogo,
    BCard,
    BButton,
    BCardTitle,
    BCardText,
    BForm,
    BFormGroup,
    BInputGroup,
    BLink,
    BFormInput,
    BInputGroupAppend,
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      userData: decryptUserData(useJwt.getUserData()),
      cPassword: '',
      password: '',
      // validation
      required,

      // Toggle Password
      password1FieldType: 'password',
      password2FieldType: 'password',
    }
  },
  computed: {
    password1ToggleIcon() {
      return this.password1FieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    password2ToggleIcon() {
      return this.password2FieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
  },
  methods: {
    togglePassword1Visibility() {
      this.password1FieldType = this.password1FieldType === 'password' ? 'text' : 'password'
    },
    togglePassword2Visibility() {
      this.password2FieldType = this.password2FieldType === 'password' ? 'text' : 'password'
    },
    validationForm() {
      this.$refs.simpleRules.validate().then(success => {
        if (success) {
          let data = {
            password: this.password,
            password_confirmation: this.cPassword,
            email: this.userData.email,
          }
          this.loading = true
          axios
              .post(
                  `${process.env.VUE_APP_API_URL}/user/reset-password`,
                  data, {
                    headers: { Authorization: `Bearer ${useJwt.getToken()}` },
                  },
              )
              .then(response => {
                this.loading = false
                this.$toast({
                  component: ToastificationContent,
                  position: 'top-right',
                  props: {
                    title: response.data.message,
                    icon: 'XIcon',
                    variant: 'success',
                  },
                })
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
                      icon: 'CoffeeIcon',
                      variant: 'error',
                    },
                  })
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
