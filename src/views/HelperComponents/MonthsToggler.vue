<template>
  <div class="d-flex align-items-center">
    <b-button
      variant="link"
      class="p-0"
      @click="changeMonth('decrease')"
    >
      <feather-icon
        icon="ArrowLeftIcon"
        size="22"
        class="cursor-pointer"
      />
    </b-button>
    <span class="font-weight-bolder font-medium-5">{{ month }}</span>
    <b-button
      variant="link"
      class="p-0"
      @click="changeMonth('increase')"
    >
      <feather-icon
        icon="ArrowRightIcon"
        size="22"
        class="cursor-pointer disabled"
      />
    </b-button>
  </div>
</template>

<script>
import { BButton } from 'bootstrap-vue-next'

export default {
  components: {
    BButton,
  },
  props: {
    from: {
      type: [Date, String],
      required: true,
    },
    to: {
      type: [Date, String],
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    month() {
      return this.$moment(this.from).format('MMMM')
    },
  },
  methods: {
    changeMonth(type) {
      if (type === 'increase') {
        const from = this.$moment(this.from).add(1, 'months').format('YYYY-MM-DD')
        const to = this.$moment(from).endOf('month').format('YYYY-MM-DD')
        this.$emit('month-changed', [from, to])
        return
      }
      const from = this.$moment(this.from).subtract(1, 'months').format('YYYY-MM-DD')
      const to = this.$moment(from).endOf('month').format('YYYY-MM-DD')
      this.$emit('month-changed', [from, to])
    },
  },
}
</script>

<style scoped>

</style>
