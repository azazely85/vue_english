<template>
  <div>
    <b-row class="d-flex justify-content-center">
      <b-col
        cols="10"
      >
        <b-card
          class="border-primary"
        >
          <b-row class="d-flex justify-content-center">
            <b-col
              cols="12"
              xl="6"
              class="d-flex justify-content-between flex-column"
            >
              <b-form-group
                label="Project Name"
                label-for="project-name"
              >
                <b-form-input
                  id="project-name"
                  v-model="projectInfo.name"
                />
              </b-form-group>
              <b-form-group
                label="Total Tracked"
                label-for="total-tracked"
              >
                <div
                  id="total-tracked"
                  class="d-flex flex-row align-items-center"
                >
                  {{ prettyTotalTime }}
                </div>
              </b-form-group>
              <b-form-group
                label="Monthly Tracked"
                label-for="monthly-tracked"
              >
                <div
                  id="monthly-tracked"
                  class="d-flex flex-row align-items-center"
                >
                  {{ prettyMonthTime }}
                </div>
              </b-form-group>
              <b-form-group>
                <b-form-checkbox
                  v-model="hasHubstaffProject"
                >
                  Has Hubstaff projects
                </b-form-checkbox>
                <v-select
                  v-if="hasHubstaffProject"
                  v-model="projectInfo.project_alt_names"
                  single-line
                  dir="ltr"
                  multiple
                  :options="altNamesOptions"
                  label="name"
                  :close-on-select="false"
                />
              </b-form-group>
            </b-col>
            <b-col
              cols="12"
              xl="6"
            >
              <b-form-group
                label="Project Info"
                label-for="project-info"
              >
                <b-form-textarea
                  id="project-info"
                  value="\UD"
                  rows="10"
                  cols="90"
                />
              </b-form-group>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="d-flex justify-content-center">
      <b-col
        cols="10"
      >
        <b-card>
          <p v-if="projectInfo.contracts.length === 0">
            No contracts yet
          </p>
          <label v-else>Contracts</label>
          <b-table
            v-if="projectInfo.contracts.length > 0"
            :items="projectInfo.contracts"
            :fields="fields"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :busy="loading"
            responsive
            class="position-relative"
          >
            <template #table-busy>
              <div class="text-center my-2">
                <b-spinner class="align-middle mr-1" />
                <strong>Loading...</strong>
              </div>
            </template>
            <template #cell(title)="data">
              <b-form-input
                v-if="data.item.is_new || (isContractEdit && data.item.id === contractEditable)"
                v-model="data.item.title"
                placeholder="Type something..."
              />
              <span v-else>
                {{ data.value }}
              </span>
            </template>
            <template #cell(type)="data">
              <b-form-select
                v-model="data.item.type"
                :options="contractTypes"
                :value-field="data.value"
                :text-field="data.value"
              />
            </template>
            <template #cell(comrade_id)="data">
              <b-form-select
                :key="comradsList.id"
                v-model="data.item.comrade_id"
                :options="comradsList"
                value-field="id"
                text-field="name"
              />
            </template>
            <template #cell(payment_type)="data">
              <b-form-select
                v-if="data.item.is_new || (isContractEdit && data.item.id === contractEditable)"
                v-model="data.item.payment_type"
                :options="paymentTypes"
              />
              <span v-else>
                {{ data.value }}
              </span>
            </template>
            <template #cell(rate)="data">
              <b-form-input
                v-if="data.item.is_new || (isContractEdit && data.item.id === contractEditable)"
                v-model="data.item.rate"
                placeholder="Type something..."
                type="number"
              />
              <span v-else>
                {{ data.value }}
              </span>
            </template>
            <template #cell(hours_this_week)="data">
              <span>
                {{ data.item.hours_this_week }}
              </span>
            </template>
            <template #cell(hours_last_week)="data">
              <span>
                {{ data.item.hours_last_week }}
              </span>
            </template>
            <template #cell(actions)="data">
              <b-button
                v-if="isContractEdit"
                variant="danger"
                @click="isContractEdit = false"
              >
                Cancel
              </b-button>
              <b-form-group v-else>
                <b-dropdown
                  v-if="!data.item.is_new"
                  variant="link"
                  toggle-class="text-decoration-none"
                  no-caret
                >
                  <template v-slot:button-content>
                    <feather-icon
                      icon="MoreVerticalIcon"
                      size="16"
                      class="text-body align-middle mr-25"
                    />
                  </template>
                  <b-dropdown-item
                    v-for="menuItem in menuData"
                    :key="menuItem.text"
                    @click="optionClicked(menuItem.text, menuItem.icon, data.item)"
                  >
                    <feather-icon
                      :icon="menuItem.icon"
                      class="mr-50"
                    />
                    <span>{{ menuItem.text }}</span>
                  </b-dropdown-item>
                </b-dropdown>
                <feather-icon
                  v-else
                  icon="Trash2Icon"
                  size="32"
                  class="text-body align-middle mr-25 cursor-pointer"
                  @click="deleteContract(data.item, data.item.is_new)"
                />
              </b-form-group>
            </template>
          </b-table>
          <div
            class="w-100 d-flex justify-content-between"
          >
            <b-button
              variant="primary"
              @click="createContract"
            >
              Create Contract
            </b-button>
          </div>
        </b-card>
        <b-row
          class="d-flex justify-content-end"
        >
          <b-button
            variant="danger"
            class="mr-1"
            @click="deleteProject"
          >
            Delete Project
          </b-button>
        </b-row>
      </b-col>
    </b-row>
    <b-row>
      <div
        class="fixed-bottom text-right"
      >
        <b-button
          v-if="needUpdate"
          variant="primary"
          class="m-2"
          @click="updateProject"
        >
          Update Project
        </b-button>
        <b-spinner
          v-if="loading"
          class="m-2"
        />
      </div>
    </b-row>
  </div>
