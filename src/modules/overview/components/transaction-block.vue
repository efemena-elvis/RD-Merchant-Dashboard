<template>
  <div class="transaction-block">
    <div class="top-row">
      <!-- TITLE ROW -->
      <div class="title-row">
        <div class="info">
          <div class="amount">ZMW 5,250</div>
          <div class="description">Total business day collections</div>

          <div class="label-row flex justify-start items-center gap-x-3">
            <div class="label-item">
              <div class="label-bg bg-green-400/70"></div>
              <div class="label-text">Successful</div>
            </div>

            <div class="label-item">
              <div class="label-bg bg-red-400/70"></div>
              <div class="label-text">Failed</div>
            </div>
          </div>
        </div>
      </div>

      <!-- FILTER ROW -->
      <OverviewFilter :activePeriod="activePeriod" :periodList="periodList" />
    </div>

    <div class="bottom-row">
      <CustomGroupBarChart
        :data="[successfulTransactions, failedTransactions]"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import CustomGroupBarChart from "@/modules/overview/components/custom-group-bar-chart.vue";
import OverviewFilter from "@/modules/overview/components/overview-filter.vue";

const activePeriod = ref<string>("This week");
const periodList = ref<string[]>(["This week", "Last week", "2 weeks ago"]);

const successfulTransactions = ref<number[]>([
  3500, 3000, 4500, 5500, 3500, 6200, 2200,
]);
const failedTransactions = ref<number[]>([
  1200, 500, 3500, 400, 1400, 800, 100,
]);
</script>

<style lang="scss" scoped>
.transaction-block {
  @apply w-full h-full bg-neutral-10 rounded-lg border border-grey-200/50 p-5 shadow-lg shadow-grey-200/40 flex flex-col justify-between items-start gap-y-9;

  .top-row {
    @apply flex justify-between items-start gap-x-4 w-full;

    .title-row {
      @apply flex justify-start items-start gap-x-3;

      .info {
        .amount {
          @apply text-[23px] font-semibold text-teal-800 mb-[1px];
        }

        .description {
          @apply text-[13px] text-grey-500;
        }

        .label-row {
          @apply flex justify-start items-center gap-x-3 mt-2;

          .label-item {
            @apply flex justify-start items-center gap-x-2;

            .label-bg {
              @apply w-6 h-3;
            }

            .label-text {
              @apply text-[11px] text-grey-500/85;
            }
          }
        }
      }
    }
  }

  .bottom-row {
    @apply w-full;
  }
}
</style>
