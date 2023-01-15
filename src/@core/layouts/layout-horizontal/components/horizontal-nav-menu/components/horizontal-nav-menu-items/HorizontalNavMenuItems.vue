<template>
  <ul
    id="main-menu-navigation"
    class="nav navbar-nav"
  >
    <component
      :is="resolveNavComponent(item)"
      v-for="item in items"
      v-if="item.role ? item.role.includes(userData.role) : true"
      :key="item.header || item.title"
      :item="item"
    />
  </ul>
</template>

<script>
import { decryptUserData } from '@/_helpers/encryption'
import useJwt from '@/auth/jwt/useJwt'
import HorizontalNavMenuHeaderLink from '../horizontal-nav-menu-header-link/HorizontalNavMenuHeaderLink.vue'
import HorizontalNavMenuHeaderGroup from '../horizontal-nav-menu-header-group/HorizontalNavMenuHeaderGroup.vue'

export default {
  components: {
    HorizontalNavMenuHeaderLink,
    HorizontalNavMenuHeaderGroup,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      userData: {},
    }
  },
  beforeMount() {
    this.userData = decryptUserData(useJwt.getUserData())
  },
  setup() {
    const resolveNavComponent = item => {
      if (item.children) return 'horizontal-nav-menu-header-group'
      return 'horizontal-nav-menu-header-link'
    }

    return {
      resolveNavComponent,
    }
  },
}
</script>
