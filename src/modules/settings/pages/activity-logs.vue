<template>
  <PageContentWrapper
    searchInputPlaceholder="Search activity logs"
    :filterActiveValue="activePeriod"
    :filterListValue="periodList"
    pageDescription="All logged activities"
    :pagingData="tablePaging"
    :pageKeys="{ green: 'Successful logs' }"
    @searchEntered="processSearchEntry"
    @filterSelected="processFilterSelection"
  >
    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="tableBody"
      :isLoading="isLoading"
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
import { ref, onMounted, reactive } from "vue";
import { useString } from "@/shared/composables/useString";
import { TableHeaderType } from "@/models/dashboard-type";
import { useSettingsStore } from "../store";
import useEvents from "@/shared/composables/useEvents";
import PageContentWrapper from "@/shared/components/global-comps/page-content-wrapper.vue";
import TableContainer from "@/shared/components/table-comps/table-container.vue";
import TableContainerBody from "@/shared/components/table-comps/table-container-body.vue";

const { getStatus, notAvailable, getActionBtn } = useString();

const { getAuditLogs } = useSettingsStore();
const { processAPIRequest } = useEvents();

const isLoading = ref<boolean>(true);

const tableHeader = ref<TableHeaderType[]>([
  { title: "", slug: "status" },
  { title: "Time Logged", slug: "date_created" },
  { title: "Initiated By", slug: "initiated_by" },
  { title: "Action Type", slug: "action_type" },
  { title: "Activity", slug: "activity" },
  { title: "Action", slug: "action" },
]);

const tableBody = reactive<any[]>([]);
const tablePaging = ref<any>({});

// const tableBody = [
//   {
//     status: getStatus("success"),
//     date_created: "22nd July, 2024 - 02:24 PM",
//     initiated_by: "Efemena Elvis",
//     action_type: "Refund",
//     activity: "Initiated a customer refund",
//     action: getActionBtn("View Refund"),
//   },
//   {
//     status: getStatus("success"),
//     date_created: "24th July, 2024 - 12:41 PM",
//     initiated_by: "Efemena Elvis",
//     action_type: "Customer",
//     activity: "Added a new customer",
//     action: getActionBtn("View Customer"),
//   },
//   {
//     status: getStatus("success"),
//     date_created: "21st June, 2024 - 10:48 AM",
//     initiated_by: "Efemena Elvis",
//     action_type: "Compliance",
//     activity: "Updated business profile",
//     action: notAvailable("No action available"),
//   },
// ];

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

const fetchAuditLogs = async () => {
  const response = await processAPIRequest({
    action: getAuditLogs,
    payload: {},
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    response.data.map((data: any) => {
      tableBody.push({
        status: getStatus("success"),
        date_created: data.timestamp,
        initiated_by: data.user_id,
        action_type: "Compliance",
        activity: data.activity,
        action: notAvailable("No action available"),
      });
    });

    tablePaging.value = response.pagination[0];
  }
};

onMounted(() => {
  fetchAuditLogs();
});
</script>

<style lang="scss" scoped></style>
