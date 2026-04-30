<template>
  <div class="compliance-layout">
    <div class="compliance-sidebar">
      <div class="sidebar-nav-items">
        <router-link
          v-for="(route, index) in complianceSidebarRoutes"
          :key="index"
          :to="{ name: route.routeLinkName }"
          class="item-row"
          activeClass="item-row-active"
          exactActiveClass="item-row-active"
          :class="{
            'item-row-active':
              (appRoute.path.includes('/business') &&
                route.routeLinkName.toLowerCase().includes('business')) ||
              (appRoute.path.includes('/registration') &&
                route.routeLinkName.toLowerCase().includes('registration')) ||
              (appRoute.path.includes('/representative') &&
                route.routeLinkName.toLowerCase().includes('representative')) ||
              (appRoute.path.includes('/signatory') &&
                route.routeLinkName.toLowerCase().includes('signatory')),
          }"
        >
          <div class="icon" :class="route.routeIcon"></div>
          <div class="text">{{ route.routeTitle }}</div>
        </router-link>
      </div>
    </div>

    <!-- COMPLIANCE CONTENT -->
    <div class="compliance-content">
      <!-- MOBILE TOP NAV -->
      <div
        class="mobile-topnav border border-grey-200/75 -mt-2"
        @click="toggleMobileDropdown"
      >
        <div class="mobile-topnav--left">
          <div class="icon" :class="activeRouteIcon"></div>
          <div class="text">{{ activeRouteTitle }}</div>
        </div>

        <div class="mobile-topnav--right">
          <div
            class="icon icon-caret-down"
            :class="showMobileDropdown && 'rotate-180'"
          ></div>
        </div>
      </div>

      <!-- ACTION STEP BLOCK -->
      <actionStepBlock />

      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </div>

  <!-- MOBILE DROPDOWN -->
  <div
    class="mobile-dropdown-wrapper"
    v-if="showMobileDropdown"
    @click="toggleMobileDropdown"
  >
    <div class="mobile-dropdown">
      <div class="mobile-dropdown-inner">
        <router-link
          :to="{ name: route.routeLinkName }"
          class="dropdown-item"
          activeClass="dropdown-item-active"
          exactActiveClass="dropdown-item-active"
          v-for="(route, index) in complianceSidebarRoutes"
          :key="index"
        >
          <div class="dropdown-item--left">
            <div class="icon" :class="route.routeIcon"></div>
            <div class="text">{{ route.routeTitle }}</div>
          </div>

          <div class="dropdown-item--right">
            <div class="active-item">
              <div class="icon icon-checkmark"></div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { complianceSidebarRoutes } from "@/shared/constants/sidebar-routes";
import actionStepBlock from "@/modules/compliance/components/action-step-block.vue";

const appRoute = useRoute();

const activeRouteTitle = ref<string>("");
const activeRouteIcon = ref<string>("");

const getActiveRoute = () => {
  const { basePath, basePathIcon } = appRoute.meta?.pageMeta as {
    basePath: string;
    basePathIcon: string;
  };

  activeRouteIcon.value = basePathIcon;
  activeRouteTitle.value = basePath;
};

watch(appRoute, () => getActiveRoute(), { immediate: true });

const showMobileDropdown = ref<boolean>(false);

const toggleMobileDropdown = () => {
  showMobileDropdown.value = !showMobileDropdown.value;
};
</script>

<style lang="scss" scoped>
.compliance-layout {
  @apply flex justify-start items-start;

  .compliance-sidebar {
    @apply fixed w-[20%] xl:w-[23%] lg:w-[21%] mdLg:w-[23%] md:hidden;

    .sidebar-nav-items {
      @apply flex flex-col justify-start items-start gap-y-2.5 border-l border-grey-200/80;

      .item-row {
        @apply flex justify-start items-start gap-x-3 relative text-grey-600 px-5 lg:px-4 py-2;

        .icon {
          @apply text-[16.5px] relative top-[1.25px];
        }

        .text {
          @apply text-[14.5px] xl:text-sm;
        }

        &-active {
          @apply -left-[1.25px] border-l-[2px] border-l-green-400 text-green-600 font-semibold;
        }
      }
    }
  }

  .compliance-content {
    @apply relative w-1/2 xl:w-[65%] lg:w-[70%] md:w-full left-[26%] xl:left-[28%] lg:left-[30%] md:left-0 px-10 xl:px-6 lg:px-4 md:px-1 sm:px-0 pt-2;

    .mobile-topnav {
      @apply hidden md:flex justify-between items-center gap-x-3 mb-8 px-2.5 py-2.5 bg-neutral-10 cursor-pointer;

      &--left {
        @apply flex justify-start items-center gap-x-3 xs:gap-x-2.5;

        .icon {
          @apply text-lg sm:text-[17.5px] text-green-600;
        }

        .text {
          @apply text-[14.5px] sm:text-[14px] xs:text-[13.5px] font-medium text-green-600/90;
        }
      }

      &--right {
        .icon {
          @apply relative transition duration-300 ease-in-out text-[19px] text-grey-800;
        }
      }
    }
  }
}

.mobile-dropdown-wrapper {
  @apply fixed inset-0 w-full h-full bg-neutral-900/40 transition duration-300 ease-in-out;
  z-index: 5999;

  .mobile-dropdown {
    @apply w-full h-auto rounded-t-2xl bg-neutral-10 p-5 pb-3 absolute bottom-0 animate-drift-down;
    z-index: 5999;

    &-inner {
      @apply flex flex-col justify-start items-start gap-x-2 w-full;

      .dropdown-item {
        @apply w-full flex justify-between items-center gap-x-4 py-2.5 border-b border-b-grey-200/30;

        &--left {
          @apply flex justify-start items-center gap-x-4;

          .icon {
            @apply text-lg text-grey-600;
          }

          .text {
            @apply text-[14.5px] xs:text-[14.25px] text-grey-600;
          }
        }

        &--right {
          @apply invisible;

          .active-item {
            @apply size-5 min-h-5 min-w-5 rounded-full bg-green-500/80 flex justify-center items-center;

            .icon {
              @apply text-neutral-10 text-base;
            }
          }
        }
      }

      .dropdown-item-active {
        .dropdown-item--left {
          .icon {
            @apply text-green-600;
          }

          .text {
            @apply text-green-600 font-medium;
          }
        }

        .dropdown-item--right {
          @apply visible;
        }
      }
    }
  }
}
</style>
