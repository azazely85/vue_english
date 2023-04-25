<template>
  <section id="dashboard-analytics">
    ADMIN HOME PAGE
  </section>
</template>

<script>
import { BRow, BCol } from 'bootstrap-vue'

import StatisticCardWithAreaChart from '@core/components/statistics-cards/StatisticCardWithAreaChart.vue'
import { kFormatter } from '@core/utils/filter'
import axios from 'axios'
import ToastificationContent from '@core/components/toastification/ToastificationContent'
import useJwt from '@/auth/jwt/useJwt'
import { analysError } from '@/_helpers/analys_error'
// import InvoiceList from '@/views/apps/invoice/invoice-list/InvoiceList.vue'
// import AnalyticsCongratulation from './AnalyticsCongratulation.vue'
// import AnalyticsAvgSessions from './AnalyticsAvgSessions.vue'
// import AnalyticsSupportTracker from './AnalyticsSupportTracker.vue'
// import AnalyticsTimeline from './AnalyticsTimeline.vue'
// import AnalyticsSalesRadarChart from './AnalyticsSalesRadarChart.vue'
// import AnalyticsAppDesign from './AnalyticsAppDesign.vue'

export default {
  components: {
    BRow,
    BCol,
    // AnalyticsCongratulation,
    // AnalyticsAvgSessions,
    // StatisticCardWithAreaChart,
    // AnalyticsSupportTracker,
    // AnalyticsTimeline,
    // AnalyticsSalesRadarChart,
    // AnalyticsAppDesign,
    // InvoiceList,
  },
  data() {
    return {
      data: {},
    }
  },
  created() {
    // data
    // this.$http.get('/analytics/data')
    //   .then(response => { this.data = response.data })
  },

  beforeMount() {
  },
  methods: {
    kFormatter,
  },
}
</script>
