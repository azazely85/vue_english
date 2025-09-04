<template>
  <div>
    <b-overlay
      :show="loading"
      spinner-type="grow"
      spinner-variant="primary"
      :variant="`transparent`"
      :opacity="1"
      :blur="`2px`"
      rounded="sm"
    >
      <alert-with-choose
        :show.sync="showConfirmAlert"
        :options="confirmAlert"
        @button-clicked="optionSelected"
      />
      <span v-if="tableItems.length === 0">No Data</span>
      <b-table
        v-else
        responsive
        hover
        :items="tableItems"
        :fields="tableFields"
        @row-clicked="toggleDetails"
      >
        <template
          v-for="field in tableFields"
          v-slot:[`cell(${field.key})`]="data"
        >
          <crud-table-show-data-as
            :key="field.key"
            :data-as="{dataAsCheckBox, dataAsLink, dataAsSelect, dataAsTreeSelect}"
            :select-options="dataForSelect"
            :not-editable="notEditableData"
            :table-key="field.key"
            :item="data.item"
            :link="link"
            :show-another-label-data="showAnotherLabelData"
            :required-fields="requiredFields"
          />
        </template>
        <template
          #row-details="row"
        >
          <component
            :is="`${accordionData.component}`"
            v-if="accordionData && !row.item.hasOwnProperty('is_new')"
            :data-for-select="accordionPropsData"
            :contracts="row.item[accordionData.rowItem]"
            :project-id="row.item.id"
          />
        </template>
        <template #cell(actions)="data">
          <b-form-group
            v-if="!data.item.edited && !data.item.is_new"
          >
            <feather-icon
              v-for="action in defaultActions"
              :id="action.text + data.item.id"
              :key="action.text"
              :icon="action.icon"
              class="mr-50"
              size="20"
              @click="selectAction(action.text, action.icon, data.item)"
            />
          </b-form-group>
          <b-form-group
            v-else
          >
            <feather-icon
              v-for="action in confirmActions"
              :id="action.text + data.item.id"
              :key="action.text"
              :icon="action.icon"
              class="mr-50"
              size="20"
              @click="selectAction(action.text, action.icon, data.item)"
            />
          </b-form-group>
        </template>
      </b-table>
    </b-overlay>
    <b-row
      v-if="showCreateItem"
      :class="customAddItemClass ? customAddItemClass : `d-flex justify-content-center`"
    >
      <b-button
        class="rounded"
        variant="primary"
        @click="selectAction('Insert', '+', {})"
      >
        +
      </b-button>
    </b-row>
  </div>
</template>

<script>
import {
  BButton, BFormCheckbox, BFormGroup, BFormInput, BLink, BRow, BTable, BSpinner, BOverlay,
} from 'bootstrap-vue-next'
import axios from 'axios'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import vSelect from 'vue-select'
import useJwt from '@/auth/jwt/useJwt'
import { analysError } from '@/_helpers/analys_error'
import ContractsList from '@/views/pages/projects/ContractsList.vue'
import CrudTableShowDataAs from '@/views/HelperComponents/CrudTableShowDataAs.vue'
import alertWithChoose from '@/views/HelperComponents/alertWithChoose.vue'

