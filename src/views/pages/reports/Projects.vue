<template>
  <b-tabs
      v-model="tabIndex"
      class="w-100"
  >
    <b-tab
        v-for="tab in tabs"
        :key="tab.title"
        :title="tab.title"
        :lazy="tab.lazy"
        @click="switchProjects(tab.onlyArchived)"
    >
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
            <span
              v-if="!projects.length"
              class="font-large-1"
            >
              No Projects Yet
            </span>
            <b-col
              v-for="project in projects"
              :key="project.id"
              cols="12"
              md="3"
              class="mb-2"
            >
              <b-card
                class="h-100"
              >
                <b-card-header
                  class="d-flex justify-content-end"
                >
                  <status-indicator
                    v-if="project.discrepancy_alert"
                    v-b-tooltip.hover.v-danger
                    title="Project has discrepancy with ClickUp"
                    :status="project.discrepancy_alert ? `negative` : ``"
                  />
                  <feather-icon v-if="!onlyArchivedProjects"
                      icon="CloudOffIcon"
                      class="ml-1 cursor-pointer"
                      size="20"
                      @click="updateArchive(project.id, true)"
                  />
                  <feather-icon v-else
                                icon="CloudIcon"
                                class="ml-1  cursor-pointer"
                                size="20"
                                @click="updateArchive(project.id, false)"
                  />
                </b-card-header>
                <b-card-body
                  class="d-flex justify-content-center"
                >
                  <b-link
                    class="font-weight-bolder font-medium-3"
                    :to="`/reports/projects/project/${project.id}`"
                  >
                    {{ project.name }}
                  </b-link>
                </b-card-body>
              </b-card>
            </b-col>
          </b-row>
        </b-container>
      </b-overlay>
    </b-tab>
  </b-tabs>
</template>

<script>
import {
  BRow, BCol, BContainer, BCard, BLink, BCardHeader, VBTooltip, BCardBody, BOverlay, BTabs, BTab,
} from 'bootstrap-vue-next'
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
      projects: [],
      loading: false,
      onlyArchivedProjects: false,
      tabs: [
        {
          title: 'Main', onlyArchived: false, active: true, isMain: true, lazy: false,
        },
        {
          title: 'Archived', onlyArchived: true, active: false, lazy: true,
        },
      ],
      tabIndex: 0,
    }
  },
  beforeMount() {
    this.getProjects()
  },
  watch: {
    onlyArchivedProjects() {
      this.getProjects()
    },
  },
  methods: {
    switchProjects(onlyArchived) {
      this.onlyArchivedProjects = onlyArchived
    },
    getProjects() {
      this.loading = true
      axiosIns.get(`/project?archived=${this.onlyArchivedProjects}`).then(response => {
        this.loading = false
        this.projects = response.data.data
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
              icon: 'CoffeeIcon',
              variant: 'error',
            },
          })
        })
      })
    },
    updateArchive(id, archived) {
      this.loading = true
      let data = {
        archived
      }
      axiosIns.post(`/project/archive/${id}`, data).then(response => {
        this.getProjects()
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
