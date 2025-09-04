<template>
  <b-card no-body>
    <b-card-header
      class="d-flex justify-content-between align-items-center pt-75 pb-25"
    >
      <h5 class="mb-0">
        Contracts
      </h5>
    </b-card-header>

    <b-card-body>
      <label
        v-if="comradeData.contracts && comradeData.contracts.length === 0"
      >
        No Contracts yet
      </label>
      <b-container
        v-else
        class="p-0"
      >
        <b-col
          cols="12"
          md="7"
          class="p-0"
        >
          <b-row>
            <b-col
              v-for="contract in comradeData.contracts"
              :key="contract.id"
              cols="12"
              class="flex-column"
            >
              <div
                class="d-flex justify-content-between mb-1"
              >
                <span
                  class="d-flex flex-row flex-nowrap align-items-center font-weight-bold text-capitalize"
                >
                  <feather-icon
                    icon="GitlabIcon"
                    class="mr-50"
                  />
                  Project:
                </span>
                <span style="max-width: 50%; text-align: right">{{ contract.project.name }}</span>
              </div>
              <div
                class="d-flex justify-content-between mb-1"
              >
                <span
                  class="d-flex flex-row flex-nowrap align-items-center font-weight-bold text-capitalize"
                >
                  <feather-icon
                    icon="ClipboardIcon"
                    class="mr-50"
                  />
                  Contract Name
                </span>
                <span style="max-width: 50%; text-align: right">{{ contract.title }}</span>
              </div>
              <div
                class="d-flex justify-content-between mb-1"
              >
                <span
                  class="d-flex flex-row flex-nowrap align-items-center font-weight-bold text-capitalize"
                >
                  <feather-icon
                    icon="PowerIcon"
                    class="mr-50"
                  />
                  Project Status
                </span>
                <b-badge
                  v-if="contract.project.status"
                  variant="success"
                  style="max-width: 50%;"
                >
                  Active
                </b-badge>
                <b-badge
                  v-else
                  variant="danger"
                  style="max-width: 50%;"
                >
                  InActive
                </b-badge>
              </div>
              <div
                class="d-flex justify-content-between mb-1"
              >
                <span
                  class="d-flex flex-row flex-nowrap align-items-center font-weight-bold text-capitalize"
                >
                  <feather-icon
                    icon="ClockIcon"
                    class="mr-50"
                  />
                  Tracked MTD
                </span>
                <span style="max-width: 50%;">{{ contract.tracked_mtd }}</span>
              </div>
              <hr>
            </b-col>
          </b-row>
        </b-col>
      </b-container>
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BRow, BCol, BCard, BCardHeader, BContainer, BBadge, BCardBody,
} from 'bootstrap-vue-next'

export default {
  components: {
    BCol,
    BRow,
    BCard,
    BCardHeader,
    BContainer,
    BBadge,
    BCardBody,
  },
  props: {
    comradeData: {
      type: [Object, Array],
      required: true,
    },
  },
}
</script>

<style scoped>

</style>
