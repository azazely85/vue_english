<template>
  <b-card>
    <b-row>
      <!-- User Info: Left col -->
      <b-col
        xl="6"
        class="d-flex justify-content-between flex-column"
      >
        <!-- User Avatar & Action Buttons -->
        <div class="d-flex justify-content-start">
          <b-avatar
            src="/img/1.9cba4a79.png"
            size="150px"
            rounded
          />
          <div class="d-flex flex-column ml-1">
            <div class="mb-1">
              <h4 class="mb-0">
                {{ comradeData.name }}
              </h4>
              <span class="card-text">
                <a :href="`mailto:${comradeData.devurai_email}`">
                  {{ comradeData.devurai_email }}
                </a>
              </span>
            </div>
            <div class="mb-1">
              <span class="d-flex flex-row flex-nowrap align-items-center font-weight-bold text-capitalize">
                Non used vocation
              </span>
              <div v-if="nonUsedVocationEdit">
                <div class="d-flex flex-row flex-nowrap align-items-center" >
                  <b-form-input
                      v-model="comradeData.non_used_vocation"
                      size="sm"
                      type="number"
                      style="margin-right: 10px"
                  />
                  <feather-icon
                      size="28"
                      icon="CheckIcon"
                      style="margin-bottom: 2px; color: #28c76f;"
                      v-on:click="updateNonUsedVocation"
                  />
                </div>
              </div>
              <div v-else>
                    <span
                        v-if="comradeData.non_used_vocation"
                        style="max-width: 50%;"
                    >{{ comradeData.non_used_vocation }} <feather-icon
                        size="15"
                        icon="Edit3Icon"
                        class="mr-50 btn-link"
                        style="margin-bottom: 2px"
                        v-on:click="nonUsedVocationEdit = true"
                    /></span>
                <span v-else>-<feather-icon
                    size="15"
                    icon="Edit3Icon"
                    class="mr-50 btn-link"
                    style="margin-bottom: 2px"
                    v-on:click="nonUsedVocationEdit = true"
                /></span>
              </div>
            </div>
            <div
              v-if="comradeData.social"
              class="d-flex flex-wrap"
            >
              <b-link
                v-for="(social, key) in JSON.parse(comradeData.social)"
                :key="key"
                :href="social"
                target="_blank"
              >
                <feather-icon
                  :icon="`${key}Icon`"
                  size="24"
                  class="text-body align-middle mr-25 cursor-pointer mt-1 ml-1"
                />
              </b-link>
            </div>
          </div>
        </div>
        <div class="d-flex align-items-center mt-2">
          <div
            v-if="comradeData.nda"
            class="d-flex align-items-center mr-2"
          >
            <a
              :href="JSON.parse(comradeData.nda)[0]"
              download
            >
              <b-avatar
                variant="light-primary"
                rounded
                class="cursor-pointer"
              >
                <feather-icon
                  icon="DownloadIcon"
                  size="18"
                />
              </b-avatar>
            </a>
            <div class="ml-1">
              <h5 class="mb-0">
                NDA
              </h5>
            </div>
          </div>
          <div v-if="comradeData.documents">
            <div
              v-for="(document, index) in JSON.parse(
                comradeData.documents
              )"
              :key="index"
              class="d-flex align-items-center"
            >
              <a
                :href="document"
                download
              >
                <b-avatar
                  variant="light-success"
                  rounded
                  class="cursor-pointer ml-1"
                >
                  <feather-icon
                    icon="DownloadIcon"
                    size="18"
                  />
                </b-avatar>
              </a>
              <div class="ml-1">
                <h5 class="mb-0">
                  Document {{ index + 1 }}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </b-col>

      <!-- Right Col: Table -->
      <b-col
        cols="12"
        md="6"
      >
        <b-container
          class="p-0"
        >
          <b-col
            cols="12"
            md="9"
            class="p-0"
          >
            <b-row>
              <b-col
                cols="12"
                class="flex-column"
              >
                <div
                  class="d-flex justify-content-between mb-1"
                >
                  <span
                    class="d-flex flex-row flex-nowrap align-items-center font-weight-bold text-capitalize"
                  >
                    <feather-icon
                      icon="CalendarIcon"
                      class="mr-50"
                    />
                    Date of birth
                  </span>
                  <span
                    v-if="comradeData.dob"
                    style="max-width: 50%;"
                  >{{ comradeData.dob | moment("MM-DD-YYYY") }}</span>
                  <span v-else>-</span>
                </div>
                <div
                  class="d-flex justify-content-between mb-1"
                >
                  <span
                    class="d-flex flex-row flex-nowrap align-items-center font-weight-bold text-capitalize"
                  >
                    <feather-icon
                      icon="PhoneIcon"
                      class="mr-50"
                    />
                    Phone
                  </span>
                  <b-link
                    v-if="comradeData.phone"
                    :href="`tel:${comradeData.phone.replace(/\s+/g, '')}`"
                    style="max-width: 50%;"
                  >
                    {{ comradeData.phone }}
                  </b-link>
                  <span v-else>-</span>
                </div>
                <div
                  class="d-flex justify-content-between mb-1"
                >
                  <span
                    class="d-flex flex-row flex-nowrap align-items-center font-weight-bold text-capitalize"
                  >
                    <feather-icon
                      icon="MailIcon"
                      class="mr-50"
                    />
                    Payoneer email
                  </span>
                  <b-link
                    v-if="comradeData.payoneer_email"
                    :href="`mailto:${comradeData.payoneer_email}`"
                    style="max-width: 50%;"
                  >
                    {{ comradeData.payoneer_email }}
                  </b-link>
                  <span v-else>-</span>
                </div>
                <div
                  class="d-flex justify-content-between mb-1"
                >
                  <span
                    class="d-flex flex-row flex-nowrap align-items-center font-weight-bold text-capitalize"
                  >
                    <feather-icon
                      icon="CalendarIcon"
                      class="mr-50"
                    />
                    Start job
                  </span>
                  <span
                    v-if="comradeData.date_start_job"
                    style="max-width: 50%;"
                  >
                    {{ comradeData.date_start_job | moment("MM-DD-YYYY") }}
                  </span>
                  <span v-else>-</span>
                </div>
                <div
                  class="d-flex justify-content-between mb-1"
                >
                  <span
                    class="d-flex flex-row flex-nowrap align-items-center font-weight-bold text-capitalize"
                  >
                    <feather-icon
                      icon="CalendarIcon"
                      class="mr-50"
                    />
                    Next salary review
                  </span>
                  <span
                    v-if="comradeData.salary_review_date"
                    style="max-width: 50%;"
                  >
                    {{ comradeData.salary_review_date | moment("MM-DD-YYYY") }}
                  </span>
                  <span v-else>-</span>
                </div>
                <div
                  class="d-flex justify-content-between mb-1"
                >
                  <span
                    class="d-flex flex-row flex-nowrap align-items-center font-weight-bold text-capitalize"
                  >
                    <feather-icon
                      icon="Link2Icon"
                      class="mr-50"
                    />
                    ClickUp profile
                  </span>
                  <b-link
                    v-if="comradeData.click_up_record_id"
                    :href="`${clickUpBaseUrl}/t/${comradeData.click_up_record_id}`"
                    target="_blank"
                    style="max-width: 50%;"
                  >
                    {{ `${clickUpBaseUrl}/t/${comradeData.click_up_record_id}` }}
                  </b-link>
                  <span v-else>-</span>
                </div>
                <div
                    class="d-flex justify-content-between mb-1"
                >
                  <b-button
                      class="rounded"
                      variant="primary"
                      @click="createManager()"
                  >
                    Create manager
                  </b-button>
                </div>
              </b-col>
            </b-row>
          </b-col>
        </b-container>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BAvatar,
  BLink,
  BContainer,
  BFormInput, BButton,
} from 'bootstrap-vue-next'
import axios from 'axios'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useJwt from '@/auth/jwt/useJwt'
import { analysError } from '@/_helpers/analys_error'
import { baseUrl } from '@/_helpers/click_up'

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BAvatar,
    BButton,
    BLink,
    BContainer,
    BFormInput,
  },
  props: {
    comradeData: {
      type: [Object, Array],
      required: true,
    },
  },
  data() {
    return {
      clickUpBaseUrl: baseUrl,
      comradeSalaryCopy: '',
      nonUsedVocationEdit: false
    }
  },
  methods: {
    updateNonUsedVocation() {
      this.loading = true
      this.nonUsedVocationEdit = false;
      if (this.comradeData.non_used_vocation == null) {
        return
      }
      const data = {
        non_used_vocation: this.comradeData.non_used_vocation,
      }
      axios.put(`${process.env.VUE_APP_API_URL}/comrade/${this.comradeData.id}`, data, {
        headers: {Authorization: `Bearer ${useJwt.getToken()}`},
      }).then(response => {
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
              icon: 'XIcon',
              variant: 'danger',
            },
          })
        })
      })
    },
    createManager() {
      this.loading = true
      const data = {
        id: this.comradeData.id,
      }
      axios.post(`${process.env.VUE_APP_API_URL}/auth/register-manager`, data, {
        headers: {Authorization: `Bearer ${useJwt.getToken()}`},
      }).then(response => {
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
              icon: 'XIcon',
              variant: 'danger',
            },
          })
        })
      })
    },
  }
}
</script>

<style scoped></style>