export default {
  components: {
    BTable,
    BFormInput,
    BFormCheckbox,
    BFormGroup,
    BButton,
    BLink,
    BRow,
    BSpinner,
    BOverlay,
    ContractsList,
    CrudTableShowDataAs,
    alertWithChoose,
    vSelect,
  },
  props: {
    showCreateItem: {
      type: Boolean,
      required: false,
      default() {
        return true
      },
    },
    tableItems: {
      type: Array,
      required: true,
    },
    tableFields: {
      type: Array,
      required: true,
    },
    dataAsCheckBox: {
      type: Array,
      required: false,
      default() {
        return []
      },
    },
    dataAsSelect: {
      type: Array,
      required: false,
      default() {
        return []
      },
    },
    dataAsTreeSelect: {
      type: Array,
      required: false,
      default() {
        return []
      },
    },
    createEndpoint: {
      type: String,
      required: true,
    },
    updateEndpoint: {
      type: String,
      required: true,
    },
    deleteEndpoint: {
      type: String,
      required: true,
    },
    emptyItem: {
      type: Object,
      required: true,
    },
    notEditableData: {
      type: Array,
      required: false,
      default() {
        return []
      },
    },
    itemAssignTo: {
      type: Number,
      required: false,
    },
    itemAssignKey: {
      type: String,
      required: false,
    },
    dataAsLink: {
      type: Array,
      required: false,
    },
    link: {
      type: String,
      required: false,
    },
    accordionData: {
      type: Object,
      required: false,
    },
    accordionPropsData: {
      type: [Array, Object],
      required: false,
    },
    dataForSelect: {
      type: [Array, Object],
      required: false,
    },
    confirmAlert: {
      type: Object,
      required: false,
      default() {
        return {}
      },
    },
    showAnotherLabelData: {
      type: Object,
      required: false,
      default() {
        return {}
      },
    },
    customAddItemClass: {
      type: String,
      required: false,
      default() {
        return ''
      },
    },
    requiredFields: {
      type: Array,
      required: false,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      defaultActions: [
        { icon: 'EditIcon', text: 'Edit' },
        { icon: 'DeleteIcon', text: 'Delete' },
      ],
      confirmActions: [
        { icon: 'CheckIcon', text: 'Confirm' },
        { icon: 'XIcon', text: 'Cancel' },
      ],
      renderAccordionData: false,
      loading: false,
      showConfirmAlert: false,
      additionalData: null,
    }
  },
  computed: {
    confirmAlertAction() {
      return this.confirmAlert.afterAction
    },
  },
  methods: {
    // accordionDataProps(row) {
    //   const propsObj = JSON.parse(this.accordionData.props)
    //   for (let i = 0; i < Object.values(propsObj).length; i++) {
    //     Object.keys(propsObj).forEach(key => {
    //       propsObj[key] = this.parseProps(propsObj[key], row)
    //     })
    //   }
    // },
    // parseProps(propValue, row) {
    //   const items = propValue.split('[').join(',').split(']').join(',')
    //     .split(',')
    //   let path = ''
    //   items.forEach(item => {
    //     const splittedItem = item.split('.')
    //     if (splittedItem.length > 1) {
    //       debugger
    //       let sItemPath = ''
    //       splittedItem.forEach(sItem => {
    //         sItemPath += sItem + '.'
    //         if (this.$props[sItemPath]) {
    //           if (typeof this.$props[sItemPath] === 'object') {
    //
    //           } else {
    //             path += this.$props[sItemPath] + '.'
    //           }
    //         }
    //       })
    //     } else {
    //       path += `${item}.`
    //     }
    //   })
    //   return row[path]
    // },
    optionSelected(buttonData) {
      this.dataForSelect[buttonData.fieldKey].options = buttonData.options
      this.additionalData = { data: buttonData.data, key: 'type' }
      this.showConfirmAlert = false
    },
    selectAction(actionText, actionIcon, targetItem) {
      if (actionText === this.confirmAlertAction) {
        this.showConfirmAlert = true
      }
      if (actionText === 'Edit') {
        this.$set(targetItem, 'edited', true)
        if (Object.keys(this.confirmAlert).length !== 0) {
          const options = this.confirmAlert.buttons.filter(button => button.title === targetItem.type)[0]
          this.dataForSelect[options.updateTableField].options = options.options
        }
        return
      }
      if (actionText === 'Confirm') {
        if (targetItem.is_new) {
          this.create(targetItem)
          return
        }
        if (targetItem.edited) {
          this.update(targetItem)
          return
        }
      }
      if (actionText === 'Cancel') {
        if (targetItem.is_new) {
          const index = this.tableItems.indexOf(targetItem)
          this.tableItems.splice(index, 1)
          return
        }

        this.$delete(targetItem, 'edited')
        return
      }
      if (actionText === 'Delete') {
        this.delete(targetItem.id)
        return
      }
      if (actionText === 'Insert') {
        this.tableItems.push({ ...this.emptyItem })
      }
    },
    create(data) {
      this.loading = true
      if (this.additionalData) {
        data[this.additionalData.key] = this.additionalData.data
      }
      if (this.itemAssignTo && this.itemAssignKey) {
        data[this.itemAssignKey] = this.itemAssignTo
      }
      axios.post(`${process.env.VUE_APP_API_URL}/${this.createEndpoint}`, data, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.loading = false
        const createdItem = this.tableItems.find(item => item === data)
        this.$delete(createdItem, 'is_new')
        this.tableItems[this.tableItems.indexOf(data)] = { ...response.data.data }
        this.renderAccordionData = true
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
              icon: 'XIcon',
              variant: 'danger',
            },
          })
        })
      })
    },
    update(data) {
      this.loading = true
      axios.put(`${process.env.VUE_APP_API_URL}/${this.updateEndpoint}/${data.id}`, data,
        {
          headers: { Authorization: `Bearer ${useJwt.getToken()}` },
        }).then(response => {
        this.loading = false
        this.$delete(data, 'edited')
        // // this.$emit('updated', { index: this.tableItems.indexOf(data), data: response.data.data })
        const itemToUpdate = this.tableItems.find(item => item.id === data.id)
        this.tableItems[this.tableItems.indexOf(itemToUpdate)] = response.data.data
        this.$emit('rerender-component')
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
        console.log(error)
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
    delete(itemId) {
      this.$swal({
        title: 'Are you sure?',
        text: 'Do you really want delete this?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (!result.value) {
          return
        }
        this.loading = true
        axios.delete(`${process.env.VUE_APP_API_URL}/${this.deleteEndpoint}/${itemId}`, {
          headers: { Authorization: `Bearer ${useJwt.getToken()}` },
        }).then(response => {
          this.loading = false
          const itemIndex = this.tableItems.indexOf(itemId)
          this.tableItems.splice(itemIndex)
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
                icon: 'XIcon',
                variant: 'danger',
              },
            })
          })
        })
      })
    },
    toggleDetails(item) {
      if (!this.accordionData) {
        return
      }
      if (item._showDetails) item._showDetails = false
      else this.$set(item, '_showDetails', true)
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
<style>
.vs__dropdown-menu{
  position: fixed !important;
  top: auto !important;
  left: auto !important;
  width: inherit !important;
  overflow-y: auto !important;
  max-height: 200px !important;
}
.vue-treeselect__menu {
  position: fixed !important;
  top: auto !important;
  left: auto !important;
  max-width: 15% !important;
  overflow-y: auto !important;
  box-shadow: 0 0 0 2px #5e5873 !important;
}
.vue-treeselect__control.fishtank {
  box-shadow: 0 0 0 2px #5e5873 !important;
}
</style>
