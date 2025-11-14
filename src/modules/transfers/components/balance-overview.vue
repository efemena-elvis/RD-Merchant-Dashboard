<template>
  <div class="overview-card">
    <div class="bottom-row">
     

      <div class="column-wrapper">
          <div class = "flex flex-col gap-2">
            <p class = "text-teal-800 text-[16px] font-semibold"> All Transactions</p>
         
          <span class="text-[18px] font-semibold">{{ transactionStats?.total_transactions ||  0}}</span>
        </div>
        <!--
        <BalanceOverviewColumn
          title="Available Collection Balance"
          :amountList="[80, 220, 200]" 
        />
        -->
      </div>

      <div class="column-wrapper">
          <div class = "flex flex-col gap-2">
            <p class = "text-teal-800 text-[16px] font-semibold"> Successful Transactions</p>
         
          <span class="text-[18px] font-semibold">ZMW{{ formatNumber(transactionStats?.successful_transactions_value ?? 0) }} </span>
        </div>
       
      </div>


      <div class="column-wrapper">
          <div class = "flex flex-col gap-2">
            <p class = "text-teal-700 text-[16px] font-semibold"> Total Payouts</p>

          <span class="text-[18px] font-semibold">ZMW{{ formatNumber(transactionStats?.total_payouts_value ?? 0) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useString } from '@/shared/composables/useString';
// import BalanceOverviewColumn from "@/modules/transfers/components/balance-overview-column.vue";


const {formatNumber} = useString();

interface ITransactionStats {
  total_transactions: number;
  successful_transactions_value: number;
  failed_transactions: number;
  total_payouts_value: number;
}

const props = defineProps<{
  transactionStats: ITransactionStats | null;
}>();

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
