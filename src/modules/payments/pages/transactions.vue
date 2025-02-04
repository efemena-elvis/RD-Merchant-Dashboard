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
import { ref, onMounted, reactive, h } from "vue";
import { useString } from "@/shared/composables/useString";
import { TableHeaderType } from "@/models/dashboard-type";
import { usePaymentStore } from "../store";
import useDate from "@/shared/composables/useDate";
import useEvents from "@/shared/composables/useEvents";
import PageContentWrapper from "@/shared/components/global-comps/page-content-wrapper.vue";
import TableContainer from "@/shared/components/table-comps/table-container.vue";
import TableContainerBody from "@/shared/components/table-comps/table-container-body.vue";
import TableDoubleColumn from "@/shared/components/table-comps/table-double-column.vue";

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
  { title: "Created On", slug: "date_created" },
  { title: "Customer Details", slug: "customer_details" },
  { title: "Amount", slug: "amount" },
  { title: "Payment Method", slug: "payment_details" },
  { title: "Status", slug: "status" },
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
        date_created: getTransactionDate(data.created_at),
        customer_details: data.customer
          ? h(TableDoubleColumn, {
              entry: {
                primaryText: `${data.customer.firstname} ${data.customer.lastname}`,
                secondaryText: data.customer.email,
              },
            })
          : notAvailable("No customer info"),
        amount: h(TableDoubleColumn, {
          entry: {
            primaryText: `${data.currency} ${formatNumber(data.amount)}`,
            secondaryText: `Charge: ${data.currency} ${formatNumber(data.charge)}`,
          },
        }),
        payment_details: h(TableDoubleColumn, {
          entry: {
            primaryText: capitalizeFirstLetter(data.method),
            secondaryText: `Type: ${
              data.redirect_url.startsWith("https://store.redstonepgs.com/")
                ? "Storefront"
                : "Third party"
            }`,
          },
        }),
        status: getStatus(data.status, data.status),
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
