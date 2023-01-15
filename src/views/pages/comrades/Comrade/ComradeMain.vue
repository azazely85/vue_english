<template>
  <b-row>
    <b-col
      class="p-0"
      cols="12"
      xl="9"
      lg="8"
      md="7"
    >
      <b-col xl="12">
        <comrade-info
          v-if="comradeData"
          :comrade-data="comradeData"
        />
      </b-col>
      <b-col
        class="p-0"
        cols="12"
        xl="12"
        lg="12"
        md="12"
      >
        <b-col xl="12">
          <comrade-contracts
            v-if="comradeData"
            :comrade-data="comradeData"
          />
        </b-col>
      </b-col>
    </b-col>
    <b-col
      cols="12"
      md="5"
      xl="3"
      lg="4"
    >
      <comrade-workload-and-salary
        v-if="comradeData.id"
        :comrade-id="comradeData.id"
      />
    </b-col>
  </b-row>
</template>

<script>
import { BRow, BCol } from 'bootstrap-vue'
import ComradeInfo from '@/views/pages/comrades/Comrade/ComradeInfo.vue'
import ComradeContracts from '@/views/pages/comrades/Comrade/ComradeContracts.vue'
import ComradeWorkloadAndSalary from '@/views/pages/comrades/Comrade/ComradeWorkloadAndSalary.vue'
import axios from 'axios'
import useJwt from '@/auth/jwt/useJwt'
import { analysError } from '@/_helpers/analys_error'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BCol,
    BRow,
    ComradeInfo,
    ComradeContracts,
    ComradeWorkloadAndSalary,
  },
  data() {
    return {
      comradeData: [],
    }
  },
  beforeMount() {
    this.getComradeData()
  },
  methods: {
    getComradeData() {
      const comradeId = this.$route.params.id
      axios
        .get(`${process.env.VUE_APP_API_URL}/comrade/${comradeId}`, {
          headers: { Authorization: `Bearer ${useJwt.getToken()}` },
        })
        .then(response => {
          this.comradeData = { ...response?.data?.data[0] }
        })
        .catch(error => {
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
