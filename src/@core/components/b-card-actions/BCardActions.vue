<template>
  <b-overlay
    v-if="!cardClosed"
    variant="white"
    :show="showLoading"
    spinner-variant="primary"
    blur="0"
    opacity=".75"
    rounded="sm"
  >
    <b-card
      ref="bCard"
      v-bind="cardAttrs"
      no-body
      :aria-expanded="!content_visible ? 'true' : 'false'"
      :aria-controls="parentID"
      :style="cardStyles"
    >
      <b-row
        class="d-flex justify-content-end"
        style="padding-right: 1.5rem; padding-top: 0.5rem"
      >
        <status-indicator
          v-if="isProjectsReports && projectDiscrepancyAlert"
          v-b-tooltip.hover.v-danger
          title="Project has discrepancy with ClickUp"
          :status="projectDiscrepancyAlert ? `negative` : ``"
        />
      </b-row>
      <div
        v-if="showHeader"
        class="card-header d-flex justify-content-center"
      >
        <!-- Title & SubTitle -->
        <div
          class="d-flex flex-grow-1 p-1 justify-content-center"
        >
          <b-link
            v-if="$attrs['title-link']"
            :to="$attrs['title-link']"
          >
            <b-card-title v-html="$attrs.title" />
          </b-link>
          <b-card-sub-title v-if="$attrs['sub-title']">
            {{ $attrs['sub-title'] }}
          </b-card-sub-title>
        </div>

        <!-- Card Actions -->
        <b-card-actions-container
          v-if="showActions"
          :available-actions="availableActions"
          :is-collapsed="!content_visible"
          @collapse="triggerCollapse"
          @refresh="triggerRefresh"
          @close="triggerClose"
        />
      </div>

      <!-- Collapsible Content -->
      <b-collapse
        :id="parentID"
        v-model="content_visible"
        :visible="content_visible"
        class="card-content"
      >
        <!-- Handle no-body -->
        <slot v-if="$attrs['no-body'] !== undefined" />
        <b-card-body v-else>
          <slot />
        </b-card-body>
      </b-collapse>
    </b-card>
  </b-overlay>
</template>

<script>
import {
  BCard, BCardTitle, BCardSubTitle, BCardBody, BCollapse, BOverlay, BLink, BRow, VBTooltip,
} from 'bootstrap-vue-next'
import { StatusIndicator } from 'vue-status-indicator'
import BCardActionsContainer from './BCardActionsContainer.vue'

export default {
  components: {
    BCardActionsContainer,
    BCard,
    BCardTitle,
    BCardSubTitle,
    BCardBody,
    BCollapse,
    BOverlay,
    BLink,
    BRow,
    VBTooltip,
    StatusIndicator,
  },
  inheritAttrs: false,
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
    noActions: {
      type: Boolean,
      default: false,
    },
    actionCollapse: {
      type: Boolean,
      default: false,
    },
    actionRefresh: {
      type: Boolean,
      default: false,
    },
    actionClose: {
      type: Boolean,
      default: false,
    },
    isProjectsReports: {
      type: Boolean,
      default: false,
    },
    projectDiscrepancyAlert: {
      type: Boolean,
      default: false,
    },
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      parentID: '',
      content_visible: !this.collapsed,
      showLoading: false,
      cardClosed: false,
      cardStyles: {},
    }
  },
  computed: {
    cardAttrs() {
      const cardAttrs = JSON.parse(JSON.stringify(this.$attrs))
      delete cardAttrs.title
      delete cardAttrs['sub-title']
      return cardAttrs
    },
    showHeader() {
      return this.$attrs.title || this.$attrs['sub-title'] || !this.noActions
    },
    showActions() {
      if (this.noActions) return false
      return true
    },
    availableActions() {
      const actions = []
      const allFalse = (this.actionCollapse || this.actionRefresh || this.actionClose) === false

      if (this.actionCollapse || allFalse) actions.push('collapse')
      if (this.actionRefresh || allFalse) actions.push('refresh')
      if (this.actionClose || allFalse) actions.push('close')
      return actions
    },
  },
  created() {
    this.parentID = String(Math.floor(Math.random() * 10) + 1)
  },
  methods: {
    removeCard() {
      this.$set(this.cardStyles, 'maxHeight', `${this.$refs.bCard.clientHeight}px`)
      setTimeout(() => {
        this.$set(this.cardStyles, 'maxHeight', '0px')
        this.$set(this.cardStyles, 'overflow', 'hidden')
        // this.$set(this.cardStyles, 'marginBottom', '0')
      }, 10)
    },
    triggerCollapse() {
      this.content_visible = !this.content_visible
      this.$emit('collapse')
    },
    triggerRefresh() {
      this.showLoading = true
      this.$emit('refresh')
    },
    triggerClose() {
      this.removeCard()
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
@import '~@core/scss/base/components/variables-dark';
@import 'vue-status-indicator';

.card {
  ::v-deep .card-header {
    .heading-elements {
      position: static;
      cursor: inherit;

      .list-inline {
        display: block;

        li {
          a {
            padding: 0;
          }

          &:not(:last-child) {
            margin-right: 1rem;
          }
        }
      }
    }
  }
}

.dark-layout {
  .b-overlay-wrap ::v-deep .b-overlay {
    // border: 10px solid red;
    .bg-white {
      background-color: $theme-dark-body-bg !important;
    }
  }
}
</style>
