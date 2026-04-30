<template>
  <div class="customer-info-row">
    <!-- CUSTOMER TOP -->
    <div class="customer-top">
      <div class="customer-top-left">{{ customerName }}</div>

      <div class="customer-top-right">
        ZMW {{ formatNumber(customerTransactions) }}
      </div>
    </div>

    <!-- CUSTOMER BASE -->
    <div class="customer-base">
      <div class="transaction-progress-bar" role="progressbar">
        <div
          class="progress"
          :class="getCustomerTransactionPercentage.color"
          :style="{ width: getCustomerTransactionPercentage.percent }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useString } from "@/shared/composables/useString";

const { formatNumber } = useString();

interface ICustomerInfoType {
  customerName: string;
  customerTransactions: number;
  totalWeekTransactions: number;
}

const props = withDefaults(defineProps<ICustomerInfoType>(), {
  customerName: "Custome name",
  customerTransactions: 0,
  totalWeekTransactions: 0,
});

const getCustomerTransactionPercentage = computed(() => {
  const percentage =
    (props.customerTransactions / props.totalWeekTransactions) * 100;

  let percentColorBg = "";

  if (percentage >= 50) percentColorBg = "progress-high";
  else if (percentage >= 25 && percentage < 50) percentColorBg = "progress-mid";
  else percentColorBg = "progress-low";

  return { percent: `${percentage.toFixed(2)}%`, color: percentColorBg };
});
</script>

<style lang="scss" scoped>
.customer-info-row {
  @apply flex flex-col justify-between items-start w-full gap-y-2 py-3 border-b border-b-grey-200/70 last-of-type:border-0;

  .customer-top {
    @apply flex justify-between items-start w-full;

    &-left {
      @apply text-grey-700/80 text-[13.5px] font-medium;
    }

    &-right {
      @apply text-teal-900/90 text-[13px] font-semibold;
    }
  }

  .customer-base {
    @apply w-full;

    .transaction-progress-bar {
      @apply relative h-3 w-full rounded-full bg-grey-300/45 overflow-hidden;

      .progress {
        @apply absolute h-full w-1/2  rounded-full;
      }

      .progress-high {
        @apply bg-green-400/75;
      }

      .progress-mid {
        @apply bg-yellow-400/75;
      }

      .progress-low {
        @apply bg-red-400/75;
      }
    }
  }
}
</style>
