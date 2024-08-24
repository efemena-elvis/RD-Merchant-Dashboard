<template>
  <div class="overview-card">
    <div class="bottom-row">
      <div class="column-wrapper">
        <BalanceOverviewColumn
          title="Available Collection Balance"
          :amountList="[80, 220, 200]"
        />
      </div>

      <div class="column-wrapper">
        <BalanceOverviewColumn
          title="Disbursement Balance"
          :amountList="[200, 250, 300]"
        />
      </div>

      <div class="column-wrapper">
        <BalanceOverviewColumn
          title="Collection Charges"
          :amountList="[20, 60, 50]"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BalanceOverviewColumn from "@/modules/transfers/components/balance-overview-column.vue";
</script>

<style lang="scss" scoped>
.overview-card {
  @apply w-full h-full bg-neutral-10 rounded-lg border border-grey-200/50 p-5 shadow-lg shadow-grey-200/40 flex flex-col justify-between items-start gap-y-9;

  .bottom-row {
    @apply w-full grid grid-cols-3 md:grid-cols-1 grid-flow-col md:grid-flow-row md:gap-y-4;

    .column-wrapper {
      @apply border-r border-r-grey-200/85 last-of-type:border-0 md:border-0 px-4 py-1 first-of-type:pl-0 first-of-type:pr-4 md:first-of-type:pr-0 last-of-type:pr-0 last-of-type:pl-4 md:last-of-type:pl-0 md:px-0;
    }
  }
}
</style>
