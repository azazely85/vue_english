<template>
  <b-list-group class="w-100">
    <b-badge
      variant="primary"
      class="font-medium-1 mt-2 d-block"
    >
      {{ technologyTitle }}
    </b-badge>
    <b-list-group-item
      v-for="(question) in questions.filter(question_ => question_.technology.title === technologyTitle)"
      :key="question.id"
      class="d-flex justify-content-between align-items-center"
    >
      <span>{{ question.question }}</span>
      <b-form-rating
        v-model="question.rate"
        no-border
        show-value
        stars="7"
        inline
        variant="warning"
      />
    </b-list-group-item>
  </b-list-group>
</template>

<script>
import {
  BListGroup, BListGroupItem, BFormRating, BBadge,
} from 'bootstrap-vue-next'

export default {
  components: {
    BListGroup,
    BListGroupItem,
    BFormRating,
    BBadge,
  },
  props: {
    technologyTitle: {
      type: String,
      required: true,
    },
    questions: {
      type: [Array, Object],
      required: true,
    },
  },
}
</script>

<style scoped>

</style>
