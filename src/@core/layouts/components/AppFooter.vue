<template>
  <p class="clearfix mb-0">
    <span class="float-md-left d-block d-md-inline-block mt-25">
      <b-link
        class="ml-25"
        href="https://devurai.com/"
        target="_blank"
      >DEVURAI</b-link>
      {{ new Date().getFullYear() }}
      <span class="d-none d-sm-inline-block">, DCMS</span>
    </span>
  </p>
</template>

<script>
import { BLink } from 'bootstrap-vue'

export default {
  components: {
    BLink,
  },
}
</script>
