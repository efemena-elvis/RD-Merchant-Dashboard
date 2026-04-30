<template>
  <div class="empty-section">
    <!-- EMPTY IMAGE -->
    <div class="img-wrapper">
      <img :src="renderImg('empty-box.png')" alt="emptyComplianceSection" />
    </div>

    <!-- TITLE TEXT -->
    <div class="title-text">{{ title }}</div>

    <!-- DESCRIPTION TEXT -->
    <div class="description-text">
      {{ description }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useString } from "@/shared/composables/useString";

defineProps({
  title: {
    type: String,
    default: "Table is empty",
  },
  description: {
    type: String,
    default: "No table data is available yet",
  },
});

const { renderImg } = useString();
</script>

<style lang="scss" scoped>
.empty-section {
  @apply flex flex-col justify-center items-center gap-y-2.5 mt-5 mb-4 w-full;

  .img-wrapper {
    img {
      @apply w-[92px] h-auto;
    }
  }

  .title-text {
    @apply text-center text-lg font-medium text-teal-900/80;
  }

  .description-text {
    @apply text-[14.5px] mdLg:text-sm leading-6 mdLg:leading-[24.25px] text-grey-600/95 text-center mx-auto w-4/5 sm:w-[98%];
  }
}
</style>
