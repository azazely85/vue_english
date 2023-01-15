<template>
  <div>
    <p class="font-weight-bolder">
      Contracts
    </p>
    <crud-table
      :table-items="contracts"
      :table-fields="fields"
      :create-endpoint="`contracts`"
      :update-endpoint="`contracts`"
      :delete-endpoint="`contracts`"
      :empty-item="emptyContract"
      :not-editable-data="['type']"
      :data-as-select="['comrade', 'payment_type']"
      :data-for-select="dataForSelect"
      :item-assign-to="projectId"
      :item-assign-key="`project_id`"
      :confirm-alert="confirmAlertOptions"
      :custom-add-item-class="`d-flex justify-content-start pl-1`"
      :required-fields="['title', 'type', 'payment_type', 'rate']"
    />
  </div>
</template>

<script>
import axios from 'axios'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useJwt from '@/auth/jwt/useJwt'
import { analysError } from '@/_helpers/analys_error'
import { hubstaffPaymentTypes, upworkPaymentTypes } from '@/_helpers/payments_types'

export default {
  components: {
    CrudTable: () => import('@/views/HelperComponents/CrudTable.vue'),
  },
  props: {
    dataForSelect: {
      type: [Array, Object],
      required: true,
    },
    contracts: {
      type: [Array, Object],
      required: true,
    },
    projectId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      fields: [
        {
          key: 'title',
          label: 'Title',
          sortable: false,
          tdClass: 'text-center',
          thClass: 'text-center',
          thStyle: 'width: 30%',
        },
        {
          key: 'comrade',
          label: 'Comrade',
          sortable: false,
          tdClass: 'text-center',
          thClass: 'text-center',
          thStyle: 'width: 30%',
        },
        {
          key: 'payment_type',
          label: 'Payment Type',
          sortable: false,
          tdClass: 'text-center',
          thClass: 'text-center',
          thStyle: 'width: 15%',
        },
        {
          key: 'rate',
          label: 'Rate',
          sortable: false,
          tdClass: 'text-center',
          thClass: 'text-center',
          thStyle: 'width: 15%',
        },
        {
          key: 'type',
          label: 'Contract Type',
          sortable: false,
          tdClass: 'text-center',
          thClass: 'text-center',
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
      emptyContract: {
        title: '',
        comrade: '',
        project_id: this.projectId,
        is_new: true,
        rate: '',
      },
      confirmAlertOptions: {
        title: 'Choose contract type',
        afterAction: 'Insert',
        buttons: [
          {
            title: 'Upwork',
            updateTableField: 'payment_type',
            options: upworkPaymentTypes,
            data: 'Upwork',
          },
          {
            title: 'Hubstaff',
            updateTableField: 'payment_type',
            options: hubstaffPaymentTypes,
            data: 'Hubstaff',
          },
        ],
        closeable: true,
      },
      paymentType: [],
    }
  },
  methods: {
    getComradesList() {
      axios.get(`${process.env.VUE_APP_API_URL}/comrade`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.comrades = response.data.data
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
  },
}
</script>

<style scoped>

</style>
