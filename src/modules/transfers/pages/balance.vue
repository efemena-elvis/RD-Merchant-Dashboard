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
    :hasPayload="filteredTableBody.length > 0"
    :pageKeys="{ green: 'Inflow', red: 'Outflow' }"
    :showCustomActionBtn="false"
    @searchEntered="processSearchEntry"
    @filterSelected="processFilterSelection"
  >
    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="filteredTableBody"
      :isLoading="isLoading"
      :emptyData="{
        title: 'No balance history yet',
        description:
          'You haven\'t performed any transaction at the moment. This is where you\'ll be able to see your balance history on all outflow and inflow payments',
      }"
    >
      <TableContainerBody
        v-for="(payload, index) in filteredTableBody"
        :key="index"
        :tableHeader="tableHeader"
        :tableData="payload"
      />
    </TableContainer>
  </PageContentWrapper>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from "vue";
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
  { title: "Date Created", slug: "date_created" },
  { title: "Transaction Summary", slug: "summary" },
  { title: "Balance Before", slug: "balance_before" },
  { title: "Change", slug: "change" },
  { title: "Balance After", slug: "balance_after" },
]);

const tableBody = reactive<any[]>([]);
const tablePaging = ref<any>({});

const activePeriod = ref<string>("All Time");
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
  activePeriod.value = selectedPeriod;
  console.log("FILTERING BY PERIOD", selectedPeriod);
};

const getTransactionDate = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const isWithinPeriod = (date: Date, period: string): boolean => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  switch (period) {
    case "Today":
      return date >= startOfToday;
    case "Last 7 days":
      return date >= sevenDaysAgo;
    case "This month":
      return date >= startOfMonth;
    case "Last month":
      return date >= startOfLastMonth && date <= endOfLastMonth;
    case "All time":
    default:
      return true;
  }
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
        raw_date: data.balance_at, 
        status: transactionFlowIcon(
          data.type === "credit" ? "receive" : "send"
        ),
        date_created: getTransactionDate(data.balance_at),
        summary: capitalizeFirstLetter(data.action.split("-").join(" ")),
        balance_before: `ZMW ${formatNumber(data.balance_before)}`,
        change: getBoldTableText(
          `ZMW ${formatNumber(data.amount)}`,
          data.type === "credit" ? "text-green-600" : "text-red-600"
        ),
        balance_after: `ZMW ${formatNumber(data.balance_after)}`,
      });
    });

    tablePaging.value = response.pagination[0];
  }
};

const filteredTableBody = computed(() => {
  return tableBody.filter((tx) => {
    const rawDate = tx.raw_date ? new Date(tx.raw_date) : null;
    const matchesDate = rawDate ? isWithinPeriod(rawDate, activePeriod.value) : true;
    return matchesDate;
  });
});

onMounted(() => {
  fetchBalanceHistory();
});
</script>

<style lang="scss" scoped>
.balance-area {
  @apply mb-8;
}
</style>
