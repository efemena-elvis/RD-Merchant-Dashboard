<template>
  <!-- BALANCE AREA -->
  <div class="balance-area" v-if="false">
    <BalanceOverview />
  </div>

  <PageContentWrapper
    searchInputPlaceholder="Search by payment reference"
    :filterActiveValue="activePeriod"
    :filterListValue="periodList"
    pageDescription="Total balance history"
    :pageCount="10"
    :pageKeys="{ green: 'Inflow', red: 'Outflow' }"
    @searchEntered="processSearchEntry"
    @filterSelected="processFilterSelection"
  >
    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="tableBody"
      :emptyData="{
        title: 'No balance history yet',
        description:
          'You haven\'t performed any transaction at the moment. This is where you\'ll be able to see your balance history on all outflow and inflow payments',
      }"
    >
      <TableContainerBody
        v-for="(payload, index) in tableBody"
        :key="index"
        :tableHeader="tableHeader"
        :tableData="payload"
      />
    </TableContainer>
  </PageContentWrapper>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useString } from "@/shared/composables/useString";
import { TableHeaderType } from "@/models/dashboard-type";
import PageContentWrapper from "@/shared/components/global-comps/page-content-wrapper.vue";
import TableContainer from "@/shared/components/table-comps/table-container.vue";
import TableContainerBody from "@/shared/components/table-comps/table-container-body.vue";
import BalanceOverview from "@/modules/transfers/components/balance-overview.vue";

const { getBoldTableText, transactionFlowIcon } = useString();

const tableHeader = ref<TableHeaderType[]>([
  { title: "", slug: "status" },
  { title: "Date", slug: "date_created" },
  { title: "Transaction Summary", slug: "summary" },
  { title: "Balance Before", slug: "balance_before" },
  { title: "Change", slug: "change" },
  { title: "Balance After", slug: "balance_after" },
  { title: "Charge Fee", slug: "charge_fee" },
]);

const tableBody: any[] = [
  // {
  //   status: transactionFlowIcon("receive"),
  //   date_created: "Tue, 22nd July, 2024",
  //   summary: "Payment from Checkout",
  //   balance_before: "ZMW 5,600",
  //   change: getBoldTableText("ZMW 1,200"),
  //   balance_after: "ZMW 6,800",
  //   charge_fee: "ZMW 0.00",
  // },
  // {
  //   status: transactionFlowIcon("send"),
  //   date_created: "Tue, 22nd July, 2024",
  //   summary: "Payment from Checkout",
  //   balance_before: "ZMW 5,600",
  //   change: getBoldTableText("ZMW 1,200"),
  //   balance_after: "ZMW 6,800",
  //   charge_fee: "ZMW 0.00",
  // },
];

const activePeriod = ref<string>("This month");
const periodList = ref<string[]>([
  "Today",
  "Last 7 days",
  "This month",
  "Last month",
  "All time",
]);

const processSearchEntry = (searchValue: string) => {
  console.log("SEARCH VALUE", searchValue);
};

const processFilterSelection = (selectedPeriod: string) => {
  console.log("FILTERING BY PERIOD", selectedPeriod);
};
</script>

<style lang="scss" scoped>
.balance-area {
  @apply mb-8;
}
</style>
