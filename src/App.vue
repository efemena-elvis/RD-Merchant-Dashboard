<template>
  <MetaData />

  <div id="app">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import MetaData from "@/shared/components/seo-comps/meta-data.vue";
</script>

<style lang="scss">
html,
body {
  scroll-behavior: smooth;
}

.fade-enter {
  opacity: 0;
}

.fade-enter-active {
  transition: opacity 0.225s ease;
}

.fade-leave-active {
  transition: opacity 0.225s ease;
  opacity: 0;
}
</style>
