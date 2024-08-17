<template>
  <div class="overview-card">
    <div class="top-row">
      <!-- TITLE ROW -->
      <div class="title-row">
        <div class="icon-wrapper">
          <div class="icon icon-empty-wallet"></div>
        </div>

        <div class="text">Financial Summary</div>
      </div>

      <!-- FILTER ROW -->
      <OverviewFilter :activePeriod="activePeriod" :periodList="periodList" />
    </div>

    <div class="bottom-row">
      <div class="column-wrapper">
        <overflowColumn
          title="Available Collection Balance"
          :amountList="[3200, 3800, 4000]"
        />
      </div>

      <div class="column-wrapper">
        <overflowColumn
          title="Disbursement Balance"
          :amountList="[4900, 3600, 5250]"
        />
      </div>

      <div class="column-wrapper">
        <overflowColumn title="Total Payout" :amountList="[2000, 3800, 3200]" />
      </div>

      <div class="column-wrapper">
        <overflowColumn
          title="Collection Charges"
          :amountList="[140, 200, 250]"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import overflowColumn from "./overflow-column.vue";
import OverviewFilter from "@/modules/overview/components/overview-filter.vue";

const activePeriod = ref<string>("weekly");
const periodList = ref<string[]>(["weekly", "monthly", "quarterly", "yearly"]);
</script>

<style lang="scss" scoped>
.overview-card {
  @apply w-full h-full bg-neutral-10 rounded-lg border border-grey-200/50 p-5 shadow-lg shadow-grey-200/40 flex flex-col justify-between items-start gap-y-9;

  .top-row {
    @apply flex justify-between items-center gap-x-4 w-full;

    .title-row {
      @apply flex justify-start items-center gap-x-3;

      .icon-wrapper {
        @apply rounded-full bg-grey-200/40 size-9 min-h-9 min-w-9 flex justify-center items-center;

        .icon {
          @apply text-teal-900 text-lg;
        }
      }

      .text {
        @apply font-semibold text-[16.5px] text-teal-800/85;
      }
    }
  }

  .bottom-row {
    @apply w-full grid grid-cols-4 grid-flow-col;

    .column-wrapper {
      @apply border-r border-r-grey-200/85 last-of-type:border-0 px-4 py-1 first-of-type:pl-0 first-of-type:pr-4 last-of-type:pr-0 last-of-type:pl-4;
    }
  }
}
</style>
