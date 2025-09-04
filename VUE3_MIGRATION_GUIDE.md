# Vue 3 Migration Guide

This document outlines the changes made to upgrade your Vue.js application from Vue 2 to Vue 3.

## Major Changes Made

### 1. Package.json Updates
- **Vue**: Upgraded from `2.x` to `^3.3.0`
- **Vue Router**: Upgraded from `3.4.9` to `^4.2.0`
- **Vuex**: Upgraded from `3.6.0` to `^4.1.0`
- **Bootstrap Vue**: Changed from `bootstrap-vue` to `bootstrap-vue-3`
- **Vue CLI**: Upgraded all CLI plugins to `~5.0.0`
- **Other dependencies**: Updated to Vue 3 compatible versions

### 2. Main.js Changes
- Replaced `new Vue()` with `createApp()`
- Removed `@vue/composition-api` (now built into Vue 3)
- Updated plugin registration syntax
- Changed from `Vue.use()` to `app.use()`

### 3. Router Updates
- Replaced `VueRouter` with `createRouter` and `createWebHistory`
- Updated `mode: 'history'` to `history: createWebHistory()`
- Changed scroll behavior return format from `{ x: 0, y: 0 }` to `{ top: 0, left: 0 }`

### 4. Vuex Store Updates
- Replaced `new Vuex.Store()` with `createStore()`
- Updated strict mode condition from `process.env.DEV` to `process.env.NODE_ENV !== 'production'`

### 5. App.vue Component Updates
- Converted to Vue 3 Composition API
- Replaced `@vue/composition-api` imports with Vue 3 built-in imports
- Updated router and store access using `useRoute()` and `useStore()`
- Moved theme initialization to `onMounted()` lifecycle hook

### 6. Library Updates
- **Toastification**: Now configured in main.js using `provideToast()`
- **SweetAlert2**: Components should import directly instead of global plugin
- **Portal Vue**: Replaced with Vue 3's built-in `<Teleport>` component

## Breaking Changes to Address

### 1. Component Updates Needed
You'll need to update individual components that use:
- `$listeners` (removed in Vue 3)
- `$scopedSlots` (now `$slots`)
- `$children` (removed in Vue 3)
- Event handling syntax changes

### 2. Bootstrap Vue Components
Many Bootstrap Vue components have changed syntax. You'll need to:
- Update component names (e.g., `b-button` to `BButton`)
- Check prop names and event names
- Update CSS classes

### 3. Third-party Libraries
Some libraries may need updates:
- `vue-good-table` → `vue-good-table-next`
- `vue-clipboard2` → `vue-clipboard3`
- `vue2-leaflet` → `vue3-leaflet`

## Next Steps

1. **Install Dependencies**: Run `npm install` to install all updated packages
2. **Test Components**: Go through each component and fix any Vue 3 compatibility issues
3. **Update Bootstrap Components**: Replace Bootstrap Vue 2 components with Bootstrap Vue 3 equivalents
4. **Test Functionality**: Ensure all features work as expected
5. **Update Tests**: Update any unit tests to work with Vue 3

## Common Issues and Solutions

### Issue: "Cannot read property of undefined"
**Solution**: Check if you're accessing Vue 2 specific properties that don't exist in Vue 3

### Issue: Bootstrap components not rendering
**Solution**: Update component imports and syntax to Bootstrap Vue 3

### Issue: Router navigation not working
**Solution**: Ensure you're using `useRouter()` in Composition API or `this.$router` in Options API

### Issue: Store access issues
**Solution**: Use `useStore()` in Composition API or ensure proper store setup

## Resources

- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [Vue Router 4 Migration Guide](https://router.vuejs.org/guide/migration/)
- [Vuex 4 Migration Guide](https://vuex.vuejs.org/guide/migrating-to-4-0-from-3-x.html)
- [Bootstrap Vue 3 Documentation](https://bootstrap-vue-3.netlify.app/)

## Testing Checklist

- [ ] Application starts without errors
- [ ] Router navigation works
- [ ] Store state management works
- [ ] Components render correctly
- [ ] Bootstrap components function properly
- [ ] Forms and validation work
- [ ] Authentication flow works
- [ ] All pages load correctly
- [ ] Responsive design maintained
- [ ] No console errors

Remember to test thoroughly and update any custom components that may have Vue 2 specific code.
