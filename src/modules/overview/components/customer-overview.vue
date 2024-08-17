<template>
  <div class="overview-card">
    <div class="top-row">
      <!-- TITLE ROW -->
      <div class="title-row">
        <div class="text">Top Customers</div>
        <div class="description">Current business week</div>
      </div>

      <!-- FILTER ROW -->
      <OverviewFilter :activePeriod="activePeriod" :periodList="periodList" />
    </div>

    <div class="bottom-row">
      <CustomerInfoRow
        customerName="Efemena Elvis"
        :customerTransactions="7500"
        :totalWeekTransactions="10200"
      />

      <CustomerInfoRow
        customerName="Andrew Smith"
        :customerTransactions="5500"
        :totalWeekTransactions="10200"
      />

      <CustomerInfoRow
        customerName="Michael Simi"
        :customerTransactions="4800"
        :totalWeekTransactions="10200"
      />

      <CustomerInfoRow
        customerName="Juliet Bucknor"
        :customerTransactions="2500"
        :totalWeekTransactions="10200"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import OverviewFilter from "@/modules/overview/components/overview-filter.vue";
import CustomerInfoRow from "@/modules/overview/components/customer-info-row.vue";

const activePeriod = ref<string>("This week");
const periodList = ref<string[]>(["This week", "Last week", "2 weeks ago"]);
</script>

<style lang="scss" scoped>
.overview-card {
  @apply w-full h-full bg-neutral-10 rounded-lg border border-grey-200/50 p-5 shadow-lg shadow-grey-200/40 flex flex-col justify-between items-start gap-y-7;

  .top-row {
    @apply flex justify-between items-start gap-x-4 w-full;

    .title-row {
      @apply flex flex-col justify-start items-start gap-y-0.5;

      .text {
        @apply font-semibold text-[16.5px] text-teal-800/85;
      }

      .description {
        @apply text-[13px] text-grey-500;
      }
    }
  }

  .bottom-row {
    @apply w-full h-full;
  }
}
</style>
