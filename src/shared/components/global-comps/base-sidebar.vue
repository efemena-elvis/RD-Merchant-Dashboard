<template>
  <div class="base-sidebar">
    <!-- CLIENT BUSINESS AREA -->
    <BaseClientArea />

    <!-- SIDEBAR ITEMS AREA -->
    <div class="sidebar-items-area">
      <div class="sidebar-item-group" v-if="sidebarRoutes.home.length">
        <router-link
          :to="route.link"
          activeClass="bg-teal-900/15"
          exactActiveClass="bg-teal-900/15"
          class="sidebar-item"
          :class="
            appRoute.path.startsWith('/compliance') &&
            route.link.includes('compliance')
              ? 'bg-teal-900/15'
              : ''
          "
          v-for="(route, index) in sidebarRoutes.home"
          :key="index"
        >
          <div class="icon" :class="route.icon"></div>
          <div class="sidebar-text">{{ route.title }}</div>
        </router-link>
      </div>

      <div class="sidebar-item-group" v-if="sidebarRoutes.payments.length">
        <div class="sidebar-item-group-title">PAYMENTS</div>

        <router-link
          :to="route.link"
          activeClass="bg-teal-900/15"
          exactActiveClass="bg-teal-900/15"
          class="sidebar-item"
          v-for="(route, index) in sidebarRoutes.payments"
          :key="index"
        >
          <div class="icon" :class="route.icon"></div>
          <div class="sidebar-text">{{ route.title }}</div>
        </router-link>
      </div>

      <div class="sidebar-item-group" v-if="sidebarRoutes.transfers.length">
        <div class="sidebar-item-group-title">TRANSFERS</div>

        <router-link
          :to="route.link"
          activeClass="bg-teal-900/15"
          exactActiveClass="bg-teal-900/15"
          class="sidebar-item"
          v-for="(route, index) in sidebarRoutes.transfers"
          :key="index"
        >
          <div class="icon" :class="route.icon"></div>
          <div class="sidebar-text">{{ route.title }}</div>
        </router-link>
      </div>

      <div class="sidebar-item-group" v-if="sidebarRoutes.commerce.length">
        <div class="sidebar-item-group-title">COMMERCE</div>

        <router-link
          :to="route.link"
          activeClass="bg-teal-900/15"
          exactActiveClass="bg-teal-900/15"
          class="sidebar-item"
          v-for="(route, index) in sidebarRoutes.commerce"
          :key="index"
        >
          <div class="icon" :class="route.icon"></div>
          <div class="sidebar-text">{{ route.title }}</div>
        </router-link>
      </div>
    </div>

    <!-- SIDEBAR BASE -->
    <div
      class="sidebar-bottom-area text-white text-xs"
      v-if="sidebarRoutes.settings.length"
    >
      <router-link
        :to="route.link"
        activeClass="bg-teal-900/15"
        exactActiveClass="bg-teal-900/15"
        class="sidebar-item"
        :class="
          appRoute.path.startsWith('/settings') &&
          route.link.includes('settings')
            ? 'bg-teal-900/15'
            : ''
        "
        v-for="(route, index) in sidebarRoutes.settings"
        :key="index"
      >
        <div class="icon" :class="route.icon"></div>
        <div class="sidebar-text">
          {{ route.title }}
        </div>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { sidebarRoutes } from "@/shared/constants/sidebar-routes";
import BaseClientArea from "@/shared/components/global-comps/base-client-area.vue";

const appRoute = useRoute();
</script>

<style lang="scss" scoped>
.base-sidebar {
  @apply relative bg-teal-800 border border-teal-800 h-full;
  z-index: 5999;

  .sidebar-items-area {
    @apply absolute top-0 pt-[108px] pb-28 w-full h-screen overflow-auto;

    &::-webkit-scrollbar {
      display: none;
    }

    .sidebar-item-group {
      @apply relative mb-[24px];

      &-title {
        @apply px-4 text-[11.75px] mb-[6px] uppercase text-gray-100/60;
      }
    }
  }

  .sidebar-bottom-area {
    @apply absolute w-full bottom-0 bg-teal-800 py-4 border-t border-t-grey-400/25;
  }

  .sidebar-item {
    @apply w-full px-4 py-3 text-neutral-10 flex justify-start items-center gap-x-[12px] transition duration-300 ease-in-out hover:bg-teal-900/15;

    .icon {
      @apply text-[17px];
    }

    .sidebar-text {
      @apply text-[14.25px];
    }
  }
}
</style>
