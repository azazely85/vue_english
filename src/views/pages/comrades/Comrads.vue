<template>
  <div>
    <section slot="pdf-content">
      <b-table
        sticky-header="700px"
        :items="comrads"
        :fields="fields"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :sort-direction="sortDirection"
        :busy="loading"
        responsive
      >
        <template #cell(name)="data">
          <b-link
            :to="`/comrade-info/${data.item.id}`"
          >
            {{ data.value }}
          </b-link>
        </template>
        <template #cell(dob)="data">
          <div
            v-if="data.value"
            style="width: 85px"
          >
            <b-badge
              v-if="checkDobAlert(data.value)"
              variant="primary"
              v-b-tooltip.hover.v-primary
              title="Comrade birthday is soon!"
            >
              {{ data.value | moment("MM-DD-YYYY") }}
            </b-badge>
            <div v-else>
              {{ data.value | moment("MM-DD-YYYY") }}
            </div>
          </div>
          <div
            v-else
          >
            -
          </div>
        </template>
        <template #cell(date_start_job)="data">
          <div
            v-if="data.value"
            style="width: 85px"
          >
            {{ data.value | moment("MM-DD-YYYY") }}
          </div>
          <div
            v-else
          >
            -
          </div>
        </template>
        <template #cell(date_salary)="data">
          <div
            v-if="data.value"
            style="width: 85px"
          >
            {{ data.value | moment("MM-DD-YYYY") }}
          </div>
          <div
            v-else
          >
            -
          </div>
        </template>
        <template #cell(emergency_phone)="data">
          <b-link
            v-if="data.value"
            :href="`tel:${data.value.replace(/\s+/g, '')}`"
          >
            {{ data.value.replace(/\s+/g, '') }}
          </b-link>
          <div
            v-else
          >
            -
          </div>
        </template>
        <template #cell(position)="data">
          <div
            v-if="data.value"
          >
            {{ data.value }}
          </div>
          <div
            v-else
          >
            -
          </div>
        </template>
        <template #cell(job_offer)="data">
          <a
            v-if="data.value"
            :href="JSON.parse(data.value)[0]"
          >
            <feather-icon
              icon="FileIcon"
              size="24"
              class="text-body align-middle mr-25 cursor-pointer mt-1 ml-1"
            />
          </a>
          <div
            v-else
          >
            -
          </div>
        </template>
        <template #cell(phone)="data">
          <a
            v-if="data.value"
            :href="`tel:${data.value.replace(/\s+/g, '')}`"
          >
            {{ data.value.replace(/\s+/g, '') }}
          </a>
          <div
            v-else
          >
            -
          </div>
        </template>
        <template #cell(payoneer_email)="data">
          <a
            v-if="data.value"
            :href="`mailto:${data.value}`"
          >
            {{ data.value }}
          </a>
          <div
            v-else
          >
            -
          </div>
        </template>
        <template #cell(devurai_email)="data">
          <a
            v-if="data.value"
            :href="`mailto:${data.value}`"
          >
            {{ data.value }}
          </a>
          <div
            v-else
          >
            -
          </div>
        </template>
        <template #cell(projects)="data">
          <div
            v-if="data.value"
          >
            {{ data.value }}
          </div>
          <div
            v-else
          >
            -
          </div>
        </template>
        <template
          #cell(social)="data"
        >
          <b-row
            v-if="data.value"
            class="d-flex flex-row flex-nowrap"
          >
            <b-link
              v-for="(social, key) in JSON.parse(data.value)"
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
          </b-row>
          <div
            v-else
          >
            -
          </div>
        </template>
        <template #cell(nda)="data">
          <a
            v-if="data.value"
            :href="JSON.parse(data.value)[0]"
          >
            <feather-icon
              icon="FileIcon"
              size="24"
              class="text-body align-middle mr-25 cursor-pointer mt-1 ml-1"
            />
          </a>
          <div
            v-else
          >
            -
          </div>
        </template>
        <template #cell(documents)="data">
          <b-row
            v-if="data.value"
            class="d-flex flex-row flex-nowrap"
          >
            <a
              v-for="(document, key) in JSON.parse(data.value)"
              :href="document"
              v-bind:key="key"
            >
              <feather-icon
                icon="FileIcon"
                size="24"
                class="text-body align-middle mr-25 cursor-pointer mt-1 ml-1"
              />
            </a>
          </b-row>
          <div
            v-else
          >
            -
          </div>
        </template>
      </b-table>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import {
  BTable,
  BLink,
  BRow,
  BBadge, VBTooltip,
} from 'bootstrap-vue-next'
import Ripple from 'vue-ripple-directive'
import ToastificationContent from '@core/components/toastification/ToastificationContent'
import { analysError } from '@/_helpers/analys_error'
import useJwt from '@/auth/jwt/useJwt'

export default {
  components: {
    BTable,
    BLink,
    BRow,
    BBadge,
  },
  directives: {
    Ripple,
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      comrads: [],
      fields: [
        {
          key: 'name',
          label: 'Name',
          sortable: true,
          tdClass: 'text-center ml-2',
          thClass: 'text-center',
        },
        {
          key: 'position',
          label: 'Position',
          sortable: true,
          tdClass: 'text-center ml-2',
          thClass: 'text-center',
        },
        {
          key: 'dob',
          label: 'Date of Birth',
          sortable: true,
          tdClass: 'd-flex justify-content-center',
          thClass: 'text-center',
        },
        {
          key: 'devurai_email',
          label: 'Devurai Email',
          sortable: true,
          tdClass: 'text-center ml-2',
          thClass: 'text-center',
        },
        {
          key: 'phone',
          label: 'Phone',
          sortable: true,
          tdClass: 'text-center ml-2',
          thClass: 'text-center',
        },
        {
          key: 'payoneer_email',
          label: 'Payoneer email',
          sortable: true,
          tdClass: 'text-center ml-2',
          thClass: 'text-center',
        },
        {
          key: 'date_salary',
          label: 'Next salary review',
          sortable: true,
          tdClass: 'text-center ml-2',
          thClass: 'text-center',
        },
      ],
      sortBy: 'name',
      sortDesc: false,
      sortDirection: 'asc',
      loading: false,
    }
  },
  beforeMount() {
    this.getComrads()
  },
  methods: {
    checkDobAlert(dob) {
      const dateOfBirth = this.$moment(dob)
      dateOfBirth.year(this.$moment().year())
      const dateFrom = this.$moment(dateOfBirth).subtract(7, 'd')
      const now = this.$moment()
      return now.isBetween(dateFrom, dateOfBirth) || dateOfBirth.format('YYYY-MM-DD') === now.format('YYYY-MM-DD')
    },
    generatePDF() {
      this.$refs.html2Pdf.generatePdf()
    },
    getComrads() {
      this.loading = true
      axios.get(`${process.env.VUE_APP_API_URL}/comrade`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.loading = false
        this.comrads = response.data.data
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
