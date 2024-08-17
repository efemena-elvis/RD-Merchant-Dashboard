<template>
  <div class="topbar">
    <div class="topbar--left">
      <div class="topbar--left-menu" @click="triggerMenuSidebar">
        <div class="icon icon-menu"></div>
      </div>

      <div class="topbar--left-wrapper">
        <div class="page-title">{{ pageTitle }}</div>
        <div class="page-sub-title">
          {{ pageDescription }}
        </div>
      </div>
    </div>

    <div class="topbar--right">
      <!-- MODE TOGGLER -->
      <div class="relative">
        <div
          class="mode-toggler"
          ref="togglerModeRef"
          @click="toggleModeDropdown(!showModeDropdown)"
        >
          <div class="icon icon-regulator"></div>
          <!-- <div class="mode-toggler-control">
            <div class="mode-toggler-control-pin"></div>
          </div> -->

          <div
            class="text"
            :class="activeMode === 'test' ? 'text-red-500' : 'text-green-600'"
          >
            {{ activeMode }} Mode
          </div>
        </div>

        <!-- MODE DROPDOWN -->
        <div
          class="app-dropdown"
          ref="dialogModeRef"
          v-if="showModeDropdown"
          role="dialog"
          aria-modal="true"
        >
          <div class="dropdown-wrapper">
            <div class="app-dropdown-item" @click="updateActiveMode('test')">
              <div class="icon icon-shield-slash text-base"></div>
              <div class="text">Test Mode</div>
            </div>

            <div class="app-dropdown-item" @click="updateActiveMode('live')">
              <div class="icon icon-radar text-lg"></div>
              <div class="text">Live Mode</div>
            </div>
          </div>
        </div>
      </div>

      <!-- NOTIFICATIONS -->
      <!-- <div class="relative">
        <div v-if="false"
          class="icon-wrapper"
          ref="togglerNotificationRef"
          @click="toggleNotificationDropdown(!showNotificationDropdown)"
        >
          <div class="icon-notification"></div>
        </div>

        <div
          class="app-dropdown notification-dropdown"
          ref="dialogNotificationRef"
          v-if="showNotificationDropdown"
          role="dialog"
          aria-modal="true"
        >
          <div class="dropdown-wrapper">
            <div class="item-top">Your notifications</div>

            <div class="item-list">
              <NavNotificationItem />
              <NavNotificationItem />
            </div>

            <router-link to="/notifications" class="item-base"
              >View all notifications</router-link
            >
          </div>
        </div>
      </div> -->

      <!-- USER PROFILE -->
      <div class="relative">
        <div
          class="icon-wrapper"
          ref="togglerProfileRef"
          @click="toggleProfileDropdown(!showProfileDropdown)"
        >
          <div class="icon-user"></div>
        </div>

        <div
          class="app-dropdown profile-dropdown"
          ref="dialogProfileRef"
          v-if="showProfileDropdown"
          role="dialog"
          aria-modal="true"
        >
          <div class="dropdown-wrapper">
            <router-link to="/settings/profile" class="app-dropdown-item">
              <div class="icon icon-user text-base"></div>
              <div class="text">Profile</div>
            </router-link>

            <!-- <router-link to="/settings/preferences" class="app-dropdown-item">
              <div class="icon icon-tool text-base"></div>
              <div class="text">Preferences</div>
            </router-link> -->

            <router-link to="/settings/preferences" class="app-dropdown-item">
              <div class="icon icon-developer text-base"></div>
              <div class="text">Developers</div>
            </router-link>

            <!-- <router-link to="/user-support" class="app-dropdown-item">
              <div class="icon icon-chat text-base"></div>
              <div class="text">Help & Support</div>
            </router-link> -->

            <div class="app-dropdown-item">
              <div class="icon icon-logout text-lg text-red-600"></div>
              <div class="text text-red-600">Sign Out</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, inject } from "vue";
import { useRoute } from "vue-router";
import NavNotificationItem from "./nav-notification-item.vue";
import useClickOutside from "@/shared/composables/useClickOutside";
import { Emitter } from "mitt";

// Define the type of the event bus
type Events = {
  triggerSidebar: void;
};

const route = useRoute();
const eventBus = inject<Emitter<Events>>("eventBus");

const pageTitle = ref<string>("");
const pageDescription = ref<string>("");

// UPDATE PAGE TITLE AND DESCRIPTION
const updatePageMeta = () => {
  const { title, description } = route.meta?.pageMeta as {
    title: string;
    description: string;
  };
  pageTitle.value = title;
  pageDescription.value = description;
};

