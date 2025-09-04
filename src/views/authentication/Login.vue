<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">

      <!-- modal -->
      <b-modal
        id="modal-primary"
        :visible="isFirstLogin"
        ok-title="Yes"
        modal-class="modal-primary"
        cancel-title="No"
        cancel-variant="outline-secondary"
        centered
        title="First login"
        @ok="AcceptPasswordChange()"
        @close="DeclinePasswordChange()"
        @cancel="DeclinePasswordChange()"
      >
        <b-card-text>
          Do you wants to change your password now?
        </b-card-text>
      </b-modal>
      <!-- Login v1 -->
      <b-card class="mb-0">
        <b-link class="brand-logo">

          <h2 class="brand-text text-primary ml-1">
            DCMS
          </h2>
        </b-link>

        <b-card-text class="mb-2">
          Please sign-in to your account
        </b-card-text>

        <!-- form -->
        <validation-observer
          ref="loginForm"
          #default="{invalid}"
        >
          <b-form
            class="auth-login-form mt-2"
            @submit.prevent="login"
          >

            <!-- email -->
            <b-form-group
              label-for="email"
              label="Email"
            >
              <validation-provider
                #default="{ errors }"
                name="Email"
                rules="required|email"
              >
                <b-form-input
                  id="email"
                  v-model="userEmail"
                  name="login-email"
                  :state="errors.length > 0 ? false:null"
                  placeholder="john@example.com"
                  autofocus
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- password -->
            <b-form-group>
              <div class="d-flex justify-content-between">
                <label for="password">Password</label>
                <b-link :to="{name:'auth-forgot-password'}">
                  <small>Forget Password?</small>
                </b-link>
              </div>
              <validation-provider
                #default="{ errors }"
                name="Password"
                rules="required"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid':null"
                >
                  <b-form-input
                    id="password"
                    v-model="password"
                    :type="passwordFieldType"
                    class="form-control-merge"
                    :state="errors.length > 0 ? false:null"
                    name="login-password"
                    placeholder="Password"
                  />

                  <b-input-group-append is-text>
                    <feather-icon
                      class="cursor-pointer"
                      :icon="passwordToggleIcon"
                      @click="togglePasswordVisibility"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- checkbox -->
            <b-form-group>
              <b-form-checkbox
                id="remember-me"
                v-model="status"
                name="checkbox-1"
              >
                Remember Me
              </b-form-checkbox>
            </b-form-group>

            <!-- submit button -->
            <b-button
              variant="primary"
              type="submit"
              block
              :disabled="invalid"
              :hidden="blockButton"
              :class="(blockButton)?'disabled':''"
            >
              Sign in
            </b-button>
            <div style="width: 100%; display: flex; justify-content: center">
              <cube-spin v-if="blockButton" />
            </div>
          </b-form>
        </validation-observer>
        <div class="mt-2">
          <b-button
            variant="outline-primary"
            block
            @click="loginWithGoogle"
          >
            <span>Sign in with Google</span>
          </b-button>
        </div>
      </b-card>
      <!-- /Login v1 -->
    </div>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  BButton,
  BForm,
  BFormInput,
  BFormGroup,
  BCard,
  BLink,
  BCardTitle,
  BCardText,
  BInputGroup,
  BInputGroupAppend,
  BFormCheckbox,
  BModal, VBModal,
} from 'bootstrap-vue'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import { required, email } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import ToastificationContent from '@core/components/toastification/ToastificationContent'
import CubeSpin from 'vue-loading-spinner/src/components/Circle'
import useJwt from '@/auth/jwt/useJwt'
import { getHomeRouteForLoggedInUser } from '@/auth/utils'
import { decryptUserData, encryptUserData } from '@/_helpers/encryption'
import axios from '@axios'

export default {
  components: {
    // BSV
    BButton,
    BForm,
    BFormInput,
    BFormGroup,
    BCard,
    BCardTitle,
    BLink,
    VuexyLogo,
    BCardText,
    BInputGroup,
    BInputGroupAppend,
    BFormCheckbox,
    BModal,
    ValidationProvider,
    ValidationObserver,
    CubeSpin,
  },
  directives: {
    'b-modal': VBModal,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      userEmail: '',
      password: '',
      status: '',
      blockButton: false,
      isFirstLogin: false,
      required,
      email,
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
  },
  methods: {
    login() {
      this.$refs.loginForm.validate().then(success => {
        if (success) {
          this.blockButton = true
          useJwt.login({
            email: this.userEmail,
            password: this.password,
            remember_me: this.status,
          })
            .then(response => {
              this.blockButton = false

              if (this.checkValidUser(response.data)) {
                const userData = response.data.data.user
                localStorage.setItem('userData', encryptUserData(userData))
                useJwt.setToken(response.data.data.token)

                if (userData.first_login === 1) {
                  this.isFirstLogin = true
                } else {
                  this.continueAuth()
                }
              } else {
                this.$toast({
                  component: ToastificationContent,
                  position: 'top-right',
                  props: {
                    title: response.data.message,
                    icon: 'CoffeeIcon',
                    variant: 'error',
                  },
                })
              }
            })
            .catch(error => {
              this.$toast({
                component: ToastificationContent,
                position: 'top-right',
                props: {
                  title: 'Something went wrong!',
                  icon: 'CoffeeIcon',
                  variant: 'error',
                },
              })
              this.blockButton = false

              // this.$refs.loginForm.setErrors(error.response.data)
            })
        }
      })
    },
    async loginWithGoogle() {
      try {
        this.blockButton = true
        let accessToken = null

        // If Google Identity Services is integrated, try to read token from global callback result
        // Fallback: prompt for a token (useful for initial wiring/testing)
        if (!accessToken) {
          // eslint-disable-next-line no-alert
          accessToken = window?.googleAccessToken || prompt('Paste Google OAuth access token')
        }

        if (!accessToken) {
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: { title: 'No Google access token provided', icon: 'AlertTriangleIcon', variant: 'warning' },
          })
          this.blockButton = false
          return
        }

        const response = await axios.post('/api/auth/google', { access_token: accessToken })
        const { token, user } = response.data || {}

        if (token && user) {
          localStorage.setItem('userData', encryptUserData(user))
          useJwt.setToken(token)

          if (user.first_login === 1) {
            this.isFirstLogin = true
          } else {
            this.continueAuth()
          }
        } else {
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: { title: 'Invalid Google login response', icon: 'XIcon', variant: 'danger' },
          })
        }
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          position: 'top-right',
          props: { title: 'Google login failed', icon: 'XIcon', variant: 'danger' },
        })
      } finally {
        this.blockButton = false
      }
    },
    continueAuth() {
      const decryptedUserData = decryptUserData(useJwt.getUserData())

      this.$router.replace(getHomeRouteForLoggedInUser(decryptedUserData.role))
        .then(() => {
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: `Welcome ${decryptedUserData.firstname} ${decryptedUserData.lastname}`,
              icon: 'CoffeeIcon',
              variant: 'success',
              text: 'You have successfully logged in. Now you can start to explore!',
            },
          })
        })
    },
    AcceptPasswordChange() {
      const userData = useJwt.getUserData() ? useJwt.getUserData() : null
      const decrypted = decryptUserData(userData)
      this.$router.replace({ path: '/api/auth/reset-password', query: { email: decrypted.email, firstLogin: 1 } })
    },
    DeclinePasswordChange() {
      this.continueAuth()
    },
    checkValidUser(data) {
      return data.status === 'success'
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
