<template>
  <div>
    <component
      :is="presentComponent"
      v-model="item[tableKey]"
      v-bind="presentComponentProps"
    >
      {{ badge }}
      <label
        slot="option-label"
        slot-scope="{ node }"
      >
        <feather-icon
          :icon="node.isBranch ? `GlobeIcon` : `FolderIcon`"
        />
        {{ node.label }}
      </label>
    </component>
  </div>
</template>

<script>
import {
  BFormInput, BFormCheckbox, BLink, BBadge,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import FishtankTreeSelect from '@fishtank/vue-treeselect'
import '@fishtank/vue-treeselect/dist/vue-treeselect.css'
import { isObject } from '@core/utils/utils'

export default {
  components: {
    BFormInput,
    BFormCheckbox,
    BLink,
    BBadge,
    vSelect,
    FishtankTreeSelect,
  },
  props: {
    dataAs: {
      type: [Array, Object],
      required: true,
    },
    selectOptions: {
      type: [Array, Object],
      required: false,
      default() {
        return {}
      },
    },
    notEditable: {
      type: [Array, Object],
      required: false,
      default() {
        return {}
      },
    },
    tableKey: {
      type: String,
      required: true,
    },
    item: {
      type: [String, Object, Array, Number],
      required: true,
    },
    link: {
      type: String,
      required: false,
      default() {
        return ''
      },
    },
    showAnotherLabelData: {
      type: Object,
      required: false,
      default() {
        return {}
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
      presentComponentProps: '',
      badge: '',
      normalizer(node) {
        return {
          label: node.title,
        }
      },
    }
  },
  computed: {
    presentComponent() {
      this.presentComponentProps = { variant: 'primary', replace: true }
      if (this.isEditOrNew && this.isNotInOtherChangeWay) {
        if (this.requiredFields.includes(this.tableKey)) {
          this.presentComponentProps = { state: this.item[this.tableKey].length > 0 }
        }
        return 'b-form-input'
      }
      if (this.dataAs.dataAsCheckBox && this.dataAs.dataAsCheckBox.includes(this.tableKey) && this.isEditOrNew) {
        this.presentComponentProps = { value: 1, uncheckedValue: 0, switch: true }
        return 'b-form-checkbox'
      }
      if (this.dataAs.dataAsLink && this.dataAs.dataAsLink.includes(this.tableKey)) {
        this.presentComponentProps.to = `${this.link}/${this.item.id}`
        this.badge = this.item[this.tableKey]
        return 'b-badge'
      }
      if (this.dataAs.dataAsTreeSelect && this.dataAs.dataAsTreeSelect.includes(this.tableKey)) {
        if (this.isEditOrNew) {
          this.presentComponentProps = {
            multiple: false,
            normalizer: this.normalizer,
            options: this.selectOptions[this.tableKey].options,
            maxHeight: 200,
            clearable: false,
            alwaysOpen: false,
          }
          return 'FishtankTreeSelect'
        }
        if (isObject(this.item[this.tableKey])) {
          this.badge = this.item[this.tableKey][this.selectOptions[this.tableKey].label]
          return 'span'
        }
        if (this.showAnotherLabelData && this.showAnotherLabelData.hasOwnProperty(this.tableKey)) {
          if (this.showAnotherLabelData[this.tableKey].split('.').length > 1) {
            this.badge = !this.item[this.showAnotherLabelData[this.tableKey].split('.')[0]] ? ''
              : this.item[this.showAnotherLabelData[this.tableKey]
                .split('.')[0]][this.showAnotherLabelData[this.tableKey].split('.')[1]]
            return 'span'
          }
          this.badge = this.item[this.showAnotherLabelData[this.tableKey]]
          return 'span'
        }
        this.badge = this.item[this.tableKey]
        return 'span'
      }
      if (this.dataAs.dataAsSelect && this.dataAs.dataAsSelect.includes(this.tableKey)) {
        if (this.isEditOrNew) {
          this.presentComponentProps = {
            label: this.selectOptions[this.tableKey].label,
            reduce: this.selectOptions[this.tableKey].reduce,
            options: this.selectOptions[this.tableKey].options,
          }
          return 'v-select'
        }
        if (isObject(this.item[this.tableKey])) {
          this.badge = this.item[this.tableKey][this.selectOptions[this.tableKey].label]
          return 'span'
        }
        if (this.showAnotherLabelData && this.showAnotherLabelData.hasOwnProperty(this.tableKey)) {
          if (this.showAnotherLabelData[this.tableKey].split('.').length > 1) {
            this.badge = !this.item[this.showAnotherLabelData[this.tableKey].split('.')[0]] ? ''
              : this.item[this.showAnotherLabelData[this.tableKey]
                .split('.')[0]][this.showAnotherLabelData[this.tableKey].split('.')[1]]
            return 'span'
          }
          this.badge = this.item[this.showAnotherLabelData[this.tableKey]]
          return 'span'
        }
        this.badge = this.item[this.tableKey]
        return 'span'
      }
      this.badge = this.item[this.tableKey]
      if (this.dataAs.dataAsCheckBox.includes(this.tableKey) && !this.isEditOrNew) {
        this.badge = this.item[this.tableKey] ? 'Active' : 'InActive'
      }
      return 'span'
    },
    isEditOrNew() {
      if (this.item.edited || this.item.is_new) {
        return true
      }
      return false
    },
    isNotInOtherChangeWay() {
      return this.notEditable && !this.notEditable.includes(this.tableKey)
          && this.dataAs.dataAsCheckBox && !this.dataAs.dataAsCheckBox.includes(this.tableKey)
          && this.dataAs.dataAsSelect && !this.dataAs.dataAsSelect.includes(this.tableKey)
          && this.dataAs.dataAsTreeSelect && !this.dataAs.dataAsTreeSelect.includes(this.tableKey)
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>

<style scoped>

</style>
