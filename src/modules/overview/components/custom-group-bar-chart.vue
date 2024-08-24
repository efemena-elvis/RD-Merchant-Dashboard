<template>
  <div class="bar-chart-container relative">
    <div class="bars-container flex flex-1">
      <div
        v-for="(day, index) in chartLabels"
        :key="index"
        class="bar-group flex flex-col items-center flex-1"
      >
        <div class="bars-wrapper flex justify-center items-end w-full">
          <div
            v-for="(value, i) in [chartData[0][index], chartData[1][index]]"
            :key="i"
            class="bar relative"
            :class="i === 0 ? 'bar-success' : 'bar-failed'"
            :style="{ height: (value / maxValue) * 100 + '%' }"
            @mouseenter="showTooltip(index, value, i)"
            @mouseleave="hideTooltip"
          >
            <div
              v-if="tooltipVisible && activeIndex === index && activeBar === i"
              class="tooltip"
              :style="tooltipPosition"
            >
              {{ formatNumber(value) }}
            </div>
          </div>
        </div>
        <div class="label mt-2">{{ day }}</div>
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

// Define labels for the x-axis
const chartLabels = ref(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);

// Assign data to chartData for easy handling
const chartData = ref(props.data);

// Find the maximum value in the data
const maxValue = computed(() => Math.max(...chartData.value.flat()));

// Tooltip state management
const tooltipVisible = ref(false);
const tooltipPosition = ref({});
const activeIndex = ref(null);
const activeBar = ref(null);

const showTooltip = (index, value, barIndex) => {
  tooltipVisible.value = true;
  activeIndex.value = index;
  activeBar.value = barIndex;
  tooltipPosition.value = {
    bottom: "68%", // Show above the bar
    left: `calc(${(index / chartLabels.value.length) * 100}% - 20px)`,
  };
};

const hideTooltip = () => {
  tooltipVisible.value = false;
  activeIndex.value = null;
  activeBar.value = null;
};
</script>

<style lang="scss" scoped>
.bar-chart-container {
  @apply relative flex items-end h-[210px] w-full px-1;

  .bars-container {
    @apply relative flex items-end h-full w-full;
    z-index: 1;
  }

  .bar-group {
    @apply flex flex-col justify-end items-center flex-1 h-full;

    .bars-wrapper {
      @apply flex items-end justify-center w-full h-full space-x-2 border-b border-b-grey-300/75;

      .bar {
        @apply w-8 bg-grey-300/40 transition-all duration-300 ease-in-out hover:cursor-pointer relative;

        &-success {
          @apply bg-green-400/70 hover:bg-green-400;
        }

        &-failed {
          @apply bg-red-400/70 hover:bg-red-400;
        }

        .tooltip {
          @apply absolute bg-gray-700 text-neutral-10 text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap -translate-y-full z-10;
        }
      }
    }

    .label {
      @apply relative text-xs text-center mt-2 text-grey-600 after:absolute after:w-[1px] after:h-1.5 after:left-1/2 after:translate-x-1/2 after:bg-grey-300/75 after:-top-2;
    }
  }

  &:before {
    content: "";
    @apply absolute left-0 bottom-0 w-full h-full;
    background: repeating-linear-gradient(
      to top,
      transparent,
      transparent 24.5%,
      #e5e7eb 25%,
      transparent 25.5%,
      transparent 49.5%,
      #e5e7eb 50%,
      transparent 50.5%,
      transparent 74.5%,
      #e5e7eb 75%,
      transparent 75.5%,
      transparent 99.5%,
      #e5e7eb 100%
    );
    z-index: 0;
  }
}
</style>
