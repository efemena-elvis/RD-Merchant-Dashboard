<template>
  <div class="compliance-display-block">
    <!-- CONTENT TOP AREA -->
    <div class="content-top">
      <div class="content-top--title">{{ title }}</div>
      <div class="content-top--description">
        {{ description }}
      </div>
    </div>

    <template v-if="isComplianceLoading">
      <SkeletonDisplay />
    </template>

    <template v-else>
      <div class="content-area mb-8">
        <slot :key="componentKey"></slot>
      </div>

      <div class="btn-action-row" v-if="showActionRow">
        <button class="btn btn-sm btn-secondary" @click="$emit('onBackClick')">
          Back
        </button>

        <button
          class="btn btn-sm btn-primary"
          ref="btnRef"
          :disabled="isPrimaryActionDisabled"
          @click="triggerPrimaryActionClick"
        >
          {{ primaryActionText }}
        </button>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import { useComplianceStore } from "@/modules/compliance/store";
import useEvents from "@/shared/composables/useEvents";
import SkeletonDisplay from "@/modules/compliance/components/skeleton-display.vue";

interface IComplianceInfoType {
  title: string;
  description: string;
  showActionRow?: boolean;
  primaryActionText?: string;
  isPrimaryActionDisabled?: boolean;
  stopClickHandler?: boolean;
}

const emits = defineEmits(["onBackClick", "onContinueClick"]);

const props = withDefaults(defineProps<IComplianceInfoType>(), {
  title: "Document title",
  description: "Document description",
  showActionRow: false,
  primaryActionText: "Continue",
  isPrimaryActionDisabled: false,
  stopClickHandler: false,
});

const { processAPIRequest, clickHandler } = useEvents();
const { getCompliance, mutateCompliance } = useComplianceStore();

const btnRef = ref(null);
const isComplianceLoading = ref<boolean>(true);

const componentKey = ref<number>(0);
const remountComponent = () => {
  componentKey.value += 1;
};

const triggerPrimaryActionClick = () => {
  clickHandler(btnRef);
  emits("onContinueClick");
};

watch(
  props,
  () => {
    if (props.stopClickHandler)
      clickHandler(btnRef, props.primaryActionText, false);
  },
  { deep: true }
);

// Fetch all compliance data
onMounted(async () => {
  const response = await processAPIRequest({
    action: getCompliance,
    payload: {},
    showAlert: false,
  });

  if ([200, 400].includes(response.code)) {
    isComplianceLoading.value = false;
    mutateCompliance(response);

    remountComponent();
  }
});
</script>

<style lang="scss" scoped>
.compliance-display-block {
  @apply mb-14;

  .content-top {
    @apply mb-10;

    &--title {
      @apply text-teal-900 text-xl xl:text-[18.5px] lg:text-[17.75px] sm:text-[16.5px] font-semibold mb-[6px];
    }

    &--description {
      @apply text-[14.5px] xl:text-[14px] sm:text-[13.75px] leading-6 sm:leading-[22.5px] text-grey-800/80;
    }
  }

  .btn-action-row {
    @apply flex justify-between items-center gap-x-6;

    .btn {
      @apply min-w-[130px] w-auto py-2.5 xs:text-[13.75px];
    }
  }
}
</style>
