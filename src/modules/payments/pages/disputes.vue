<template>
  <PageContentWrapper
    searchInputPlaceholder="Search by payment reference"
    :filterActiveValue="activePeriod"
    :filterListValue="periodList"
    pageDescription="All reported disputes"
    :pageCount="8"
    :pageKeys="{ green: 'Resolved', yellow: 'Under review', red: 'Declined' }"
    @searchEntered="processSearchEntry"
    @filterSelected="processFilterSelection"
  >
    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="tableBody"
      :emptyData="{
        title: 'No dispute reported yet',
        description:
          'Disputes payments will appear here, along with the dispute category. When you receive a dispute, you can decide whether to respond with evidence or accept the dispute.',
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
  { title: "Raised On", slug: "date_created" },
  { title: "Payment Reference", slug: "reference_id" },
  { title: "Dispute Amount", slug: "dispute_amount" },
  { title: "Category", slug: "dispute_category" },
  { title: "Status", slug: "dispute_status" },
  { title: "Resolution", slug: "dispute_resolution" },
]);

const tableBody: any[] = [
  // {
  //   status: getStatus("success"),
  //   date_created: "Tue, 22nd July, 2024",
  //   reference_id: "#bbd21047-1c00-2191",
  //   dispute_amount: getBoldTableText("ZMW 3,600"),
  //   dispute_category: "Fraud",
  //   dispute_status: "Resolved",
  //   dispute_resolution: "Customer Refunded",
  // },
  // {
  //   status: getStatus("pending"),
  //   date_created: "Wed, 26th July, 2024",
  //   reference_id: "#ccd21047-2459-0121",
  //   dispute_amount: getBoldTableText("ZMW 2,200"),
  //   dispute_category: "Chargeback",
  //   dispute_status: "Awaiting Feedback",
  //   dispute_resolution: notAvailable("Pending resolution"),
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
