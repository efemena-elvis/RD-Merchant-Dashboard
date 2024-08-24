<template>
  <PageContentWrapper
    searchInputPlaceholder="Search by payout reference id"
    :filterActiveValue="activePeriod"
    :filterListValue="periodList"
    pageDescription="All payouts"
    :pageCount="10"
    :pageKeys="{ green: 'Successful', yellow: 'Pending', red: 'Failed' }"
    @searchEntered="processSearchEntry"
    @filterSelected="processFilterSelection"
  >
    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="tableBody"
      :emptyData="{
        title: 'No payouts yet',
        description:
          'We haven\'t paid any money to this account. This is where you\'ll be able to see your scheduled payouts and the transactions you were paid for',
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

const { getBoldTableText, getStatus, notAvailable } = useString();

const tableHeader = ref<TableHeaderType[]>([
  { title: "", slug: "status" },
  { title: "Date Initiated", slug: "date_created" },
  { title: "Payout Reference", slug: "reference_id" },
  { title: "Payout Source", slug: "payout_source" },
  { title: "Requested Amount", slug: "requested_amount" },
  { title: "Amount Paid", slug: "amount_paid" },
]);

const tableBody: any[] = [
  // {
  //   status: getStatus("success"),
  //   date_created: "Tue, 22nd July, 2024",
  //   reference_id: "#bbd21047-1c00-2191",
  //   payout_source: "Redstone PGS Business ZM",
  //   requested_amount: getBoldTableText("ZMW 5,600"),
  //   amount_paid: getBoldTableText("ZMW 5,400"),
  // },
  // {
  //   status: getStatus("failed"),
  //   date_created: "Thur, 24th July, 2024",
  //   reference_id: "#thd21047-1c00-wq12",
  //   payout_source: "Redstone PGS Business ZM",
  //   requested_amount: getBoldTableText("ZMW 4,200"),
  //   amount_paid: notAvailable("Payout failed"),
  // },
  // {
  //   status: getStatus("pending"),
  //   date_created: "Mon, 21st June, 2024",
  //   reference_id: "#j1q21047-1c00-io1q",
  //   payout_source: "Redstone PGS Business ZM",
  //   requested_amount: getBoldTableText("ZMW 2,000"),
  //   amount_paid: notAvailable("Payout pending"),
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

<style lang="scss" scoped></style>
