<template>
  <div class="navbar-container d-flex content justify-content-between">
    <horizontal-nav-menu-items :items="navMenuItems" />
    <!-- Left Col -->
    <b-navbar-nav class="nav align-items-center ml-auto">
      <div class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex">
        <dark-toggler class="d-none d-lg-block" />
      </div>
      <b-nav-item-dropdown
        right
        toggle-class="d-flex align-items-center dropdown-user-link"
        class="nav dropdown-user"
      >
        <template #button-content>
          <div class="d-sm-flex d-none user-nav">
            <p class="user-name font-weight-bolder mb-0">
              {{ userData.firstname }} {{ userData.lastname }}
            </p>
            <span class="user-status">{{ userRoleByRoleId(userData.role) }}</span>
          </div>
          <b-avatar
            size="40"
            variant="light-primary"
            badge
            :src="require('@/assets/images/avatars/13-small.png')"
            class="badge-minimal"
            badge-variant="success"
          />
        </template>

        <b-dropdown-item link-class="d-flex align-items-center"
                         :to="{ name: 'Profile'}">
          <feather-icon
            size="16"
            icon="UserIcon"
            class="mr-50"
          />
          <span>Change Password</span>
        </b-dropdown-item>
        <b-dropdown-item
          link-class="d-flex align-items-center"
          @click="logout"
        >
          <feather-icon
            size="16"
            icon="LogOutIcon"
            class="mr-50"
          />
          <span>Logout</span>
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </div>
</template>

<script>
import {
  BNavbarNav, BNavItemDropdown, BDropdownItem, BDropdownDivider, BAvatar,
} from 'bootstrap-vue-next'
import DarkToggler from '@core/layouts/components/app-navbar/components/DarkToggler.vue'
import navMenuItems from '@/navigation/horizontal'
import HorizontalNavMenuItems from './components/horizontal-nav-menu-items/HorizontalNavMenuItems.vue'
import { decryptUserData } from '@/_helpers/encryption.js'
import useJwt from '@/auth/jwt/useJwt.js'
import { Role } from '@/_helpers/role'

export default {
  components: {
    HorizontalNavMenuItems,
    BNavbarNav,
    BNavItemDropdown,
    BDropdownItem,
    BDropdownDivider,
    DarkToggler,
    BAvatar,
  },
  setup() {
    return {
      navMenuItems,
    }
  },
  data() {
    return {
      userData: decryptUserData(useJwt.getUserData()),
    }
  },
  methods: {
    logout() {
      useJwt.logout().then(() => {
        // Remove userData from localStorage
        // ? You just removed token from localStorage. If you like, you can also make API call to backend to blacklist used token
        localStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName)
        localStorage.removeItem(useJwt.jwtConfig.storageRefreshTokenKeyName)

        // Remove userData from localStorage
        localStorage.removeItem('userData')

        // Redirect to login page
        this.$router.push({ name: 'auth-login' })
      })
    },
    userRoleByRoleId(roleId) {
      return Object.keys(Role).find(key => Role[key] === roleId)
    },
  },
}
</script>

<style lang="scss">
@import "~@core/scss/base/core/menu/menu-types/horizontal-menu.scss";
</style>
