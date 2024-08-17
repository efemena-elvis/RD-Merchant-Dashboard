<template>
  <div
    class="auth-layout relative h-screen py-[50px] px-[100px] md:px-[50px] sm:px-[30px]"
  >
    <a
      href="https://redstonepgs.com"
      class="brand-logo relative block mx-auto w-max mb-14"
    >
      <RedstoneLogo />
    </a>

    <div class="flex justify-center items-start mt-10">
      <div class="w-[38%]">
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </div>
    </div>

    <a
      class="fixed bottom-[30px] right-[30px] scale-[0.85] cursor-pointer transition duration-300 ease-in-out hover:scale-[0.9]"
      href=""
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
