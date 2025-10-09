<template>
  <!-- BALANCE AREA -->
  <div class="balance-area" v-if="false">
    <BalanceOverview />
  </div>

  <PageContentWrapper
    searchInputPlaceholder="Search by reference id"
    :filterActiveValue="activePeriod"
    :showFilterSelection="true"
    pageDescription="Total balance history"
    :pagingData="tablePaging"
    :hasPayload="tableBody.length > 0"
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
const activePeriod = ref<[Date, Date] | null>(null);
const isLoading = ref<boolean>(true);
const searchQuery = ref<string>("");

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



const processSearchEntry = (searchValue: string) => {
 searchQuery.value = searchValue.trim()
};


const getTransactionDate = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const normalizeDate = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const isWithinRange = (date: Date, range: [Date, Date] | null): boolean => {
  if (!range || !range[0] || !range[1]) return true;

  const start = normalizeDate(new Date(range[0]));
  const end = new Date(range[1]);
  end.setHours(23, 59, 59, 999); 

  const target = new Date(date);
  return target >= start && target <= end;
};


const processFilterSelection = (
  selectedRange: [Date | string, Date | string]
) => {
  if (selectedRange && selectedRange.length === 2) {
    const normalizedRange: [Date, Date] = [
      new Date(selectedRange[0]),
      new Date(selectedRange[1]),
    ];
    activePeriod.value = normalizedRange;
  } else {
    activePeriod.value = null;
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
        reference : data.reference
      });
    });

    tablePaging.value = response.pagination[0];
  }
};

const filteredTableBody = computed(() => {
  return tableBody.filter((tx) => {
    const rawDate = tx.raw_date ? new Date(tx.raw_date) : null;
    const matchesDate = rawDate ? isWithinRange(rawDate, activePeriod.value) : true;
    
     const matchesSearch =
      !searchQuery.value ||
      tx.reference.toLowerCase().includes(searchQuery.value);
      
    return matchesDate && matchesSearch;
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
