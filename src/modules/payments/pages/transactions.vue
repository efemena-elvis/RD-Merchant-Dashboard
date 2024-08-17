<template>
  <PageContentWrapper
    searchInputPlaceholder="Search transaction"
    :filterActiveValue="activePeriod"
    :filterListValue="periodList"
    pageDescription="All transactions"
    :pageCount="15"
    :pageKeys="{ green: 'Successful', yellow: 'Pending', red: 'Failed' }"
    @searchEntered="processSearchEntry"
    @filterSelected="processFilterSelection"
  >
    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="tableBody"
      :emptyData="{
        title: 'No transaction yet',
        description:
          'We haven\'t received any payment on this account yet. This is where you\'ll be able to see all your collected transactions',
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

const { getBoldTableText, getStatus } = useString();

const tableHeader = ref<TableHeaderType[]>([
  { title: "", slug: "status" },
  { title: "Paid On", slug: "date_created" },
  { title: "Amount Paid", slug: "amount" },
  { title: "Customer", slug: "customer" },
  { title: "Payment Reference", slug: "reference_id" },
  { title: "Type", slug: "type_of_transaction" },
  { title: "Payment Mode", slug: "payment_mode" },
]);

const tableBody: any[] = [
  // {
  //   status: getStatus("success"),
  //   date_created: "Tue, 22nd July, 2024",
  //   amount: getBoldTableText("ZMW 5,600"),
  //   customer: "Efemena Elvis",
  //   reference_id: "#bbd21047-1c00-2191",
  //   type_of_transaction: "Collection",
  //   payment_mode: "MTNMoney",
  // },
  // {
  //   status: getStatus("failed"),
  //   date_created: "Wed, 26th July, 2024",
  //   amount: getBoldTableText("ZMW 4,500"),
  //   customer: "OluwaFunmi Joseph",
  //   reference_id: "#ccd21047-2459-0121",
  //   type_of_transaction: "Collection",
  //   payment_mode: "AirtelMoney",
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
