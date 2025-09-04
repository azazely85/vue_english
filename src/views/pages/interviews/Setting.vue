<template>
  <b-card>
    <b-card-header>
      <b-row>
        <b-col cols="12">
          <b-card-title class="font-large-2">
            Import questions
          </b-card-title>
        </b-col>
      </b-row>
    </b-card-header>
    <b-card-body>
      <b-row>
        <b-col
          cols="12"
          lg="3"
        >
          <b-form-file
            v-model="file"
            placeholder="Choose a file or drop it here..."
            drop-placeholder="Drop file here..."
            :accept="acceptedTypes"
          />
        </b-col>
        <b-col
          cols="12"
          lg="9"
        >
          <b-spinner
            v-if="loading"
            class="ml-2"
          />
          <b-button
            v-else
            variant="primary"
            @click="importQuestions()"
          >
            Import
          </b-button>
        </b-col>
        <b-col
          cols="12"
        >
          <b-link
            :href="sampleDownload"
          >
            Sample File
          </b-link>
        </b-col>
      </b-row>
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BCard, BCardBody, BCardTitle, BCardHeader, BFormFile, BRow, BCol, BSpinner, BButton, BLink,
} from 'bootstrap-vue-next'
import axios from 'axios'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useJwt from '@/auth/jwt/useJwt'
import { analysError } from '@/_helpers/analys_error'

export default {
  components: {
    BCard,
    BCardBody,
    BCardTitle,
    BCardHeader,
    BFormFile,
    BRow,
    BCol,
    BSpinner,
    BButton,
    BLink,
  },
  data() {
    return {
      file: null,
      acceptedTypes: '.csv, .xlsx, .xls',
      loading: false,
      sampleDownload: `${process.env.VUE_APP_API_URL}/download/questions/import-example`,
    }
  },
  methods: {
    importQuestions() {
      this.loading = true
      const formData = new FormData()
      formData.append('file', this.file)
      axios.post(`${process.env.VUE_APP_API_URL}/question`, formData, {
        headers: {
          Authorization: `Bearer ${useJwt.getToken()}`,
          'Content-Type': 'multipart/form-data',
        },
      }).then(response => {
        this.loading = false
        this.$swal({
          title: response.data.message,
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-primary',
          },
          buttonsStyling: false,
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
  },
}
</script>

<style scoped>

</style>
