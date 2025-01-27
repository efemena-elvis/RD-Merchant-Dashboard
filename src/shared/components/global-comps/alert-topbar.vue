<template>
  <div class="alert-top-bar">
    <div class="alert--left">
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

    .text {
      @apply text-grey-800 text-[13.5px];
    }
  }

  .alert--right {
    .action-btn {
      @apply transition duration-300 ease-in-out cursor-pointer text-[13.5px] text-center text-nowrap underline hover:no-underline hover:text-green-700;
    }
  }
}
</style>
