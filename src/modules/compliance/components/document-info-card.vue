<template>
  <div class="document-info-card">
    <!-- DOCUMENT TOP -->
    <div class="document-top" @click="toggleDocumentBase()">
      <div class="document-top--left">
        <!-- BULLET POINT -->
        <div class="bullet-point"></div>

        <!-- DOCUMENT TITLE -->
        <div class="document-title">{{ title }}</div>
      </div>

      <div class="document-top--right">
        <div
          class="icon icon-caret-down"
          :class="showDocumentBase && 'rotate-180'"
        ></div>
      </div>
    </div>

    <!-- DOCUMENT BASE -->
    <div class="document-base" v-if="showDocumentBase">
      <div class="description-text">
        {{ description }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

interface IDocumentInfoType {
  title: string;
  description: string;
}

withDefaults(defineProps<IDocumentInfoType>(), {
  title: "Document title",
  description: "Document description",
});

const showDocumentBase = ref<boolean>(false);

const toggleDocumentBase = () =>
  (showDocumentBase.value = !showDocumentBase.value);
</script>

<style lang="scss" scoped>
.document-info-card {
  @apply shadow-sm border-t border-t-grey-200/60 h-auto w-full bg-neutral-10 last-of-type:border-b border-b-grey-200/40 first-of-type:rounded-t-md last-of-type:rounded-b-md;

  .document-top {
    @apply flex justify-between items-center gap-x-2 p-[14px] cursor-pointer;

    &--left {
      @apply flex justify-start items-center gap-x-3;

      .bullet-point {
        @apply size-[10px] min-h-[10px] min-w-[10px] border-[2.75px] bg-grey-500 rounded-full;
      }

      .document-title {
        @apply text-grey-700 text-[14.5px];
      }
    }

    &--right {
      @apply size-6 min-h-6 min-w-6 border border-grey-300/80 rounded-full flex justify-center items-center;

      .icon {
        @apply relative text-grey-500 text-sm transition duration-300 ease-in-out;
      }
    }
  }

  .document-base {
    @apply animate-slide-down p-[14px] pt-0;

    .description-text {
      @apply text-[13.5px] leading-[22px] text-grey-600 px-6 -mt-1;
    }
  }
}
</style>
