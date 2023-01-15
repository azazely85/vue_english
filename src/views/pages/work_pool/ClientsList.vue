<template>
  <div>
    <crud-table
      :table-items="clientsData"
      :table-fields="fields"
      :create-endpoint="`client`"
      :delete-endpoint="`client`"
      :update-endpoint="`client`"
      :empty-item="emptyClient"
      :data-as-link="['name']"
      :link="`/client-info`"
      :required-fields="['name']"
    />
  </div>
</template>

<script>
import axios from 'axios'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useJwt from '@/auth/jwt/useJwt'
import { analysError } from '@/_helpers/analys_error'
import CrudTable from '@/views/HelperComponents/CrudTable.vue'

export default {
  components: {
    CrudTable,
  },
  data() {
    return {
      clientsData: [],
      fields: [
        {
          key: 'name', label: 'Name', sortable: true, tdClass: 'text-center', thClass: 'text-center',
        },
        {
          key: 'company', label: 'Company', sortable: false, tdClass: 'text-center', thClass: 'text-center',
        },
        {
          key: 'phone_number', label: 'Phone', sortable: false, tdClass: 'text-center', thClass: 'text-center',
        },
        {
          key: 'email', label: 'Email', sortable: false, tdClass: 'text-center', thClass: 'text-center',
        },
        {
          key: 'skype', label: 'Skype', sortable: false, tdClass: 'text-center', thClass: 'text-center',
        },
        {
          key: 'actions', label: 'Actions', sortable: false, tdClass: 'text-center', thClass: 'text-center',
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
      emptyClient: {
        name: '',
        company: '',
        phone_number: '',
        skype: '',
        notes: '',
        is_new: true,
        email: '',
      },
    }
  },
  beforeMount() {
    this.getClients()
  },
  methods: {
    selectAction(actionText, actionIcon, targetItem) {
      if (actionText === 'Edit') {
        const editableClient = this.clientsData.find(client => client.id === targetItem.id)
        this.$set(editableClient, 'edited', true)
        return
      }
      if (actionText === 'Confirm') {
        if (targetItem.is_new) {
          this.createClient(targetItem)
          return
        }
        if (targetItem.edited) {
          this.updateClient(targetItem)
          return
        }
      }
      if (actionText === 'Cancel') {
        if (targetItem.is_new) {
          const index = this.clientsData.indexOf(targetItem)
          this.clientsData.splice(index, 1)
          return
        }

        this.$delete(targetItem, 'edited')
        return
      }
      if (actionText === 'Delete') {
        this.deleteClient(targetItem.id)
      }
    },
    insertClient() {
      this.clientsData.push({ ...this.emptyClient })
    },
    createClient(clientData) {
      axios.post(`${process.env.VUE_APP_API_URL}/client`, clientData, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        const createdClient = this.clientsData.find(client => client === clientData)
        this.$delete(createdClient, 'is_new')
        this.$set(createdClient, 'id', response.data.data)
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
    deleteClient(clientId) {
      axios.delete(`${process.env.VUE_APP_API_URL}/client/${clientId}`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        const clientIndex = this.clientsData.indexOf(clientId)
        this.clientsData.splice(clientIndex)
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
    updateClient(clientData) {
      axios.put(`${process.env.VUE_APP_API_URL}/client/${clientData.id}`, this.clientsData.find(client => client.id === clientData.id),
        {
          headers: { Authorization: `Bearer ${useJwt.getToken()}` },
        }).then(response => {
        const editableClient = this.clientsData.find(client => client.id === clientData.id)
        this.$delete(editableClient, 'edited')
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
    getClients() {
      axios.get(`${process.env.VUE_APP_API_URL}/client`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.clientsData = response.data.data
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

<style scoped>

</style>
