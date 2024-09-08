<template>
  <div class="base-sidebar">
    <!-- CLIENT BUSINESS AREA -->
    <BaseClientArea />

    <!-- SIDEBAR ITEMS AREA -->
    <div class="sidebar-items-area">
      <div class="sidebar-item-group" v-if="sidebarRouteList.home.length">
        <template v-for="route in sidebarRouteList.home">
          <router-link
            :to="route.link"
            v-if="route.active"
            activeClass="bg-teal-900/15"
            exactActiveClass="bg-teal-900/15"
            class="sidebar-item"
            :class="
              appRoute.path.startsWith('/compliance') &&
              route.link.includes('compliance')
                ? 'bg-teal-900/15'
                : ''
            "
          >
            <div class="icon" :class="route.icon"></div>
            <div class="sidebar-text">{{ route.title }}</div>
          </router-link>
        </template>
      </div>

      <div class="sidebar-item-group" v-if="sidebarRouteList.payments.length">
        <div class="sidebar-item-group-title">PAYMENTS</div>

        <router-link
          :to="route.link"
          activeClass="bg-teal-900/15"
          exactActiveClass="bg-teal-900/15"
          class="sidebar-item"
          v-for="(route, index) in sidebarRouteList.payments"
          :key="index"
        >
          <div class="icon" :class="route.icon"></div>
          <div class="sidebar-text">{{ route.title }}</div>
        </router-link>
      </div>

      <div class="sidebar-item-group" v-if="sidebarRouteList.transfers.length">
        <div class="sidebar-item-group-title">TRANSFERS</div>

        <router-link
          :to="route.link"
          activeClass="bg-teal-900/15"
          exactActiveClass="bg-teal-900/15"
          class="sidebar-item"
          v-for="(route, index) in sidebarRouteList.transfers"
          :key="index"
        >
          <div class="icon" :class="route.icon"></div>
          <div class="sidebar-text">{{ route.title }}</div>
        </router-link>
      </div>

      <div class="sidebar-item-group" v-if="sidebarRouteList.commerce.length">
        <div class="sidebar-item-group-title">COMMERCE</div>

        <router-link
          :to="route.link"
          activeClass="bg-teal-900/15"
          exactActiveClass="bg-teal-900/15"
          class="sidebar-item"
          v-for="(route, index) in sidebarRouteList.commerce"
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
      v-if="sidebarRouteList.settings.length"
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
        v-for="(route, index) in sidebarRouteList.settings"
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
import { reactive, toRaw, watch } from "vue";
import { useRoute } from "vue-router";
import { sidebarRoutes } from "@/shared/constants/sidebar-routes";
import { useProfile } from "@/shared/composables/useProfile";
import { ISidebarRouteType } from "@/models/route-type";
import BaseClientArea from "@/shared/components/global-comps/base-client-area.vue";

const appRoute = useRoute();
const { getBusinessActivatedStatus } = useProfile();

const sidebarRouteList = reactive<ISidebarRouteType>(sidebarRoutes);

watch(
  () => appRoute,
  () => {
    const complianceRoute = sidebarRouteList.home.find(
      (route) => route.slug === "compliance"
    ) || {
      slug: "compliance",
      link: "/compliance/documents",
      title: "Compliance",
      icon: "icon-shield-tick",
      active: true,
    };

    if (getBusinessActivatedStatus() === "true") complianceRoute.active = false;
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.base-sidebar {
  @apply relative bg-teal-800 border border-teal-800 h-full;
  z-index: 6999;

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
