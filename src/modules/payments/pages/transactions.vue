<template>
  <PageContentWrapper
    searchInputPlaceholder="Search transaction by reference id"
    :filterActiveValue="activePeriod"
    pageDescription="All transactions"
    :pagingData="tablePaging"
    :hasPayload="true"
    :pageKeys="{ green: 'Successful', yellow: 'Pending', red: 'Failed' }"
    :showCustomActionBtn="true"
    :customActionBtnText="'Export'"
    @customActionBtnClicked="exportToExcel"
    @searchEntered="processSearchEntry"
    @filterSelected="processFilterSelection"
    @updatePage="(currentPage) => (page = currentPage)"
  >
    <div
      class="flex items-center gap-4 mb-4"
      v-if="!isLoading"
    >
      <div class="relative w-52">
        <select
          v-model="selectedMethod"
          class="p-4 text-sm font-semibold text-teal-800 border rounded-md appearance-none cursor-pointer w-52 focus:outline-none"
        >
          <option value="">Payment Method</option>
          <option
            v-for="(method, index) in paymentMethods"
            :value="method.toLowerCase()"
            :key="index"
          >
            {{ method }}
          </option>
        </select>
        <div
          class="absolute text-[16px] text-teal-800 -translate-y-1/2 pointer-events-none icon icon-caret-down right-4 top-1/2"
        ></div>
      </div>

      <div class="relative w-44">
        <select
          v-model="selectedStatus"
          class="p-4 text-sm font-semibold text-teal-800 border rounded-md appearance-none cursor-pointer w-44 focus:outline-none"
        >
          <option value="">Status</option>
          <option
            v-for="(status, index) in statusOptions"
            :value="status.toLowerCase()"
            :key="index"
          >
            {{ status }}
          </option>
        </select>
        <div
          class="absolute text-[16px] text-teal-800 -translate-y-1/2 pointer-events-none icon icon-caret-down right-4 top-1/2"
        ></div>
      </div>
    </div>

    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="tableBody"
      :isLoading="isLoading"
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
        :on-table-clicked="() => openTransactionLog(payload)"
      ></TableContainerBody>
    </TableContainer>
  </PageContentWrapper>
  <teleport to="body" v-if="showTransactionDetailsModal">
    <TransactionDetailsModal
      @closeTriggered="toggleTransactionDetailsModal"
      :transaction="selectedTransaction"
    />
  </teleport>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, h, watch } from "vue";
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
import TransactionDetailsModal from "../modals/transaction-details-modal.vue";

const { getStatus, capitalizeFirstLetter, formatNumber } = useString();
const { getTransactions, getAllTransactions } = usePaymentStore();
const { processAPIRequest } = useEvents();

const isLoading = ref(true);
const selectedMethod = ref("");
const selectedStatus = ref("");
const tableBody = ref<any[]>([]);
const tablePaging = ref<any>({});
const searchQuery = ref<string>("");
const page = ref(1);

const activePeriod = ref<[Date, Date] | null>(null);
const selectedTransaction = ref(null);

const statusOptions = ["Successful", "Pending", "Failed"];
const paymentMethods = ["Card", "Mobilemoney"];
const showTransactionDetailsModal = ref(false);

const tableHeader = ref<TableHeaderType[]>([
  { title: "Created On", slug: "date_created" },
  { title: "Customer Details", slug: "customer_details" },
  { title: "Amount", slug: "amount" },
  { title: "Payment Method", slug: "payment_details" },
  { title: "Status", slug: "status" },
  { title: "Reason", slug: "reason_for_failure" },
  { title: "Transaction Reference", slug: "reference" },
]);

const filters = computed(
  () =>
`?page=${page.value}&method=${selectedMethod.value}&status=${selectedStatus.value}&from=${activePeriod.value ? activePeriod.value[0].toISOString().split("T")[0] : ""}&to=${activePeriod.value ? activePeriod.value[1].toISOString().split("T")[0] : ""}`
);

const openTransactionLog = (row: any) => {
  selectedTransaction.value = row.raw;
  toggleTransactionDetailsModal();
};

