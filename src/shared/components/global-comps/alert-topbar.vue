<template>
  <div class="alert-top-bar">
    <div class="alert--left">
      <div class="icon icon-info-circle"></div>

      <div class="text">{{ alertText }}</div>
    </div>

    <div class="alert--right">
      <div class="action-btn" @click="handleAlertAction">{{ alertAction }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";

type IALertType = {
  alertText: string;
  alertAction: string;
  alertActionRoute: string;
};

const props = withDefaults(defineProps<IALertType>(), {
  alertText: "Alert info message",
  alertAction: "Action text",
  alertActionRoute: "",
});

const router = useRouter();

const handleAlertAction = () => {
  if (props.alertActionRoute) {
    router.push(props.alertActionRoute);
  }
};
</script>

<style lang="scss" scoped>
.alert-top-bar {
  @apply relative animate-slide-down transition duration-300 w-full bg-yellow-200/35 px-8 xl:px-6 mdLg:px-4 py-3 flex justify-between items-center gap-x-3;

  .alert--left {
    @apply flex justify-start items-center gap-x-2;

    .icon {
      @apply text-lg;
    }

    .text {
      @apply text-grey-800 text-sm lg:text-[13.5px];
    }
  }

  .alert--right {
    .action-btn {
      @apply transition duration-300 ease-in-out cursor-pointer border border-yellow-800/50 rounded-full px-5 py-2 text-[13.5px] text-center text-nowrap hover:bg-yellow-200/35;
    }
  }
}
</style>
