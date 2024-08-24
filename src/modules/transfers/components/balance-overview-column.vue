<template>
  <div>
    <div class="overview-balance-column">
      <!-- BALANCE TYPE -->
      <div class="balance-type">{{ title }}</div>

      <!-- BALANCE BASE -->
      <div class="balance-base">
        <div class="balance-base-info">
          <div class="balance-amount">ZMW {{ getTransactionAmount }}</div>
          <div class="balance-stat">
            <span :class="getMonthlyPercentage < 0 ? 'loss' : 'gain'"
              >{{ getMonthlyPercentage }}%</span
            >
            from last month
          </div>
        </div>

        <div class="balance-graph">
          <div class="graph-area">
            <CustomBarChart :data="amountList" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useString } from "@/shared/composables/useString";
import CustomBarChart from "@/modules/overview/components/custom-bar-chart.vue";

interface IOverviewColumnType {
  title: string;
  amountList: number[];
}

const props = withDefaults(defineProps<IOverviewColumnType>(), {
  title: "Available Balance",
  amountList: () => [0],
});

const { formatNumber } = useString();

const getTransactionAmount = computed(() =>
  formatNumber(props.amountList[props.amountList.length - 1])
);

const getMonthlyPercentage = computed(() => {
  const lastAmount = props.amountList[props.amountList.length - 2];
  const currentAmount = props.amountList[props.amountList.length - 1];

  const percentage = ((currentAmount - lastAmount) / lastAmount) * 100;

  return isNaN(percentage) ? 0 : Math.round(percentage);
});
</script>

<style lang="scss" scoped>
.overview-balance-column {
  @apply flex flex-col justify-between items-start gap-y-4 md:gap-y-2.5;

  .balance-type {
    @apply text-[13.25px] lg:text-[12.75px] text-grey-700/85;
  }

  .balance-base {
    @apply relative flex justify-between items-end gap-x-2 w-full;

    &-info {
      @apply flex flex-col justify-end items-start gap-y-[3.5px];

      .balance-amount {
        @apply text-2xl lg:text-[19px] font-semibold text-teal-800;
      }

      .balance-stat {
        @apply text-xs lg:text-[11.5px] text-grey-600/85;

        .gain {
          @apply text-green-500 font-medium;
        }

        .loss {
          @apply text-red-500 font-medium;
        }
      }
    }

    .balance-graph {
      @apply absolute right-0 w-[85px] lg:w-[80px] h-auto border-b border-grey-300/80;
    }
  }
}
</style>
