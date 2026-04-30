<template>
  <div class="bar-chart-container relative">
    <div
      v-for="(value, index) in chartData"
      :key="index"
      class="bar relative"
      :class="chartData.length - 1 === index && 'bar-active'"
      :style="{ height: (value / maxValue) * 100 + '%' }"
      @mouseenter="showTooltip(index)"
      @mouseleave="hideTooltip"
    >
      <div
        v-if="tooltipVisible && activeIndex === index"
        class="tooltip"
        :style="tooltipPosition"
      >
        {{ formatNumber(value) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useString } from "@/shared/composables/useString";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

const { formatNumber } = useString();

// Find the maximum value in the data
const maxValue = computed(() => Math.max(...props.data));

// Assign data to chartData for easy handling
const chartData = ref(props.data);

// Tooltip state management
const tooltipVisible = ref(false);
const tooltipPosition = ref({});
const activeIndex = ref(null);

const showTooltip = (index) => {
  tooltipVisible.value = true;
  activeIndex.value = index;
  tooltipPosition.value = {
    bottom: "66%", // Show above the bar
    left: `calc(${(index / chartData.value.length) * 100}% - 20px)`,
  };
};

const hideTooltip = () => {
  tooltipVisible.value = false;
  activeIndex.value = null;
};
</script>

<style lang="scss" scoped>
.bar-chart-container {
  @apply flex items-end h-[60px] w-full px-1 relative;

  .bar {
    @apply flex-1 mx-1 bg-grey-300/40 transition-all duration-300 ease-in-out hover:bg-green-300 cursor-pointer relative;

    &-active {
      @apply bg-green-400/55;
    }

    .tooltip {
      @apply absolute bg-gray-700 text-neutral-10 text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap -translate-y-full z-10;
    }
  }
}
</style>
