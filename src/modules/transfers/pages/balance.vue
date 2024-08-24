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
    :pagingData="tablePaging"
    :pageKeys="{ green: 'Inflow', red: 'Outflow' }"
    @searchEntered="processSearchEntry"
    @filterSelected="processFilterSelection"
  >
    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="tableBody"
      :isLoading="isLoading"
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
import { ref, reactive, onMounted } from "vue";
import { useString } from "@/shared/composables/useString";
import { useTransferStore } from "@/modules/transfers/store/";
import useDate from "@/shared/composables/useDate";
import useEvents from "@/shared/composables/useEvents";
import { TableHeaderType } from "@/models/dashboard-type";
import PageContentWrapper from "@/shared/components/global-comps/page-content-wrapper.vue";
import TableContainer from "@/shared/components/table-comps/table-container.vue";
import TableContainerBody from "@/shared/components/table-comps/table-container-body.vue";
import BalanceOverview from "@/modules/transfers/components/balance-overview.vue";

const {
  getBoldTableText,
  transactionFlowIcon,
  capitalizeFirstLetter,
  formatNumber,
} = useString();

const { getBalanceHistory } = useTransferStore();
const { processAPIRequest } = useEvents();

const isLoading = ref<boolean>(true);

const tableHeader = ref<TableHeaderType[]>([
  { title: "", slug: "status" },
  { title: "Date", slug: "date_created" },
  { title: "Transaction Summary", slug: "summary" },
  { title: "Balance Before", slug: "balance_before" },
  { title: "Change", slug: "change" },
  { title: "Balance After", slug: "balance_after" },
]);

const tableBody = reactive<any[]>([]);
const tablePaging = ref<any>({});

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

const getTransactionDate = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const fetchBalanceHistory = async () => {
  const response = await processAPIRequest({
    action: getBalanceHistory,
    payload: {},
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    response.data.map((data: any) => {
      tableBody.push({
        status: transactionFlowIcon("receive"),
        date_created: getTransactionDate(data.balance_at),
        summary: capitalizeFirstLetter(data.action.split("-").join(" ")),
        balance_before: `ZMW ${formatNumber(data.balance_before)}`,
        change: getBoldTableText(`ZMW ${formatNumber(data.amount)}`),
        balance_after: `ZMW ${formatNumber(data.balance_after)}`,
      });
    });

    tablePaging.value = response.pagination[0];
  }
};

onMounted(() => {
  fetchBalanceHistory();
});
</script>

<style lang="scss" scoped>
.balance-area {
  @apply mb-8;
}
</style>
