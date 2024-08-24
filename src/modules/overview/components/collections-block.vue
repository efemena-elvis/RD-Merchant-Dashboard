<template>
  <div class="transaction-card">
    <div class="top-row">
      <!-- TITLE ROW -->
      <div class="title-row">
        <div class="text">Top Weekly Collections</div>
        <div class="description">View your top business week collections</div>
      </div>

      <!-- FILTER ROW -->
      <OverviewFilter :activePeriod="activePeriod" :periodList="periodList" />
    </div>

    <div class="bottom-row">
      <TableContainer :tableHeader="tableHeader" :tableBody="tableBody">
        <TableContainerBody
          v-for="(payload, index) in tableBody"
          :key="index"
          :tableHeader="tableHeader"
          :tableData="payload"
        />
      </TableContainer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { TableHeaderType } from "@/models/dashboard-type";
import OverviewFilter from "@/modules/overview/components/overview-filter.vue";
import TableContainer from "@/shared/components/table-comps/table-container.vue";
import TableContainerBody from "@/shared/components/table-comps/table-container-body.vue";

const activePeriod = ref<string>("This week");
const periodList = ref<string[]>(["This week", "Last week", "2 weeks ago"]);

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date", slug: "date_created" },
  { title: "Customer", slug: "cuatomer" },
  { title: "Customer ID", slug: "customer_id" },
  { title: "Amount", slug: "amount" },
  { title: "Account No", slug: "account_no" },
  { title: "Type", slug: "type_of_transaction" },
  { title: "Payment Mode", slug: "payment_mode" },
]);

const tableBody = [
  {
    date_created: "2nd Aug, 2024",
    cuatomer: "Efemena Elvis",
    customer_id: "#bbd21047-1c00",
    amount: "ZMW 5,600",
    account_no: "260760137434",
    type_of_transaction: "Collection",
    payment_mode: "MTNMoney",
  },
  {
    date_created: "3rd Aug, 2024",
    cuatomer: "OluwaFunmi Joseph",
    customer_id: "#ccd21047-2459",
    amount: "ZMW 4,500",
    account_no: "260978981417",
    type_of_transaction: "Collection",
    payment_mode: "AirtelMoney",
  },
];
</script>

<style lang="scss" scoped>
.transaction-card {
  @apply w-full h-full bg-neutral-10 rounded-lg border border-grey-200/50 p-5 shadow-lg shadow-grey-200/40 flex flex-col justify-between items-start gap-y-9;

  .top-row {
    @apply flex justify-between items-start gap-x-4 w-full;

    .title-row {
      @apply flex flex-col justify-start items-start gap-y-0.5;

      .text {
        @apply font-semibold text-[16.5px] text-teal-800/85;
      }

      .description {
        @apply text-[13.5px] text-grey-500;
      }
    }
  }

  .bottom-row {
    @apply w-full;
  }
}
</style>
