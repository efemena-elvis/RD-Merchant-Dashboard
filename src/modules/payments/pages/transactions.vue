<template>
  <PageContentWrapper
    searchInputPlaceholder="Search transaction by reference id"
    :filterActiveValue="activePeriod"
    pageDescription="All transactions"
    :pagingData="tablePaging"
    :hasPayload="tableBody.length > 0"
    :pageKeys="{ green: 'Successful', yellow: 'Pending', red: 'Failed' }"
    :showCustomActionBtn="true"
    :customActionBtnText="'Export'"
    @customActionBtnClicked="exportToExcel"
    @searchEntered="processSearchEntry"
    @filterSelected="processFilterSelection"
  >
    <div
      class="flex items-center gap-4 mb-4"
      v-if="tableBody.length > 0 && !isLoading"
    >
      <div class="relative w-52">
        <select
          v-model="selectedMethod"
          class="w-52 p-4 text-sm font-semibold text-teal-800 border rounded-md appearance-none cursor-pointer focus:outline-none"
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
      ></TableContainerBody>
    </TableContainer>
  </PageContentWrapper>
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

const { getStatus, capitalizeFirstLetter, formatNumber } = useString();
const { getTransactions } = usePaymentStore();
const { processAPIRequest } = useEvents();

const isLoading = ref(true);
const selectedMethod = ref("");
const selectedStatus = ref("");
const tableBody = ref<any[]>([]);
const tablePaging = ref<any>({});
const searchQuery = ref<string>("")

const activePeriod = ref<[Date, Date] | null>(null);

const statusOptions = ["Successful", "Pending", "Failed"];
const paymentMethods = ["Card", "Mobilemoney"];

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

const filteredTableBody = computed(() => {
  return tableBody.value.filter((tx) => {
    const method = tx.raw?.payment_details;
    const status = tx.raw?.status;
    const rawDate = tx.raw?.raw_date ? new Date(tx.raw?.raw_date) : null;

    const matchesMethod = selectedMethod.value
      ? method === selectedMethod.value
      : true;

    const matchesStatus = selectedStatus.value
      ? status === selectedStatus.value
      : true;

    const matchesDate = rawDate
      ? isWithinRange(rawDate, activePeriod.value)
      : true;

    const matchesSearch =
      !searchQuery.value ||
      tx.reference.toLowerCase().includes(searchQuery.value);
      
    return matchesMethod && matchesStatus && matchesDate && matchesSearch;
  });
});

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
  searchQuery.value = searchValue.trim();
};

const fetchPaymentTransactions = async () => {
  const response = await processAPIRequest({
    action: getTransactions,
    payload: {},
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
      const customerName = data.customer
        ? `${data.customer.firstname ?? ""} ${data.customer.lastname ?? ""}`.trim()
        : "No customer info";
      const customerEmail = data.customer?.email ?? "";
    

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
            primaryText: capitalizeFirstLetter(data.method ?? "-"),
            secondaryText: `Type: ${
              data.redirect_url?.startsWith("https://store.redstonepgs.com/")
                ? "Storefront"
                : "Third party"
            }`,
          },
        }),
        status: getStatus(data.status ?? "-", data.status ?? "-"),
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
  XLSX.writeFile(workbook, "Merchant_Transactions.xlsx");
};

onMounted(() => {
  fetchPaymentTransactions();
});
</script>

<style lang="scss" scoped>

</style>
