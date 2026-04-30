<template>
  <div
    class="auth-layout relative h-screen py-[50px] px-[100px] xl:px-[66px] lg:px-[50px] md:px-7 sm:px-3"
  >
    <a href="/" class="brand-logo relative block mx-auto w-max mb-14">
      <RedstoneLogo />
    </a>

    <div class="flex justify-center items-start mt-10">
      <div class="w-[38%] lg:w-[50%] md:w-[75%] sm:w-[90%] xs:w-full">
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
  @apply flex-col justify-start items-center;

  .brand-logo {
    svg {
      @apply w-[200px] h-auto sm:w-[170px];
    }
  }
}
</style>
