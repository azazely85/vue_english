<template>
  <b-card
    no-body
    :class="{'open': visible}"
    @mouseenter="collapseOpen"
    @mouseleave="collapseClose"
  >
    <b-card-header
      style="background-color: #5acdae"
      :class="{'collapsed': !visible}"
      :aria-expanded="visible ? 'true' : 'false'"
      :aria-controls="collapseItemID"
      role="tab"
      data-toggle="collapse"
      @click="updateVisible(!visible)"
    >
      <slot name="header">
        <b-badge
          variant="primary"
          class="font-large-1 d-block"
        >
          {{ title }}
        </b-badge>
<!--        <span class="lead collapse-title badge-light-primary">{{ title }}</span>-->
      </slot>
    </b-card-header>

    <b-collapse
      :id="collapseItemID"
      v-model="visible"
      :accordion="accordion"
      role="tabpanel"
    >
      <b-card-body>
        <slot />
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
import {
  BCard, BCardHeader, BCardBody, BCollapse, BBadge,
} from 'bootstrap-vue'
import { v4 as uuidv4 } from 'uuid'

export default {
  components: {
    BCard,
    BCardHeader,
    BCardBody,
    BCollapse,
    BBadge,
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
      collapseItemID: '',
      openOnHover: this.$parent.hover,
    }
  },
  computed: {
    accordion() {
      return this.$parent.accordion ? `accordion-${this.$parent.collapseID}` : null
    },
  },
  created() {
    this.collapseItemID = uuidv4()
    this.visible = this.isVisible
  },
  methods: {
    updateVisible(val = true) {
      this.visible = val
      this.$emit('visible', val)
    },
    collapseOpen() {
      if (this.openOnHover) this.updateVisible(true)
    },
    collapseClose() {
      if (this.openOnHover) this.updateVisible(false)
    },
  },
}
</script>
