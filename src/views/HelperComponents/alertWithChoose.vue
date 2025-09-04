<template>
  <b-modal
    id="alert-modal"
    :visible="show"
    :title="options.title ? options.title : ``"
    :hide-footer="true"
    :hide-header-close="!options.closeable"
    :no-close-on-esc="!options.closeable"
    :no-close-on-backdrop="!options.closeable"
    @change="(val) => this.$emit('update:show', val)"
  >
    <b-row class="d-flex justify-content-center align-content-center">
      <b-button
        v-for="button in options.buttons"
        v-if="options.buttons"
        :key="button.title"
        variant="primary"
        class="m-1"
        @click="onButtonClick(button)"
      >
        {{ button.title }}
      </b-button>
    </b-row>
  </b-modal>
</template>

<script>
import {
  BCard, BCardBody, BRow, BButton, BModal,
} from 'bootstrap-vue-next'

export default {
  components: {
    BRow,
    BButton,
    BModal,
  },
  model: {
    prop: 'show',
    event: 'update:show',
  },
  props: {
    options: {
      type: Object,
      required: true,
    },
    show: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    onButtonClick(buttonData) {
      this.$emit('button-clicked', {
        fieldKey: buttonData?.updateTableField,
        options: buttonData?.options,
        data: buttonData?.data,
      })
    },
  },
}
</script>

<style scoped>

</style>
