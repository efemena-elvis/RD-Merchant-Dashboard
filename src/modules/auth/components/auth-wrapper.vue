<template>
  <div
    class="w-full w-max-full m-auto mb-24 bg-neutral-10 p-7 md:py-[24px] md:px-[22px] sm:px-[18px] rounded-2xl transition duration-300 ease-in-out"
    :class="center_placement ? '-mt-11' : ''"
  >
    <!-- TITLE TEXT -->
    <div
      class="text-2xl lg:text-xl md:text-lg font-medium text-grey-800/85"
      :class="[
        center_title ? 'text-center' : '',
        meta_text ? 'mb-4' : 'mb-10 md:mb-9',
      ]"
    >
      {{ title_text }}
    </div>

    <div
      class="text-[14.5px] text-grey-700 mb-8"
      :class="center_title ? 'text-center' : ''"
      v-if="meta_text"
      v-html="meta_text"
    ></div>

    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  title_text: {
    type: String,
    required: true,
  },
  meta_text: {
    type: String,
    required: false,
  },
  center_title: {
    type: Boolean,
    default: false,
  },
  center_placement: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped></style>
