<template>
  <PageContentWrapper
    searchInputPlaceholder="Search by refund reference id"
    :filterActiveValue="activePeriod"
    :filterListValue="periodList"
    pageDescription="All requested refunds"
    :pageCount="10"
    :pageKeys="{ green: 'Refunded', yellow: 'Pending', red: 'Declined' }"
    @searchEntered="processSearchEntry"
    @filterSelected="processFilterSelection"
  >
    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="tableBody"
      :emptyData="{
        title: 'No refund request',
        description:
          'We haven\'t received any refund request on this account. This is where you\'ll be able to see all initiated refund requests',
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
  { title: "Date Initiated", slug: "date_initiated" },
  { title: "Refund Amount", slug: "refund_amount" },
  { title: "Customer Name", slug: "customer_name" },
  { title: "Customer Email", slug: "customer_email" },
  { title: "Refund Status", slug: "refund_status" },
  { title: "Refunded On", slug: "date_refunded" },
]);

const tableBody: [] = [
  // {
  //   status: getStatus("success"),
  //   date_initiated: "24th July, 2024",
  //   refund_amount: getBoldTableText("ZMW 4,200"),
  //   customer_name: "Efemena Elvis",
  //   customer_email: "elvis@vesicash.com",
  //   refund_status: "Refunded",
  //   date_refunded: "Wed, 26th July, 2024",
  // },
  // {
  //   status: getStatus("pending"),
  //   date_initiated: "23rd July, 2024",
  //   refund_amount: getBoldTableText("ZMW 2,400"),
  //   customer_name: "Micheal Samuel",
  //   customer_email: "micheal@gmail.com",
  //   refund_status: "Processed",
  //   date_refunded: notAvailable("Refund pending"),
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
