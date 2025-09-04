<template>
  <b-row>
    <b-col
      cols="12"
      lg="4"
    >
      <b-card class="border-primary">
        <b-card-header>
          <b-card-title>
            Candidate Name: {{ candidate.name }}
          </b-card-title>
        </b-card-header>
        <b-card-body>
          <b-row class="d-flex flex-wrap ">
            <b-col cols="12">
              <p class="font-medium-2">
                Interview Date: {{ startDate }} - {{ dueDate }}
              </p>
            </b-col>
            <b-col cols="12">
              <p class="font-medium-2">
                Interviewer Name: {{ candidate.interviewer_name }}
              </p>
            </b-col>
            <b-col cols="12">
              <p class="font-medium-2">
                Position: {{ candidate.position }}
              </p>
            </b-col>
            <b-col cols="12">
              <p class="font-medium-2">
                Level: {{ candidate.level.title }}
              </p>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </b-col>
    <b-col
      cols="12"
      lg="8"
    >
      <b-card class="border-primary">
        <b-card-header>
          <b-card-title>
            Questions
          </b-card-title>
        </b-card-header>
        <b-card-body>
          <app-collapse
            type="border"
          >
            <app-collapse-item
              v-for="technology in technologyTitles"
              :key="technology"
              :title="`${technology} ${getTechnologyRate(technology)} / ${getTotalTechnologyRate(technology)}`"
            >
              <b-list-group class="w-100">
                <b-list-group-item
                  v-for="(question) in questions.filter(question_ => question_.technology.title === technology)"
                  :key="question.id"
                  class="d-flex justify-content-between align-items-center"
                >
                  <span>{{ question.question }}</span>
                  <b-form-rating
                    v-model="question.rate"
                    no-border
                    show-value
                    :stars="stars"
                    inline
                    variant="warning"
                  />
                </b-list-group-item>
              </b-list-group>
            </app-collapse-item>
          </app-collapse>
          <b-row>
            <b-col
              cols="12"
            >
              <label class="font-medium-1">Your Rate:</label>
              <b-form-rating
                v-model="candidate.rate"
                no-border
                show-value
                stars="7"
                inline
                variant="warning"
              />
            </b-col>
            <b-col
              cols="12"
            >
              <label class="font-medium-1">Your feedback:</label>
              <b-form-textarea v-model="candidate.feedback" />
            </b-col>
            <b-col
              cols="12"
              class="mt-1"
            >
              <b-spinner
                v-if="loading"
                class="ml-2"
              />
              <b-button
                v-else
                variant="primary"
                @click="finishInterview()"
              >
                Finish Interview
              </b-button>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import {
  BCard, BRow, BCol, BCardTitle, BCardHeader, BCardBody, BListGroup, BListGroupItem, BFormRating, BButton, BFormTextarea,
  BSpinner,
} from 'bootstrap-vue-next'
import axios from 'axios'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import AppCollapse from '@core/components/app-collapse/AppCollapse.vue'
import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue'
import useJwt from '@/auth/jwt/useJwt'
import { analysError } from '@/_helpers/analys_error'
import QuestionsTabsComponent from '@/views/pages/interviews/QuestionsTabsComponent'

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BCardTitle,
    BCardHeader,
    BCardBody,
    BFormRating,
    BButton,
    BFormTextarea,
    BSpinner,
    QuestionsTabsComponent,
    BListGroup,
    BListGroupItem,
    AppCollapse,
    AppCollapseItem,
  },
  data() {
    return {
      questions: [],
      candidate: [],
      loading: false,
      technologyTitles: [],
      stars: 7,
    }
  },
  computed: {
    startDate() {
      return this.$moment(this.candidate.interview_start_date).format('MM-DD-YYYY')
    },
    dueDate() {
      return this.$moment(this.candidate.interview_due_date).format('MM-DD-YYYY')
    },
  },
  beforeMount() {
    this.getQuestionsForCandidate()
  },
  methods: {
    getTotalTechnologyRate(title) {
      return this.stars * this.questions.filter(question_ => question_.technology.title === title).length
    },
    getTechnologyRate(title) {
      let sum = 0
      const filteredQuestions = this.questions.filter(question => question.technology.title === title)
      filteredQuestions.map(fquestion => {
        if (fquestion.hasOwnProperty('rate')) {
          sum += fquestion.rate
        }
      })
      return sum
    },
    getQuestionsForCandidate() {
      axios.get(`${process.env.VUE_APP_API_URL}/question/${this.$route.params.hash}`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.candidate = response.data.data.candidate
        this.questions = response.data.data.questions
        this.questions.map(question => {
          if (!this.technologyTitles.includes(question.technology.title)) {
            this.technologyTitles.push(question.technology.title)
          }
        })
      }).catch(error => {
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
    finishInterview() {
      this.loading = true
      const data = {
        candidate: this.candidate,
        questions: this.questions,
      }
      axios.post(`${process.env.VUE_APP_API_URL}/finish-interview`, data, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
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
