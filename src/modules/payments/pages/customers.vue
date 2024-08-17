<template>
  <PageContentWrapper
    searchInputPlaceholder="Search by customer email"
    :showFilterSelection="false"
    pageDescription="All customers"
    :pageCount="10"
    :pageKeys="{ green: 'Active', red: 'Blacklisted' }"
    @searchEntered="processSearchEntry"
    @filterSelected="processFilterSelection"
  >
    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="tableBody"
      :emptyData="{
        title: 'No customers yet',
        description:
          'We haven\'t collected payment from any customer on this account yet. This is where you\'ll be able to see all customers you\'ve collected payment from',
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
import { ref } from "vue";
import { useString } from "@/shared/composables/useString";
import { TableHeaderType } from "@/models/dashboard-type";
import PageContentWrapper from "@/shared/components/global-comps/page-content-wrapper.vue";
import TableContainer from "@/shared/components/table-comps/table-container.vue";
import TableContainerBody from "@/shared/components/table-comps/table-container-body.vue";

const { getStatus } = useString();

const tableHeader = ref<TableHeaderType[]>([
  { title: "", slug: "status" },
  { title: "Added On", slug: "date_created" },
  { title: "Customer Email", slug: "customer_email" },
  { title: "Full Name", slug: "full_name" },
  { title: "Phone Number", slug: "phone_number" },
]);

const tableBody: [] = [
  // {
  //   status: getStatus("success"),
  //   date_created: "22nd July, 2024",
  //   customer_email: "elvis@vesicash.com",
  //   full_name: "Efemena Elvis",
  //   phone_number: "+234 813 117 7703",
  // },
  // {
  //   status: getStatus("success"),
  //   date_created: "26th July, 2024",
  //   customer_email: "oluwasegun@gmail.com",
  //   full_name: "Oluwasegun Joseph",
  //   phone_number: "+234 803 440 8121",
  // },
];

const processSearchEntry = (searchValue: string) => {
  console.log("SEARCH VALUE", searchValue);
};

const processFilterSelection = (selectedPeriod: string) => {
  console.log("FILTERING BY PERIOD", selectedPeriod);
};
</script>

<style lang="scss" scoped></style>
