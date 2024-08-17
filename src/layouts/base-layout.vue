<template>
  <div>
    <div class="base-layout">
      <!-- SIDEBAR AREA -->
      <div
        class="sidebar-area"
        :class="showMobileSidebar && 'visible-sidebar-area'"
      >
        <div class="sidebar-mobile-overlay" @click="toggleMobileSidebar"></div>
        <BaseSidebar />
      </div>

      <!-- MAIN CONTENT AREA -->
      <div class="main-content-area">
        <!-- TOPBAR AREA -->
        <div class="topbar-area">
          <BaseTopbar />
        </div>

        <!-- MAIN CONTENT -->
        <div class="main-content">
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, inject, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useColor } from "@/shared/composables/useColor";
import BaseTopbar from "@/shared/components/global-comps/base-topbar.vue";
import BaseSidebar from "@/shared/components/global-comps/base-sidebar.vue";
import { Emitter } from "mitt";

// Define the type of the event bus
type Events = {
  triggerSidebar: void;
};

const route = useRoute();
const eventBus = inject<Emitter<Events>>("eventBus");
const showMobileSidebar = ref<boolean>(false);

const toggleMobileSidebar = () => {
  showMobileSidebar.value = !showMobileSidebar.value;
};

watch(route, () => {
  if (showMobileSidebar.value) {
    showMobileSidebar.value = false;
  }
});

const { setPageBackgroundColor } = useColor();

onMounted(() => {
  setPageBackgroundColor("#f6faf9");

  eventBus?.on("triggerSidebar", () => toggleMobileSidebar());
});
</script>

<style lang="scss" scoped>
.base-layout {
  @apply w-full flex justify-between items-start;

  .sidebar-area {
    @apply fixed w-[16%] xl:w-[20%] lg:w-[24%] mdLg:w-0 mdLg:hidden h-full top-0 left-0;
  }

  .visible-sidebar-area {
    @apply w-[35%] md:w-[45%] sm:w-[60%] xs:w-[70%] block z-50 animate-drift-left;

    .sidebar-mobile-overlay {
      @apply fixed inset-0 w-full h-full bg-neutral-900/40 z-30 transition duration-300 ease-in-out;
      z-index: 4999;
    }
  }

  .main-content-area {
    @apply relative w-[84%] xl:w-[80%] lg:w-[76%] mdLg:w-full left-[16%] xl:left-[20%] lg:left-[24%] mdLg:left-0;

    .topbar-area {
      @apply fixed top-0 w-[84%] xl:w-[80%] lg:w-[76%] mdLg:w-full bg-neutral-10 z-30 shadow-sm;
    }

    .main-content {
      @apply relative top-28 xl:top-[108px] mdLg:top-[98px] w-full h-full px-8 xl:px-6 mdLg:px-4 py-1;
    }
  }
}
</style>
