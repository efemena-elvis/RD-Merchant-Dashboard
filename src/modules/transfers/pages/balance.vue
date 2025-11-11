<template>
  <!-- BALANCE AREA -->
  <div class="balance-area">
    <BalanceOverview
      v-if="transactionStats"
      :transactionStats="transactionStats"
    />
  </div>

  <PageContentWrapper
    searchInputPlaceholder=""
    :showFilterSelection="false"
    pageDescription="Total balance history"
    :pagingData="tablePaging"
    :hasPayload="false"
    :pageKeys="{ green: 'Inflow', red: 'Outflow' }"
    :showCustomActionBtn="false"
    :fetchDataByPage="fetchBalanceHistory"
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
import { ref, reactive, onMounted, h } from "vue";
import { useString } from "@/shared/composables/useString";
import { useTransferStore } from "@/modules/transfers/store/";
import useDate from "@/shared/composables/useDate";
import useEvents from "@/shared/composables/useEvents";
import { TableHeaderType } from "@/models/dashboard-type";
import PageContentWrapper from "@/shared/components/global-comps/page-content-wrapper.vue";
import TableContainer from "@/shared/components/table-comps/table-container.vue";
import TableContainerBody from "@/shared/components/table-comps/table-container-body.vue";
import TableDoubleColumn from "@/shared/components/table-comps/table-double-column.vue";
import BalanceOverview from "@/modules/transfers/components/balance-overview.vue";

const {
  getBoldTableText,
  transactionFlowIcon,
  capitalizeFirstLetter,
  formatNumber,
} = useString();

const { getBalanceHistory, getTransactionStats } = useTransferStore();
const { processAPIRequest } = useEvents();
const isLoading = ref<boolean>(true);
const transactionStats = ref(null);

const tableHeader = ref<TableHeaderType[]>([
  { title: "", slug: "status" },
  { title: "Date Created", slug: "date_created" },
  { title: "Transaction Summary", slug: "summary" },
  { title: "Balance Before", slug: "balance_before" },
  { title: "Change", slug: "change" },
  { title: "Balance After", slug: "balance_after" },
  { title: "Reference", slug: "reference" },
]);

const tableBody = reactive<any[]>([]);
const tablePaging = ref<any>({});

const getTransactionDate = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};



const fetchBalanceHistory = async (page = 1) => {
  tablePaging.value.current_page = page;
  const response = await processAPIRequest({
    action: getBalanceHistory,
    payload: { page },
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
        date_created: h(TableDoubleColumn, {
          entry: {
            primaryText: getTransactionDate(data.balance_at),
            secondaryText: useDate.formatTime(data.balance_at),
          },
        }),
        summary: capitalizeFirstLetter(data.action.split("-").join(" ")),
        balance_before: `${data.currency_code} ${formatNumber(data.balance_before)}`,
        change: getBoldTableText(
          `${data.currency_code} ${formatNumber(data.amount)}`,
          data.type === "credit" ? "text-green-600" : "text-red-600"
        ),
        balance_after: `${data.currency_code} ${formatNumber(data.balance_after)}`,
        reference: data.reference,
      });
    });

    tablePaging.value = response.pagination[0];
  }
};

const fetchTransactionStats = async () => {
  const response = await processAPIRequest({
    action: getTransactionStats,
    payload: {},
    showAlert: false,
  });

  if (response.code === 200) {
    transactionStats.value = response.data;
  }
};

onMounted(() => {
  fetchBalanceHistory();
  fetchTransactionStats();
});
</script>

<style lang="scss" scoped>
.balance-area {
  @apply mb-8;
}
</style>
