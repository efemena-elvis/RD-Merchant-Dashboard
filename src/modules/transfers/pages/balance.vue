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
    pageDescription="Balance History"
     :filterActiveValue="activePeriod"
    :pagingData="tablePaging"
   :hasPayload="false"
    :pageKeys="{ green: 'Inflow',  red: 'Outflow' }"
    :showCustomActionBtn="false"
  >
   
    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="tableBody"
      :isLoading="isLoading"
      :emptyData="{
        title: 'No balance history yet',
        description:
          'You haven\'t performed any transaction at the moment. This is where you\'ll be able to see your balance history on all outflow and inflow.',
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
import { ref,  onMounted, h , watch, computed, reactive} from "vue";
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
import { usePaymentStore } from "@/modules/payments/store";

const {
  getBoldTableText,
  transactionFlowIcon,
  capitalizeFirstLetter,
  formatNumber,
  getStatus
} = useString();

const { getBalanceHistory, getTransactionStats } = useTransferStore();
const { getTransactions, getAllTransactions } = usePaymentStore();
const { processAPIRequest } = useEvents();
const isLoading = ref<boolean>(true);
const transactionStats = ref(null);
const activePeriod = ref<[Date, Date] | null>(null);

// const tableHeader = ref<TableHeaderType[]>([
//   { title: "Created On", slug: "date_created" },
//   { title: "Customer Details", slug: "customer_details" },
//   { title: "Amount", slug: "amount" },
//   { title: "Payment Method", slug: "payment_details" },
//   { title: "Status", slug: "status" },

// ]);

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
  isLoading.value = true;
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

// const fetchPaymentTransactions = async (page = 1) => {
//   tablePaging.value.current_page = page;
//   const response = await processAPIRequest({
//     action: getTransactions,
//     payload: { page },
//     showAlert: false,
//   });

//   isLoading.value = false;

//   if (response?.code === 200 && Array.isArray(response.data)) {
//     tableBody.value = response.data.map((data: any) => {
//       const amountValue = data?.amount ?? 0;
//       const chargeValue = data?.charge ?? 0;
//       const currencyValue = data?.currency ?? "";

//       const formattedAmount = `${formatNumber(amountValue)}`;
//       const chargeAmount = `Charge: ${currencyValue} ${formatNumber(chargeValue)}`;
//       const createdDate = new Date(Date.parse(data.created_at));
//       const customerName = data.customer ? `${data.customer.firstname ?? ""} ${data.customer.lastname ?? ""}`.trim()
//         : "No customer info";
//       const customerEmail = data.customer?.email ?? "";

//       return {
//         date_created: h(TableDoubleColumn, {
//           entry: {
//             primaryText: getTransactionDate(data.created_at),
//             secondaryText: useDate.formatTime(data.created_at),
//           },
//         }),
//         customer_details: h(TableDoubleColumn, {
//           entry: { primaryText: customerName, secondaryText: customerEmail },
//         }),
//         amount: h(TableDoubleColumn, {
//           entry: { primaryText: `${currencyValue} ${formattedAmount}`, secondaryText: chargeAmount },
//         }),
//         payment_details: h(TableDoubleColumn, {
//           entry: {
//             primaryText: capitalizeFirstLetter(data.method ?? "-"),
//             secondaryText: `Type: ${
//               data.redirect_url?.startsWith("https://store.redstonepgs.com/")
//                 ? "Storefront"
//                 : "Third party"
//             }`,
//           },
//         }),
//         status: getStatus(data.status ?? "-", data.status ?? "-"),
     
//       };
//     });

//     tablePaging.value = response.pagination?.[0] || {};
//   } else {
//     tableBody.value = [];
//   }
// };


onMounted(() => {
  fetchBalanceHistory();
   fetchTransactionStats();
  // fetchPaymentTransactions();
}
 );


</script>

<style lang="scss" scoped>
.balance-area {
  @apply mb-8;
}
</style>
