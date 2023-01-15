<template>
      <b-overlay
        :show="loading"
        spinner-type="grow"
        spinner-variant="primary"
        :variant="`transparent`"
        :opacity="1"
        :blur="`2px`"
        rounded="sm"
      >
        <b-container align-h="around">
          <b-row class="justify-content-center">
            <b-col
              v-for="learning in learnings"
              :key="learning.id"
              cols="12"
              md="4"
              class="mb-2"
            >
              <b-card
                class="h-100"
              >
                <b-card-header
                  class="d-flex justify-content-end"
                >
                </b-card-header>
                <b-card-body
                  class="d-flex justify-content-center"
                >
                  <b-link
                    class="font-weight-bolder font-medium-3"
                    :to="`/learning/${learning.slug}`"
                  >
                    {{ learning.title }}
                  </b-link>
                </b-card-body>
              </b-card>
            </b-col>
          </b-row>
        </b-container>
      </b-overlay>
</template>

<script>
import {
  BRow, BCol, BContainer, BCard, BLink, BCardHeader, VBTooltip, BCardBody, BOverlay, BTabs, BTab,
} from 'bootstrap-vue'
import axiosIns from '@/libs/axios'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { StatusIndicator } from 'vue-status-indicator'
import { analysError } from '@/_helpers/analys_error'

export default {
  components: {
    BRow,
    BCol,
    BContainer,
    BCard,
    BLink,
    BTabs,
    BTab,
    BCardHeader,
    StatusIndicator,
    BCardBody,
    BOverlay,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      loading: false,
      onlyArchivedProjects: false,
      learnings: [
        {
          title: 'Brain Storm', slug: 'brain_storm'
        },
        {
          title: 'Word translate', slug: 'word_translate'
        },
        {
          title: 'Translate word', slug: 'translate_word'
        },
        {
          title: 'Audio train', slug: 'audio_train'
        }
      ],
      tabIndex: 0,
    }
  },
  beforeMount() {

  },
  methods: {

  },
}
</script>

<style scoped>

</style>
