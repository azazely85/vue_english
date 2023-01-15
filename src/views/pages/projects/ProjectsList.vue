<template>
  <div>
    <crud-table
      :key="projectsListKey"
      :table-items="projectsData"
      :table-fields="fields"
      :empty-item="emptyProject"
      :create-endpoint="`project`"
      :delete-endpoint="`project`"
      :update-endpoint="'project'"
      :data-as-check-box="['status']"
      :data-as-tree-select="['click_up_project_id']"
      :data-for-select="dataForTableSelect"
      :not-editable-data="['tracked_time_for_month']"
      :item-assign-to="Number($route.params.id)"
      :item-assign-key="`client_id`"
      :accordion-data="{rowItem: 'contracts', component: 'contracts-list', props: { comrades }}"
      :accordion-props-data="dataForAccordionSelect"
      :show-another-label-data="{click_up_project_id: 'click_up_project.title'}"
      :required-fields="['name', 'status', 'client_id']"
      @rerender-component="emitUpdated"
    />
  </div>
</template>

<script>
import axios from 'axios'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import Ripple from 'vue-ripple-directive'
import useJwt from '@/auth/jwt/useJwt'
import { analysError } from '@/_helpers/analys_error'
import CrudTable from '@/views/HelperComponents/CrudTable.vue'

export default {
  components: {
    CrudTable,
  },
  directives: {
    Ripple,
  },
  props: {
    projectsData: {
      type: [Array, Object],
      required: true,
    },
  },
  data() {
    return {
      projectsListKey: 0,
      fields: [
        {
          key: 'name',
          label: 'Name',
          sortable: true,
          tdClass: 'text-center',
          thClass: 'text-center',
          thStyle: 'width: 30%',
        },
        {
          key: 'status',
          label: 'Status',
          sortable: false,
          tdClass: 'text-center',
          thClass: 'text-center',
          thStyle: 'width: 5%',
        },
        {
          key: 'contact_person',
          label: 'Contact Person',
          sortable: false,
          tdClass: 'text-center',
          thClass: 'text-center',
          thStyle: 'width: 15%',
        },
        {
          key: 'click_up_project_id',
          label: 'ClickUp Space',
          sortable: false,
          tdClass: 'text-center',
          thClass: 'text-center',
          thStyle: 'width: 15%',
        },
        {
          key: 'tracked_time_for_month',
          label: 'Tracked This Month',
          sortable: false,
          tdClass: 'text-center',
          thClass: 'text-center',
          thStyle: 'width: 15%',
        },
        {
          key: 'actions',
          label: 'Actions',
          sortable: false,
          tdClass: 'text-center',
          thClass: 'text-center',
          thStyle: 'width: 10%',
        },
      ],
      defaultActions: [
        { icon: 'EditIcon', text: 'Edit' },
        { icon: 'DeleteIcon', text: 'Delete' },
      ],
      confirmActions: [
        { icon: 'CheckIcon', text: 'Confirm' },
        { icon: 'XIcon', text: 'Cancel' },
      ],
      emptyProject: {
        name: '',
        status: 0,
        contact_person: '',
        click_up_space_id: '',
        tracked_time_for_month: 0,
        contracts: [],
        is_new: true,
      },
      comrades: [],
      defaultPaymentTypes: [
        'hourly', 'monthly', 'fixed price',
      ],
      dataForAccordionSelect: {},
      dataForTableSelect: {
        click_up_project_id: {
          options: null,
          label: '',
        },
      },
    }
  },
  beforeMount() {
    this.getComradesList()
    this.getClickUpSpaces()
  },
  methods: {
    emitUpdated() {
      this.projectsListKey += 1
    },
    getClickUpSpaces() {
      axios.get(`${process.env.VUE_APP_API_URL}/click-up/spaces`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.dataForTableSelect.click_up_project_id.options = response.data.data
        this.dataForTableSelect.click_up_project_id.label = 'title'
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
    insertProject() {
      this.projectsData.push({ ...this.emptyProject })
    },
    getComradesList() {
      axios.get(`${process.env.VUE_APP_API_URL}/comrade`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.comrades = response.data.data
        this.dataForAccordionSelect = {
          comrade: {
            options: this.comrades,
            label: 'name',
            reduce: item => item,
          },
          payment_type: { options: this.defaultPaymentTypes, reduce: item => item },
        }
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

</style>
