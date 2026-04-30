<template>
  <div
    class="auth-layout relative h-screen py-[50px] px-[100px] xl:px-[66px] lg:px-[50px] md:px-7 sm:px-3"
  >
    <div class="logo-wrapper w-full flex md:justify-center mb-10 md:mb-12">
      <a href="/" class="brand-logo relative md:mx-auto">
        <RedstoneLogo />
      </a>
    </div>

    <div
      class="flex justify-between md:justify-center items-start gap-x-2 xl:gap-x-1"
    >
      <!-- AUTH CONTENT BLOCK -->
      <div class="w-[48%] xl:w-[52%] lg:w-[46%] md:hidden pt-20">
        <!-- TITLE TEXT -->
        <div
          class="text-neutral-10 mb-6 text-[58px] xl:text-[52px] lg:text-[48px] leading-[74px] lg:leading-[64px] font-bold"
        >
          One payment platform for all transactions.
        </div>

        <!-- DESCRIPTION TEXT -->
        <div class="text-grey-400 text-xl lg:text-lg leading-8">
          Effortlessly set up a preferred payment route to collect payments from
          your customers.
        </div>
      </div>

      <div
        class="w-[40%] xl:w-[46%] lg:w-[50%] md:w-[70%] sm:w-[90%] xs:w-full"
      >
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </div>
    </div>

    <a
      class="fixed bottom-[30px] right-[30px] scale-[0.85] cursor-pointer transition duration-300 ease-in-out hover:scale-[0.9]"
      href="mailto:support@redstonepgs.com"
      target="_blank"
    >
      <SupportIcon />
    </a>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import RedstoneLogo from "@/shared/components/icon-comps/redstone-logo.vue";
import SupportIcon from "@/shared/components/icon-comps/support-icon.vue";
import { useColor } from "@/shared/composables/useColor";

const { setPageBackgroundColor } = useColor();

onMounted(() => setPageBackgroundColor("#011A27"));
</script>

<style lang="scss" scoped>
.auth-layout {
  .brand-logo {
    svg {
      @apply w-[200px] xl:w-[180px] md:w-[160px] h-auto;
    }
  }
}
</style>
