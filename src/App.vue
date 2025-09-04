<template>
  <div
    id="app"
    class="h-100"
    :class="[skinClasses]"
  >
    <component :is="layout">
      <router-view />
    </component>

  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useRoute, useStore } from 'vue-router'
import { useStore as useVuexStore } from 'vuex'

// This will be populated in `beforeCreate` hook
import { $themeColors, $themeBreakpoints, $themeConfig } from '@themeConfig'
import { provideToast } from 'vue-toastification'
import { watch } from 'vue'
import useAppConfig from '@core/app-config/useAppConfig'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import { useWindowSize, useCssVar } from '@vueuse/core'

import store from '@/store'

const LayoutVertical = () => import('@/layouts/vertical/LayoutVertical.vue')
const LayoutHorizontal = () => import('@/layouts/horizontal/LayoutHorizontal.vue')
const LayoutFull = () => import('@/layouts/full/LayoutFull.vue')

export default {
  components: {
    // Layouts
    LayoutHorizontal,
    LayoutVertical,
    LayoutFull,
  },
  setup() {
    const route = useRoute()
    const vuexStore = useVuexStore()
    const { skin, skinClasses } = useAppConfig()

    // Computed properties
    const layout = computed(() => {
      if (route.meta.layout === 'full') return 'layout-full'
      return `layout-${contentLayoutType.value}`
    })

    const contentLayoutType = computed(() => {
      return vuexStore.state.appConfig.layout.type
    })

    // Initialize theme colors and breakpoints
    const initializeTheme = () => {
      // Set colors in theme
      const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark']

      // eslint-disable-next-line no-plusplus
      for (let i = 0, len = colors.length; i < len; i++) {
        $themeColors[colors[i]] = useCssVar(`--${colors[i]}`, document.documentElement).value.trim()
      }

      // Set Theme Breakpoints
      const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl']

      // eslint-disable-next-line no-plusplus
      for (let i = 0, len = breakpoints.length; i < len; i++) {
        $themeBreakpoints[breakpoints[i]] = Number(useCssVar(`--breakpoint-${breakpoints[i]}`, document.documentElement).value.slice(0, -2))
      }

      // Set RTL
      const { isRTL } = $themeConfig.layout
      document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
    }

    onMounted(() => {
      initializeTheme()

      // If skin is dark when initialized => Add class to body
      if (skin.value === 'dark') document.body.classList.add('dark-layout')

      // Provide toast for Composition API usage
      provideToast({
        hideProgressBar: true,
        closeOnClick: false,
        closeButton: false,
        icon: false,
        timeout: 3000,
        transition: 'Vue-Toastification__fade',
      })

      // Set Window Width in store
      store.commit('app/UPDATE_WINDOW_WIDTH', window.innerWidth)
      const { width: windowWidth } = useWindowSize()
      watch(windowWidth, val => {
        store.commit('app/UPDATE_WINDOW_WIDTH', val)
      })
    })

    return {
      layout,
      contentLayoutType,
      skinClasses,
    }
  },
}
</script>
