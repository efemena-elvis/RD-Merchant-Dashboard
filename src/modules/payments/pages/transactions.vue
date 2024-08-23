<template>
  <PageContentWrapper
    searchInputPlaceholder="Search transaction"
    :filterActiveValue="activePeriod"
    :filterListValue="periodList"
    pageDescription="All transactions"
    :pageCount="15"
    :pageKeys="{ green: 'Successful', yellow: 'Pending', red: 'Failed' }"
    @searchEntered="processSearchEntry"
    @filterSelected="processFilterSelection"
  >
    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="tableBody"
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
      />
    </TableContainer>
  </PageContentWrapper>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import { useString } from "@/shared/composables/useString";
import { TableHeaderType } from "@/models/dashboard-type";
import { usePaymentStore } from "../store";
import useDate from "@/shared/composables/useDate";
import useEvents from "@/shared/composables/useEvents";
import PageContentWrapper from "@/shared/components/global-comps/page-content-wrapper.vue";
import TableContainer from "@/shared/components/table-comps/table-container.vue";
import TableContainerBody from "@/shared/components/table-comps/table-container-body.vue";

const {
  getBoldTableText,
  getStatus,
  notAvailable,
  capitalizeFirstLetter,
  formatNumber,
} = useString();

const { getTransactions } = usePaymentStore();
const { processAPIRequest } = useEvents();

const tableHeader = ref<TableHeaderType[]>([
  { title: "", slug: "status" },
  { title: "Created On", slug: "date_created" },
  { title: "Amount Paid", slug: "amount" },
  { title: "Customer", slug: "customer" },
  { title: "Payment Reference", slug: "reference_id" },
  { title: "Type", slug: "type_of_transaction" },
  { title: "Payment Mode", slug: "payment_mode" },
]);

const tableBody = reactive<any[]>([
  // {
  //   status: getStatus("success"),
  //   date_created: "Tue, 22nd July, 2024",
  //   amount: getBoldTableText("ZMW 5,600"),
  //   customer: "Efemena Elvis",
  //   reference_id: "#bbd21047-1c00-2191",
  //   type_of_transaction: "Collection",
  //   payment_mode: "MTNMoney",
  // },
]);

const emptyCustomer = ref<string>("00000000-0000-0000-0000-000000000000");

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

const fetchPaymentTransactions = async () => {
  const response = await processAPIRequest({
    action: getTransactions,
    payload: {},
    showAlert: false,
  });

  if (response.code === 200) {
    response.data.map((data: any) => {
      tableBody.push({
        status: getStatus(data.status),
        date_created: getTransactionDate(data.created_at),
        amount: getBoldTableText(
          `${data.currency} ${formatNumber(data.amount)}`
        ),
        customer:
          data.customer_id === emptyCustomer.value
            ? notAvailable("No customer")
            : data.customer_id,
        reference_id: data.reference,
        type_of_transaction: capitalizeFirstLetter(data.type),
        payment_mode: capitalizeFirstLetter(data.method),
      });
    });
  }
};

onMounted(() => {
  fetchPaymentTransactions();
});
</script>

<style lang="scss" scoped></style>
