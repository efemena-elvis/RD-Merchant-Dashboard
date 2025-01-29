<template>
  <PageContentWrapper
    searchInputPlaceholder="Search transaction"
    :filterActiveValue="activePeriod"
    :filterListValue="periodList"
    pageDescription="All transactions"
    :pagingData="tablePaging"
    :pageKeys="{ green: 'Successful', yellow: 'Pending', red: 'Failed' }"
    @searchEntered="processSearchEntry"
    @filterSelected="processFilterSelection"
  >
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

const isLoading = ref<boolean>(true);

const tableHeader = ref<TableHeaderType[]>([
  { title: "", slug: "status" },
  { title: "Created On", slug: "date_created" },
  { title: "Amount", slug: "amount" },
  { title: "Customer", slug: "customer" },
  { title: "Reference", slug: "reference_id" },
  // { title: "Type", slug: "type_of_transaction" },
  { title: "Payment Mode", slug: "payment_mode" },
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

const fetchPaymentTransactions = async () => {
  const response = await processAPIRequest({
    action: getTransactions,
    payload: {},
    showAlert: false,
  });

  isLoading.value = false;

  if (response?.code === 200) {
    response.data.map((data: any) => {
      tableBody.push({
        status: getStatus(data.status),
        date_created: getTransactionDate(data.created_at),
        amount: getBoldTableText(
          `${data.currency} ${formatNumber(data.amount)}`
        ),
        customer: data.customer
          ? `${data.customer.firstname} ${data.customer.lastname}`
          : notAvailable("No customer info"),
        reference_id: data.reference,
        // type_of_transaction: capitalizeFirstLetter(data.type),
        payment_mode: capitalizeFirstLetter(data.method),
      });
    });

    tablePaging.value = response.pagination[0];
  }
};

onMounted(() => {
  fetchPaymentTransactions();
});
</script>

<style lang="scss" scoped></style>
