<template>
  <b-sidebar
    id="edit-transaction-sidebar"
    :visible="isEdit"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @change="(val) => $emit('open-close-bulk-edit-sidebar', val)"
  >

  </b-sidebar>
</template>

<script>
import {
  BSidebar, BForm, BFormGroup, BFormInput, BFormInvalidFeedback, BButton, BFormSelect, BFormRadio,
  BFormDatepicker, BTooltip, BFormCheckbox, BSpinner,
} from 'bootstrap-vue-next'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'

export default {
  components: {
    BSidebar,
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BButton,
    vSelect,
    BFormSelect,
    BFormRadio,
    BFormDatepicker,
    BTooltip,
    BFormCheckbox,
    BSpinner,

    flatPickr,

    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
  },
  model: {
    props: 'isEdit',
    events: 'update:is-edit',
  },
  props: {  
    isEdit: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
    }
  },
  computed: {
  },
  watch: {
  },
  beforeMount() {
  },
  methods: {
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/libs/vue-flatpicker.scss';
#add-new-user-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
</style>
