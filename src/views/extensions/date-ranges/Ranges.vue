<template>
  <b-card>
    <b-row
      class="d-flex flex-nowrap"
    >
      <VueCtkDateTimePicker
        v-model="dateModel"
        format="YYYY-MM-DD"
        range
        locale="en"
        class="w-50"
        auto-close
        dark
        color="#5acdae"
        :first-day-of-week=1
        :custom-shortcuts="myRanges"
        :shortcut="'mtd'"
        @input="rangeSelected()"
      />
    </b-row>
    <b-row
      v-if="showNeedleTime"
      class="d-flex justify-content-center"
    >
      <b-spinner
        v-if="loading"
        class="mt-2"
      />
      <div
        v-else
        class="font-large-1 pt-1"
      >
        {{ needleTime }}
      </div>
    </b-row>
  </b-card>
</template>

<script>
import { BCard, BRow, BSpinner } from 'bootstrap-vue'

export default {
  components: {
    BCard,
    BRow,
    BSpinner,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    showNeedleTime: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      myRanges: [
        { key: 'thisWeek', label: 'This week', value: 'isoWeek' },
        { key: 'lastWeek', label: 'Last week', value: '-isoWeek' },
        { key: 'thisMonth', label: 'This month', value: 'month' },
        { key: 'lastMonth', label: 'Last month', value: '-month' },
        {
          key: 'ytd',
          label: 'YTD',
          value: () => ({
            start: this.$moment().startOf('year'),
            end: this.$moment(),
          }),
        },
        {
          key: 'mtd',
          label: 'MTD',
          value: () => ({
            start: this.$moment().startOf('month'),
            end: this.$moment(),
          }),
        },
      ],
      dateModel: {},
    }
  },
  methods: {
    rangeSelected() {
      this.$emit('updateDateModel', this.dateModel)
      this.$emit('rangeSelected')
    },
  },
}
</script>

<style scoped>

</style>
