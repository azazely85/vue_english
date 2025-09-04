<template>
  <p class="clearfix mb-0">
    <span class="float-md-left d-block d-md-inline-block mt-25">
      <b-link
        class="ml-25"
        href="https://vidshup.pp.ua/"
        target="_blank"
      >VidsHup</b-link>
      {{ new Date().getFullYear() }}
      <span class="d-none d-sm-inline-block">, English</span>
    </span>
  </p>
</template>

<script>
import { BLink } from 'bootstrap-vue-next'

export default {
  components: {
    BLink,
  },
}
</script>
#5acdae