<template>
  <b-overlay
      :show="loading"
      spinner-type="grow"
      spinner-variant="primary"
      :variant="`transparent`"
      :opacity="1"
      :blur="`2px`"
      rounded="lg"
  >
    <b-container class="bv-example-row">
      <b-row>

          <p v-if="users.length === 0">
            Nothing to Show
          </p>
          <b-table
              v-else
              hover
              responsive
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              :items="users"
              :fields="fields"
          >

            <template
                #cell(role)="data"
            >

                {{ data.item.role === 1 ? 'Admin' : 'Manager'}}


            </template>
            <template #cell(action)="data">
              <b-form-group>
                <feather-icon
                    v-for="menuItem in menuData"
                    :id="menuItem.text + data.item.id"
                    :key="menuItem.text"
                    :icon="menuItem.icon"
                    class="mr-50"
                    size="20"
                    @click="optionClicked(menuItem.text, menuItem.icon, data.item.id)"
                />
              </b-form-group>
            </template>
          </b-table>
          <b-container class="bv-example-row" v-if="users.length > 0">
            <b-row align="end">
              <b-col
                  cols="10"
              >
                <b-pagination
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    align="center"
                    size="sm"
                    class="my-0"
                    @change="pagination"
                />
              </b-col>
              <b-col
                  cols="2"
                  align="end"
              >
                <b-form-select
                    id="pages"
                    size="sm"
                    @change="getUsers"
                    v-model="perPage"
                    :options="perPages"
                    value-field="name"
                    text-field="name"
                />
              </b-col>
            </b-row>
          </b-container>

      </b-row>
    </b-container>
  </b-overlay>
</template>

<script>
import {
  BButton,
  BSpinner,
  BRow,
  BCol,
  BCard,
  BCardBody,
  BFormFile,
  BLink,
  BTable,
  BBadge,
  BOverlay,
  BFormSelect,
  BPagination,
  BContainer, BFormGroup
} from 'bootstrap-vue'
import axiosIns from '@/libs/axios'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { analysError } from '@/_helpers/analys_error'
import axios from "axios";
import useJwt from "@/auth/jwt/useJwt";

export default {
  components: {
    BButton,
    BContainer,
    BSpinner,
    BRow,
    BCol,
    BCard,
    BCardBody,
    BFormFile,
    BFormGroup,
    BOverlay,
    BFormSelect,
    BPagination,
    BLink,
    BTable,
    BBadge
  },
  data() {
    return {
      users: [],
      perPage: 10,
      totalRows: 0,
      sortBy: 'lastname',
      sortDesc: false,
      currentPage: 1,
      perPages: [
        {name: 10},
        {name: 25},
        {name: 50},
        {name: 100}
      ],
      fields: [
        {
          key: 'firstname', label: 'First Name', sortable: true, tdClass: 'text-center', thClass: 'text-center',
        },
        {
          key: 'lastname', label: 'Last Name', sortable: true, tdClass: 'text-center', thClass: 'text-center',
        },
        {
          key: 'email', label: 'Email', sortable: true, tdClass: 'text-center', thClass: 'text-center',
        },
        {
          key: 'role', label: 'Role', sortable: true, tdClass: 'text-center', thClass: 'text-center',
        },
        {
          key: 'action', label: 'Action', sortable: false, tdClass: 'text-center', thClass: 'text-center',
        },
      ],
      menuData: [
        { icon: 'EditIcon', text: 'Change role' },
        { icon: 'DeleteIcon', text: 'Delete' }
      ],
      loading: false,
    }
  },
  beforeMount() {
    this.getUsers()
  },
  methods: {
    pagination(value) {
      this.currentPage = value
    },
    optionClicked(text, icon, userId = null) {
      if (text === 'Change role') {
        this.changeRole(userId)
      } else if (text === 'Delete') {
        this.deleteUser(userId)
      }
    },
    deleteUser(userId) {
      // this.isTargetTransaction()
      if (confirm('Are you sure delete this user?')) {
        this.loading = true
        axios.delete(`${process.env.VUE_APP_API_URL}/auth/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${useJwt.getToken()}`,
          },
        }).then(response => {
          this.loading = false
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: response.data.message,
              icon: 'CheckIcon',
              variant: 'success',
            },
          })
          this.getUsers();
        }).catch(error => {
          this.loading = false
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: analysError(error.response),
              icon: 'XIcon',
              variant: 'danger',
            },
          })
        })
      }
    },
    changeRole(userId) {
      // this.isTargetTransaction()
      if (confirm('Are you sure change role?')) {
        this.loading = true
        axios.put(`${process.env.VUE_APP_API_URL}/user/${userId}`, {}, {
          headers: {
            Authorization: `Bearer ${useJwt.getToken()}`,
          },
        }).then(response => {
          this.loading = false
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: response.data.message,
              icon: 'CheckIcon',
              variant: 'success',
            },
          })
          this.getUsers();
        }).catch(error => {
          this.loading = false
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: analysError(error.response),
              icon: 'XIcon',
              variant: 'danger',
            },
          })
        })
      }
    },
    getUsers() {
      this.loading = true
      axiosIns.get('auth/users'
          + `?page=${this.currentPage}&per_page=${this.perPage}&sortBy=${this.sortBy}&sortType=${this.sortDesc}`)
          .then(response => {
          this.users = response.data.data.data
          this.totalRows = response.data.data.total
          this.loading = false
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