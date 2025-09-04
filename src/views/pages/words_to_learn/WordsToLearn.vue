<template>
  <div>
    <section slot="pdf-content">
      <b-table
        sticky-header="700px"
        :items="words"
        :fields="fields"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :sort-direction="sortDirection"
        :busy="loading"
        responsive
      >
        <template #cell(name)="data">
          <b-link
            :to="`/word/${data.value.toLowerCase()}`"
          >
            {{ data.value }}
          </b-link>
        </template>
        <template #cell(status)="data">
            <b-badge
              v-if="checkStatus(data)"
              variant="primary"
              v-b-tooltip.hover.v-primary
              title="Comrade birthday is soon!"
            >
             +
            </b-badge>
            <div v-else>
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
      words: [],
      fields: [
        {
          key: 'name',
          label: 'Name',
          sortable: true,
          tdClass: 'text-center ml-2',
          thClass: 'text-center',
        },
        {
          key: 'translate',
          label: 'Translate',
          sortable: true,
          tdClass: 'text-center ml-2',
          thClass: 'text-center',
        },
        {
          key: 'status',
          label: 'Status',
          sortable: true,
          tdClass: 'd-flex justify-content-center',
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
    this.getWords()
  },
  methods: {
    checkStatus(data) {
      let status = 0;
      if (data.wt) {
        status += 1;
      }
      if (data.tw) {
        status += 1;
      }
      if (data.audio_test) {
        status += 1;
      }
      return status
    },
    getWords() {
      this.loading = true
      axios.get(`${process.env.VUE_APP_API_URL}/user_words`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.loading = false
        this.words = response.data.data
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
