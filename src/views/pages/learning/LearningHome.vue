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
                    {{ learning.title }} {{learning.count}}
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
} from 'bootstrap-vue-next'
import axiosIns from '@/libs/axios'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { StatusIndicator } from 'vue-status-indicator'
import { analysError } from '@/_helpers/analys_error'
import axios from "axios";
import useJwt from "@/auth/jwt/useJwt";

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
          title: 'Brain Storm', slug: 'brain_storm', count: 0
        },
        {
          title: 'Word translate', slug: 'word_translate', count: 0
        },
        {
          title: 'Translate word', slug: 'translate_word', count: 0
        },
        {
          title: 'Audio train', slug: 'audio_train', count: 0
        },
        {
          title: 'Repeat train', slug: 'repeat_train', count: 0
        }
      ],
      tabIndex: 0,
    }
  },
  beforeMount() {
    this.getCount()
  },
  methods: {
    getCount() {
      this.loading = true
      axios.get(`${process.env.VUE_APP_API_URL}/learning/count`, {
        headers: {Authorization: `Bearer ${useJwt.getToken()}`},
      }).then(response => {
        this.loading = false
        this.learnings = this.learnings.map((word) => {
         if (word.slug === 'word_translate') {
           word.count = response.data.wt
         }
          if (word.slug === 'translate_word') {
            word.count = response.data.tw
          }
          if (word.slug === 'audio_train') {
            word.count = response.data.audio
          }
          if (word.slug === 'repeat_train') {
            word.count = response.data.repeat
          }
          return word;
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
    }
  },
}
</script>

<style scoped>

</style>