watch(route, () => updatePageMeta(), { immediate: true });

watch(route, () => {
  toggleModeDropdown(false);
  toggleNotificationDropdown(false);
  toggleProfileDropdown(false);
});

// UPDATE ENVIRONMENT MODE
const activeMode = ref<string>("test");

const updateActiveMode = (mode: string) => {
  activeMode.value = mode;
  toggleModeDropdown(false);
};

const triggerMenuSidebar = () => {
  eventBus?.emit("triggerSidebar");
};

// SETUP DROPDOWN FUNCTIONALITY
const showModeDropdown = ref(false);
const dialogModeRef = ref<HTMLElement | null>(null);
const togglerModeRef = ref<HTMLElement | null>(null);

const showNotificationDropdown = ref(false);
const dialogNotificationRef = ref<HTMLElement | null>(null);
const togglerNotificationRef = ref<HTMLElement | null>(null);

const showProfileDropdown = ref(false);
const dialogProfileRef = ref<HTMLElement | null>(null);
const togglerProfileRef = ref<HTMLElement | null>(null);

const toggleModeDropdown = (state: boolean) => (showModeDropdown.value = state);
const toggleNotificationDropdown = (state: boolean) =>
  (showNotificationDropdown.value = state);
const toggleProfileDropdown = (state: boolean) =>
  (showProfileDropdown.value = state);

useClickOutside(dialogModeRef, togglerModeRef, toggleModeDropdown);
useClickOutside(
  dialogNotificationRef,
  togglerNotificationRef,
  toggleNotificationDropdown
);
useClickOutside(dialogProfileRef, togglerProfileRef, toggleProfileDropdown);
</script>

<style lang="scss" scoped>
.topbar {
  @apply relative px-8 xl:px-6 mdLg:px-4 py-[18px] mdLg:py-4 sm:py-2 flex justify-between items-center h-[82px];

  &--left {
    @apply flex justify-start items-center gap-x-2.5;

    &-menu {
      @apply hidden mdLg:block text-3xl sm:text-2xl cursor-pointer text-grey-500/90;
    }

    &-wrapper {
      @apply flex flex-col justify-center items-start mdLg:gap-y-0.5;

      .page-title {
        @apply relative text-[17.5px] mdLg:text-base sm:text-[15.25px] xs:text-[14.5px] xs:text-nowrap leading-[30px] xs:leading-[24px] xs:w-[150px] xxs:w-[130px] xs:overflow-hidden xs:text-ellipsis capitalize font-semibold sm:font-medium text-teal-900/90;
      }

      .page-sub-title {
        @apply text-[13px] mdLg:text-xs sm:hidden text-teal-800/95;
      }
    }
  }

  &--right {
    @apply flex justify-end items-center gap-x-4 xs:gap-x-2.5;

    %card-wrapper {
      @apply relative rounded-full border border-grey-300/80 bg-grey-50/30 cursor-pointer transition duration-300 ease-in-out hover:bg-grey-100/50 hover:border-grey-400/70;
    }

    .mode-toggler {
      @extend %card-wrapper;
      @apply px-3 flex justify-between items-center gap-x-2 w-max min-h-9 h-9 rounded-[18px];

      .mode-toggler-control {
        @apply relative h-3 w-6 rounded-xl border border-grey-300 cursor-pointer;

        &-pin {
          @apply absolute top-1/2 -translate-y-1/2 left-0.5 rounded-full bg-grey-500 h-[10px] w-[10px];
        }
      }

      .text {
        @apply text-[12.75px] xs:text-[12.5px] capitalize font-semibold xs:font-medium;
      }
    }

    .icon-wrapper {
      @apply min-w-9 xs:min-w-[34px] min-h-9 xs:min-h-[34px] size-9 xs:size-[34px] flex justify-center items-center;
      @extend %card-wrapper;
    }

    .notification-dropdown {
      @apply w-[330px] -right-full pb-0;

      .dropdown-wrapper {
        @apply after:right-[14.5%];
      }

      .item-top {
        @apply text-sm font-semibold text-center text-teal-900 p-3;
      }

      .item-list {
        @apply border-t border-t-grey-200/80;
      }

      .item-base {
        @apply text-[13px] w-full block text-center font-medium cursor-pointer p-3 text-green-600 transition duration-100 ease-in-out hover:bg-grey-50/90;
      }
    }

    .profile-dropdown {
      @apply w-[200px] -right-1/4;

      .dropdown-wrapper {
        @apply after:right-[10.75%];
      }
    }
  }
}
</style>
