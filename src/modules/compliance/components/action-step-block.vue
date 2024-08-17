<template>
  <div class="action-step-block" v-if="activeNavigationList.length">
    <div class="cross-hair"></div>

    <router-link
      :to="{ name: item.stepLink }"
      class="action-step"
      activeClass="action-step-active"
      exactActiveClass="action-step-active"
      :class="{
        'pr-[10px] xl:pr-2': index === 0,
        'pl-[10px] xl:pl-2': index === activeNavigationList.length - 1,
        'px-[10px] xl:px-2':
          index !== 0 && index !== activeNavigationList.length - 1,
      }"
      v-for="(item, index) in activeNavigationList"
      :key="index"
    >
      <div class="action-counter">{{ index + 1 }}</div>
      <div class="action-step-text">{{ item.stepName }}</div>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import {
  INavigationType,
  businessNavList,
  registrationNavList,
  representativeNavList,
  signatoryNavList,
} from "../constant/compliance-navigation-list";

const route = useRoute();
const activeNavigationList = ref<INavigationType[]>([]);

watch(
  route,
  () => {
    if (route.path.includes("business"))
      activeNavigationList.value = businessNavList;
    else if (route.path.includes("registration"))
      activeNavigationList.value = registrationNavList;
    else if (route.path.includes("representative"))
      activeNavigationList.value = representativeNavList;
    else if (route.path.includes("signatory"))
      activeNavigationList.value = signatoryNavList;
    else activeNavigationList.value = [];
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.action-step-block {
  @apply relative mb-9 flex justify-start items-center gap-x-8 xl:gap-x-6 sm:gap-x-3 w-max xs:w-full sm:overflow-x-auto sm:py-3;

  &::-webkit-scrollbar {
    @apply h-1;
  }

  &::-webkit-scrollbar-track {
    @apply rounded-sm;
  }

  &::-webkit-scrollbar-thumb {
    @apply rounded-sm bg-grey-300/40;
  }

  .cross-hair {
    @apply absolute w-full top-1/2 -translate-y-1/2 border-t border-t-grey-300/80 xs:border-0;
  }

  .action-step {
    @apply relative flex justify-start items-center gap-x-3 sm:gap-x-2.5 z-10 bg-grey-10 transition duration-300 ease-in-out cursor-pointer;

    .action-counter {
      @apply size-[22px] sm:size-5 min-h-[22px] sm:min-h-5 min-w-[22px] sm:min-w-5 rounded-full bg-grey-500/90 font-medium text-[11px] sm:text-[10px] text-neutral-10 flex justify-center items-center;
    }

    .action-step-text {
      @apply text-[14.5px] xl:text-[14px] sm:text-[13.75px] text-grey-600/80;
    }
  }

  .action-step-active {
    .action-counter {
      @apply bg-green-600/90;
    }

    .action-step-text {
      @apply text-green-600 font-medium;
    }
  }
}
</style>
