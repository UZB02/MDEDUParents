<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from './layouts/AppLayout.vue'

const route = useRoute()
const layout = computed(() => route.meta.layout || AppLayout)
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>

<style scoped>
</style>
