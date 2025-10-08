<template>
  <PageContentWrapper
    searchInputPlaceholder="Search transaction"
    :filterActiveValue="activePeriod"
    :filterListValue="periodList"
    pageDescription="All transactions"
    :pagingData="tablePaging"
    :hasPayload="tableBody.length > 0"
    :pageKeys="{ green: 'Successful', yellow: 'Pending', red: 'Failed' }"
    :showCustomActionBtn="false"
    @searchEntered="processSearchEntry"
    @filterSelected="processFilterSelection"
  >
    <!-- Filters -->
    <div v-if="!isLoading" class="flex justify-between items-center mb-4">
      <div class="flex gap-4 mb-4" >
        <select
          v-model="selectedMethod"
          class="p-4 text-sm border rounded-md cursor-pointer focus:outline-none text-teal-800 font-semibold"
        >
          <option value="">Payment Method</option>
          <option
            v-for="(method, index) in paymentMethods"
            :value="method"
            :key="index"
          >
            {{ method }}
          </option>
        </select>
        <select
          v-model="selectedStatus"
          class="p-4 text-sm border rounded-md cursor-pointer focus:outline-none text-teal-800 font-semibold"
        >
          <option value="">Status</option>
          <option
            v-for="(status, index) in statusOptions"
            :value="status"
            :key="index"
          >
            {{ status }}
          </option>
        </select>
      </div>
       <button @click="exportToExcel" class=" p-4 rounded-md w-[150px] hover:bg-grey-200 cursor-pointer border font-semibold text-teal-800">Export</button>
    </div>

   
    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="filteredTableBody"
      :isLoading="isLoading"
      :emptyData="{
        title: 'No transaction yet',
        description:
          'We haven\'t received any payment on this account yet. This is where you\'ll be able to see all your collected transactions',
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
import { ref, onMounted, computed, h } from "vue";
import { useString } from "@/shared/composables/useString";
import { TableHeaderType } from "@/models/dashboard-type";
import { usePaymentStore } from "../store";
import useDate from "@/shared/composables/useDate";
import useEvents from "@/shared/composables/useEvents";
import PageContentWrapper from "@/shared/components/global-comps/page-content-wrapper.vue";
import TableContainer from "@/shared/components/table-comps/table-container.vue";
import TableContainerBody from "@/shared/components/table-comps/table-container-body.vue";
import TableDoubleColumn from "@/shared/components/table-comps/table-double-column.vue";
import * as XLSX from "xlsx";

const { getStatus, capitalizeFirstLetter, formatNumber } = useString();
const { getTransactions } = usePaymentStore();
const { processAPIRequest } = useEvents();

const isLoading = ref(true);
const selectedMethod = ref("");
const selectedStatus = ref("");
const tableBody = ref<any[]>([]);
const tablePaging = ref<any>({});
const activePeriod = ref("All Time");

const statusOptions = ["Successful", "Failed"];
const paymentMethods = ["Card", "Mobilemoney"];
const periodList = ref(["Today", "Last 7 days", "This month", "Last month", "All time"]);

const tableHeader = ref<TableHeaderType[]>([
  { title: "Created On", slug: "date_created" },
  { title: "Customer Details", slug: "customer_details" },
  { title: "Amount", slug: "amount" },
  { title: "Payment Method", slug: "payment_details" },
  { title: "Status", slug: "status" },
  { title: "Transaction Reference", slug: "reference" },
]);

const getTransactionDate = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const normalize = (val: string) => val?.trim().toLowerCase() || "";

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


const filteredTableBody = computed(() => {
  return tableBody.value.filter((tx) => {
    const method = normalize(tx.raw?.payment_details);
    const status = normalize(tx.raw?.status);
    const rawDate = tx.raw?.raw_date ? new Date(tx.raw.raw_date) : null;

    const matchesMethod = selectedMethod.value
      ? method === normalize(selectedMethod.value)
      : true;

    const matchesStatus = selectedStatus.value
      ? status === normalize(selectedStatus.value)
      : true;

    const matchesDate = rawDate ? isWithinPeriod(rawDate, activePeriod.value) : true;

    return matchesMethod && matchesStatus && matchesDate;
  });
});

const processSearchEntry = (searchValue: string) => {
  console.log("SEARCH VALUE:", searchValue);
};


const processFilterSelection = (selectedPeriod: string) => {
  console.log("FILTERING BY PERIOD:", selectedPeriod);
  activePeriod.value = selectedPeriod;
};

const fetchPaymentTransactions = async () => {
  const response = await processAPIRequest({
    action: getTransactions,
    payload: {},
    showAlert: false,
  });

  isLoading.value = false;

  if (response?.code === 200) {
    tableBody.value = response.data.map((data: any) => {
      const formattedAmount = `${data.currency} ${formatNumber(data.amount)}`;
      const chargeAmount = `Charge: ${data.currency} ${formatNumber(data.charge)}`;
      const customerName = data.customer
        ? `${data.customer.firstname} ${data.customer.lastname}`
        : "No customer info";
      const customerEmail = data.customer ? data.customer.email : "";
      const createdDate = new Date(data.created_at);

      return {
        date_created: getTransactionDate(data.created_at),
        customer_details: h(TableDoubleColumn, {
          entry: { primaryText: customerName, secondaryText: customerEmail },
        }),
        amount: h(TableDoubleColumn, {
          entry: { primaryText: formattedAmount, secondaryText: chargeAmount },
        }),
        payment_details: h(TableDoubleColumn, {
          entry: {
            primaryText: capitalizeFirstLetter(data.method),
            secondaryText: `Type: ${
              data.redirect_url?.startsWith("https://store.redstonepgs.com/")
                ? "Storefront"
                : "Third party"
            }`,
          },
        }),
        status: getStatus(data.status, data.status),
        reference: data.reference,

        raw: {
          date_created: getTransactionDate(data.created_at),
          customer_details: `${customerName} (${customerEmail})`,
          amount: `${formattedAmount} (${chargeAmount})`,
          payment_details: capitalizeFirstLetter(data.method),
          status: data.status,
          reference: data.reference,
          raw_date: createdDate,
        },
      };
    });

    tablePaging.value = response.pagination?.[0] || {};
  }
};


const exportToExcel = () => {
  const dataToExport = filteredTableBody.value.map((tx) => tx.raw);
  const cleanData = dataToExport.map((tx) => ({
    "Date Created": tx.date_created,
    "Customer Details": tx.customer_details || "-",
    Amount: tx.amount || "-",
    "Payment Method": tx.payment_details,
    Status: tx.status,
    Reference: tx.reference,
  }));

  const worksheet = XLSX.utils.json_to_sheet(cleanData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Merchant Transactions");
  XLSX.writeFile(workbook, "transactions.xlsx");
};

onMounted(() => {
  fetchPaymentTransactions();
});
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
}
.gap-4 {
  gap: 1rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
</style>
 