</template>

<script>
import {
  BFormGroup, BFormInput, BFormTextarea, BFormSelect, BTable, BButton, BDropdown, BDropdownItem, BFormCheckbox,
  BRow, BCol, BCard, BCardHeader, BCardBody,
} from 'bootstrap-vue'
import axios from 'axios'
import ToastificationContent from '@core/components/toastification/ToastificationContent'
import lodash from 'lodash'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import useJwt from '@/auth/jwt/useJwt'
import { analysError } from '@/_helpers/analys_error'

export default {
  components: {
    BFormGroup,
    BFormInput,
    BFormTextarea,
    BFormSelect,
    BTable,
    BButton,
    BDropdown,
    BDropdownItem,
    BFormCheckbox,
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardBody,
    vSelect,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      paymentTypes: [
        'monthly', 'weekly',
      ],
      projectInfo: {},
      beforeUpdateProjectInfo: {},
      loading: false,
      needUpdate: false,
      sortBy: 'title',
      sortDesc: false,
      fields: [
        {
          key: 'title',
          label: 'Title',
          sortable: true,
          tdClass: 'text-center ml-2',
          thClass: 'text-center',
        },
        {
          key: 'type',
          label: 'Type',
          sortable: false,
          tdClass: 'text-center p-0',
          thClass: 'text-center',
        },
        {
          key: 'comrade_id',
          label: 'Comrade',
          sortable: true,
          tdClass: 'text-center p-0',
          thClass: 'text-center',
        },
        {
          key: 'payment_type',
          label: 'Payment Type',
          sortable: true,
          tdClass: 'text-center mr-1',
          thClass: 'text-center',
        },
        {
          key: 'rate',
          label: 'Rate',
          sortable: true,
          tdClass: 'text-center p-0',
          thClass: 'text-center',
        },
        {
          key: 'hours_this_week',
          label: 'Hours this week',
          sortable: true,
          tdClass: 'text-center p-0',
          thClass: 'text-center',
        },
        {
          key: 'hours_last_week',
          label: 'Hours last week',
          sortable: true,
          tdClass: 'text-center p-0',
          thClass: 'text-center',
        },
        {
          key: 'actions',
          label: '',
          sortable: false,
          tdClass: 'text-center p-0',
          thClass: 'text-center',
        },
      ],
      comradsList: {},
      contractTypes: [
        'Hubstaff', 'Upwork',
      ],
      isContractEdit: false,
      contractEditable: 0,
      menuData: [
        { icon: 'EditIcon', text: 'Edit' },
        { icon: 'DeleteIcon', text: 'Delete' },
      ],
      newContractData: {
        title: '',
        type: 'Hubstaff',
        comrade: null,
        payment_type: null,
        rate: null,
        is_new: true,
      },
      hasHubstaffProject: false,
      selectedAltNames: [],
      altNamesOptions: [],
    }
  },
  computed: {
    prettyTotalTime() {
      const sec = this.projectInfo.total_tracked_time
      const hours = Math.floor(sec / 3600) // get hours
      let minutes = Math.floor((sec - (hours * 3600)) / 60) // get minutes
      // add 0 if value < 10; Example: 2 => 02
      if (minutes < 10) { minutes = `0${minutes}` }
      return `${hours} h ${minutes} m`
    },
    prettyMonthTime() {
      const sec = this.projectInfo.tracked_time_for_month
      const hours = Math.floor(sec / 3600) // get hours
      let minutes = Math.floor((sec - (hours * 3600)) / 60) // get minutes
      // add 0 if value < 10; Example: 2 => 02
      if (minutes < 10) { minutes = `0${minutes}` }
      return `${hours} h ${minutes} m`
    },
  },
  watch: {
    projectInfo: {
      deep: true,
      handler(newVal, oldVal) {
        if (!_.isEqual(newVal, this.beforeUpdateProjectInfo) && JSON.stringify(oldVal).length > 2) {
          this.needUpdate = true
        } else {
          this.needUpdate = false
        }
      },
    },
    // selectedAltNames(newVal, oldVal) {
    //   console.log(newVal)
    //   console.log(oldVal)
    // },
  },
  beforeMount() {
    this.getProjectInfo()
  },
  methods: {
    deleteProject() {
      this.$swal({
        title: 'Are you sure?',
        text: 'Do you really want delete this project?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          const projectId = this.$route.params.id
          axios.delete(`${process.env.VUE_APP_API_URL}/project/${projectId}`, {
            headers:
                { Authorization: `Bearer ${useJwt.getToken()}` },
          }).then(response => {
            this.$toast({
              component: ToastificationContent,
              position: 'top-right',
              props: {
                title: response.data.message,
                icon: 'XIcon',
                variant: 'danger',
              },
            })
            this.$router.push({ name: 'Clients' })
          }).catch(error => {
            this.needUpdate = true
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
      })
    },
    createContract() {
      this.newContractData.index = this.projectInfo.contracts.length
      this.projectInfo.contracts.push({ ...this.newContractData })
    },
    deleteContract(contract, isNew = false) {
      if (!isNew) {
        if (confirm('Do you want to delete this project?')) {
          const data = {
            contract_id: contract.id,
            project_id: this.$route.params.id,
          }
          axios.post(`${process.env.VUE_APP_API_URL}/project/deleteContract`, data, {
            headers:
                { Authorization: `Bearer ${useJwt.getToken()}` },
          }).then(response => {
            this.projectInfo = { ...response.data.data[0] }
            this.beforeUpdateProjectInfo = _.cloneDeep(response.data.data[0])
            this.$toast({
              component: ToastificationContent,
              position: 'top-right',
              props: {
                title: response.data.message,
                icon: 'XIcon',
                variant: 'danger',
              },
            })
          }).catch(error => {
            this.needUpdate = true
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
        }
      } else {
        const index = this.projectInfo.contracts.indexOf(contract)
        this.projectInfo.contracts.splice(index, 1)
      }
    },
    optionClicked(text, icon, project) {
      if (text === 'Edit') {
        this.isContractEdit = true
        this.contractEditable = project.id
        this.projectInfo.contracts.has_updated_contracts = true
        // this.editClientProject(projectId)
      } else if (text === 'Delete') {
        this.deleteContract(project)
      }
    },
    updateProject() {
      this.loading = true
      this.needUpdate = false
      axios.put(`${process.env.VUE_APP_API_URL}/project/${this.beforeUpdateProjectInfo.id}`, this.projectInfo, {
        headers:
            { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.loading = false
        this.isContractEdit = false
        this.projectInfo = { ...response.data.data }
        this.beforeUpdateProjectInfo = _.cloneDeep(response.data.data)
        this.$toast({
          component: ToastificationContent,
          position: 'top-right',
          props: {
            title: response.data.message,
            icon: 'CheckIcon',
            variant: 'success',
          },
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
              icon: 'CoffeeIcon',
              variant: 'error',
            },
          })
        })
      })
    },
    getComrads() {
      axios.get(`${process.env.VUE_APP_API_URL}/comrade`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.comradsList = { ...response.data.data }
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
    getProjectInfo() {
      const projectId = this.$route.params.id
      axios.get(`${process.env.VUE_APP_API_URL}/project/${projectId}`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.projectInfo = { ...response.data.data[0] }
        this.loading = false
        if (this.projectInfo.project_alt_names.length > 0) {
          this.hasHubstaffProject = true
          for (const key in this.projectInfo.project_alt_names) {
            this.selectedAltNames.push({
              name: this.projectInfo.project_alt_names[key].name,
              id: this.projectInfo.project_alt_names[key].id,
            })
            this.altNamesOptions.push({
              name: this.projectInfo.project_alt_names[key].name,
              id: this.projectInfo.project_alt_names[key].id,
            })
          }
        }
        if (this.projectInfo.unregistered_alt_names) {
          for (const key in this.projectInfo.unregistered_alt_names) {
            this.altNamesOptions.push({
              name: this.projectInfo.unregistered_alt_names[key].name,
              id: this.projectInfo.unregistered_alt_names[key].id,
            })
          }
        }
        this.$nextTick(() => {
          this.getComrads()
          this.beforeUpdateProjectInfo = _.cloneDeep(response.data.data[0])
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

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>

<style scoped>
.fit {
  white-space: nowrap !important;
  width: 1% !important;
}
</style>