const toggleTransactionDetailsModal = () => {
  showTransactionDetailsModal.value = !showTransactionDetailsModal.value;
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

const processSearchEntry = (searchValue: string) => {
  searchQuery.value = searchValue.toLocaleLowerCase().trim();
};

const fetchPaymentTransactions = async (filters: string) => {
  isLoading.value = true;
  tablePaging.value.current_page = page;
  const response = await processAPIRequest({
    action: getTransactions,
    payload: { filters, page: page.value },
    showAlert: false,
  });

  isLoading.value = false;

  if (response?.code === 200 && Array.isArray(response.data)) {
    tableBody.value = response.data.map((data: any) => {
      const amountValue = data?.amount ?? 0;
      const chargeValue = data?.charge ?? 0;
      const currencyValue = data?.currency ?? "";

      const formattedAmount = `${formatNumber(amountValue)}`;
      const chargeAmount = `Charge: ${currencyValue} ${formatNumber(chargeValue)}`;
      const createdDate = new Date(Date.parse(data.created_at));
      const customerName = data.customer ? `${data.customer.firstname ?? ""} ${data.customer.lastname ?? ""}`.trim()
        : "No customer info";
      const customerEmail = data.customer?.email ?? "";

      return {
        date_created: h(TableDoubleColumn, {
          entry: {
            primaryText: getTransactionDate(data.created_at),
            secondaryText: useDate.formatTime(data.created_at),
          },
        }),
        customer_details: h(TableDoubleColumn, {
          entry: { primaryText: customerName, secondaryText: customerEmail },
        }),
        amount: h(TableDoubleColumn, {
          entry: { primaryText: `${currencyValue} ${formattedAmount}`, secondaryText: chargeAmount },
        }),
        payment_details: h(TableDoubleColumn, {
          entry: {
            primaryText: capitalizeFirstLetter(data.method ?? "-"),
            secondaryText: `Type: ${
              data.redirect_url?.startsWith("https://store.redstonepgs.com/")
                ? "Storefront"
                : "Third party"
            }`,
          },
        }),
        status: getStatus(data.status ?? "-", data.status ?? "-"),
        reason_for_failure: capitalizeFirstLetter(data.reason_for_failure.toLowerCase() || "-"),
        reference: data.reference ?? "-",
        raw: {
          raw_date: createdDate,
          customer_details: `${customerName} (${customerEmail})`,
          amount: formattedAmount,
          payment_details: capitalizeFirstLetter(data.method ?? "-"),
          status: data.status ?? "-",
          reference: data.reference ?? "-",
          date_created: getTransactionDate(data.created_at),
        },
      };
    });

    tablePaging.value = response.pagination?.[0] || {};
  } else {
    tableBody.value = [];
  }
};

const fetchAllTransactions = async () => {
  let page = 1;
  let all: any[] = [];
  let totalPages = 1;

  do {
    const response = await processAPIRequest({
      action: getAllTransactions,
      payload: { page },
      showAlert: false,
    });

    if (response?.code !== 200) break;

    const mapped = response.data.map((data: any) => {
      const customerName = data.customer ? `${data.customer.firstname} ${data.customer.lastname}` : "No customer info";
      const customerEmail = data.customer ? data.customer.email : "";

      return {
        date_created: `${getTransactionDate(data.created_at)} - ${useDate.formatTime(data.created_at)}`,
        raw_date: new Date(data.created_at),
        customer_details: `${customerName} (${customerEmail})`,
        amount: formatNumber(data.amount),
        payment_details: capitalizeFirstLetter(data.method),
        status: data.status,
        reason: capitalizeFirstLetter(data.reason_for_failure.toLowerCase() || "-"),
        reference: data.reference,
        currency: data.currency
      };
    });

    all.push(...mapped);

    totalPages = response.pagination[0]?.total_pages ?? 1;
    page++;

  } while (page <= totalPages);

  return all;
};


const exportToExcel = async () => {
  const allTransactions = await fetchAllTransactions();

  if (!allTransactions || allTransactions.length === 0) return;

  const filtered = allTransactions.filter((tx) => {
    const method = tx.payment_details.toLowerCase();
    const status = tx.status.toLowerCase();
    const date = tx.raw_date ? new Date(tx.raw_date) : null;

    const matchesMethod = selectedMethod.value ? method === selectedMethod.value.toLowerCase() : true;
    const matchesStatus = selectedStatus.value ? status === selectedStatus.value : true;
    const matchesDate = date ? isWithinRange(date, activePeriod.value) : true;

    return matchesMethod && matchesStatus && matchesDate;
  });

  const cleanData = filtered.map((tx) => ({
    "Date Created": tx.date_created,
    "Customer Details": tx.customer_details,
    Currency: tx.currency,
    Amount: tx.amount,
    "Payment Method": tx.payment_details,
    Status: tx.status,
    Reason: tx.reason,
    Reference: tx.reference,
 
  }));

  const worksheet = XLSX.utils.json_to_sheet(cleanData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
  XLSX.writeFile(workbook, "All_Merchant_Transactions.xlsx");
};


watch([selectedMethod, selectedStatus, activePeriod], () => {
  page.value = 1;
});

watch(filters, (newFilters) => {
  fetchPaymentTransactions(newFilters);
});

onMounted(fetchPaymentTransactions);
</script>

<style lang="scss" scoped></style>
