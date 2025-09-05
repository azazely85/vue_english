<template>
  <div
    class="vertical-layout h-100"
    :class="[layoutClasses]"
    :data-col="isNavMenuHidden ? '1-column' : null"
  >
    <!-- Navbar -->
    <b-navbar
      :toggleable="false"
      :variant="navbarBackgroundColor"
      class="header-navbar navbar navbar-shadow align-items-center"
      :class="[navbarTypeClass]"
    >
      <template #default>
        <slot
          name="navbar"
          :toggleVerticalMenuActive="toggleVerticalMenuActive"
          :navbarBackgroundColor="navbarBackgroundColor"
          :navbarTypeClass="[...navbarTypeClass, 'header-navbar navbar navbar-shadow align-items-center']"
        >
          <app-navbar-vertical-layout :toggle-vertical-menu-active="toggleVerticalMenuActive" />
        </slot>
      </template>
    </b-navbar>
    <!--/ Navbar -->

    <!-- Vertical Nav Menu -->
    <vertical-nav-menu
      v-if="!isNavMenuHidden"
      :is-vertical-menu-active="isVerticalMenuActive"
      :toggle-vertical-menu-active="toggleVerticalMenuActive"
    >
      <template #header="slotProps">
        <slot
          name="vertical-menu-header"
          v-bind="slotProps"
        />
      </template>
    </vertical-nav-menu>
    <!-- /Vertical Nav Menu -->

    <!-- Vertical Nav Menu Overlay -->
    <div
      class="sidenav-overlay"
      :class="overlayClasses"
      @click="closeVerticalMenu"
    />
    <!-- /Vertical Nav Menu Overlay -->

    <!-- Content -->
    <transition
      :name="routerTransition"
      mode="out-in"
    >
      <component
        :is="layoutContentRenderer"
        :key="getContentKey"
      >
        <template
          v-for="(_, name) in $slots"
          :key="name"
          #[name]="data"
        >
          <slot
            :name="name"
            v-bind="data"
          />
        </template>
      </component>
    </transition>
    <!--/ Content -->

    <!-- Footer -->
    <footer
      class="footer footer-light"
      :class="[footerTypeClass]"
    >
      <slot name="footer">
        <app-footer />
      </slot>
    </footer>
    <!-- /Footer -->

    <slot name="customizer" />
  </div>
</template>

<script setup>
import { computed, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import AppNavbarVerticalLayout from '@core/layouts/components/app-navbar/AppNavbarVerticalLayout.vue'
import AppFooter from '@core/layouts/components/AppFooter.vue'
import useAppConfig from '@core/app-config/useAppConfig'
import { BNavbar } from 'bootstrap-vue-next'
import LayoutContentRendererDefault from '@core/layouts/components/layout-content-renderer/LayoutContentRendererDefault.vue'
import LayoutContentRendererLeft from '@core/layouts/components/layout-content-renderer/LayoutContentRendererLeft.vue'
import LayoutContentRendererLeftDetached from '@core/layouts/components/layout-content-renderer/LayoutContentRendererLeftDetached.vue'
import VerticalNavMenu from './components/vertical-nav-menu/VerticalNavMenu.vue'
import useVerticalLayout from './useVerticalLayout'

// Composables
const route = useRoute()
const {
  routerTransition,
  navbarBackgroundColor,
  navbarType,
  footerType,
  isNavMenuHidden,
} = useAppConfig()

const {
  isVerticalMenuActive,
  toggleVerticalMenuActive,
  isVerticalMenuCollapsed,
  layoutClasses,
  overlayClasses,
  resizeHandler,
  navbarTypeClass,
  footerTypeClass,
} = useVerticalLayout(navbarType, footerType)

// Computed properties
const layoutContentRenderer = computed(() => {
  const rendererType = route.meta.contentRenderer
  if (rendererType === 'sidebar-left') return 'layout-content-renderer-left'
  if (rendererType === 'sidebar-left-detached') return 'layout-content-renderer-left-detached'
  return 'layout-content-renderer-default'
})

const getContentKey = computed(() => {
  return layoutContentRenderer.value === 'layout-content-renderer-left' 
    ? route.meta.navActiveLink || route.name 
    : null
})

// Methods
const closeVerticalMenu = () => {
  isVerticalMenuActive.value = false
}

// Lifecycle
resizeHandler()
window.addEventListener('resize', resizeHandler)
onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler)
})
</script>

<style lang="scss">
@import "~@core/scss/base/themes/bordered-layout.scss";
</style>
