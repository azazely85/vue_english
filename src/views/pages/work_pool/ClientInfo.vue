<template>
  <b-row class="d-flex justify-content-center">
    <b-col
      cols="12"
    >
      <b-card
      >
        <b-row class="d-flex justify-content-center">
          <b-col
            cols="12"
            xl="6"
            class="d-flex flex-column"
          >
            <b-form-group
              label="Client Name"
              label-for="client-name"
            >
              <b-form-input
                id="client-name"
                v-model="clientInfo.name"
                @focusout="updateClient('name', clientInfo.name)"
              />
            </b-form-group>
            <b-form-group
              label="Main contact person"
              label-for="contact-person"
            >
              <b-form-input
                id="contact-person"
                v-model="clientInfo.contact_person"
                @focusout="updateClient('contact_person', clientInfo.contact_person)"
              />
            </b-form-group>
            <b-form-group
              label="Contact person phone"
              label-for="contact-person-phone"
            >
              <b-form-input
                id="contact-person-phone"
                v-model="clientInfo.phone_number"
                @focusout="updateClient('phone_number', clientInfo.phone_number)"
              />
            </b-form-group>
            <b-form-group
              label="Contact person email"
              label-for="contact-person-phone"
            >
              <b-form-input
                id="contact-person-email"
                v-model="clientInfo.email"
                type="email"
                @focusout="updateClient('email', clientInfo.email)"
              />
            </b-form-group>
            <b-form-group
              label="Contact person skype"
              label-for="contact-person-skype"
            >
              <b-form-input
                id="contact-person-skype"
                v-model="clientInfo.skype"
                type="email"
                @focusout="updateClient('skype', clientInfo.skype)"
              />
            </b-form-group>
            <b-form-group
              label="Upwork Name"
              label-for="upwork-name"
            >
              <div
                v-for="(upname, index) in clientInfo.upwork_names"
                :key="index"
                class="d-flex flex-row align-items-center"
              >
                <b-form-input
                  id="upwork-name"
                  :key="index"
                  v-model="clientInfo.upwork_names[index]['name']"
                  class="mt-1"
                  @focusout="updateClient('upwork_name', clientInfo.upwork_names[index])"
                />
                <feather-icon
                  icon="Trash2Icon"
                  size="32"
                  class="text-body align-middle mr-25 cursor-pointer mt-1 ml-1"
                  @click="updateClient('upwork_name', clientInfo.upwork_names[index],true)"
                />
              </div>
              <b-button
                class="mt-1"
                variant="primary"
                @click="addUpworkName"
              >
                Add Upwork Name
              </b-button>
            </b-form-group>
          </b-col>
          <b-col
            cols="12"
            xl="6"
          >
            <b-form-group
              label="Notes"
              label-for="client-notes"
            >
              <b-form-textarea
                id="client-notes"
                v-model="clientInfo.notes"
                rows="15"
                cols="90"
                @focusout="updateClient('notes', clientInfo.notes)"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import {
  BRow, BCol, BCard, BFormGroup, BFormInput, BFormTextarea, BButton,
} from 'bootstrap-vue-next'
import axios from 'axios'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useJwt from '@/auth/jwt/useJwt'
import { analysError } from '@/_helpers/analys_error'

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BFormGroup,
    BFormInput,
    BFormTextarea,
    BButton,
  },
  props: {
    clientInfo: {
      type: [Object, Array],
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      clientEditable: {
        name: false,
        company: false,
        phone_number: false,
        email: false,
        skype: false,
        notes: false,
        contact_person: false,
      },
    }
  },
  methods: {
    addUpworkName() {
      this.clientInfo.upwork_names.push({ name: null, is_new: true })
    },
    deleteUpworkName(client, index) {
      client.upwork_names.splice(index, 1)
    },
    updateClient(targetEditable, value, isDeleteUpworkName = false) {
      const data = {}
      data[targetEditable] = value
      if (targetEditable === 'upwork_name') {
        if (!value.name && isDeleteUpworkName) {
          this.clientInfo.upwork_names.splice(this.clientInfo.upwork_names.indexOf(targetEditable), 1)
          return
        }
        if (!value.name) {
          return
        }
        data[targetEditable].is_delete = isDeleteUpworkName
      }
      data.isOneClientField = true
      axios.put(`${process.env.VUE_APP_API_URL}/client/${this.clientInfo.id}`, data, {
        headers: {
          Authorization: `Bearer ${useJwt.getToken()}`,
        },
      }).then(response => {
        this.clientEditable[targetEditable] = false
        this.$emit('update-client-info', response.data.data)
      }).catch(error => {
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
  },
}
</script>

<style scoped>

</style>
