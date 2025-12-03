<template>
  <PageContentWrapper
    searchInputPlaceholder="Search by customer email"
    :filterActiveValue="activePeriod"
    :showFilterSelection="true"
    pageDescription="All customers"
    :pagingData="tablePaging"
    :pageKeys="{ green: 'Active', red: 'Blacklisted' }"
    :hasPayload="true"
    :showCustomActionBtn="false"
    @searchEntered="processSearchEntry"
    @filterSelected="processFilterSelection"
     @updatePage="(currentPage) => (page = currentPage)"  
  >
    <div
      class="flex items-center gap-4 mb-4"
      v-if="!isLoading"
    >
      <div class="relative">
        <select
          v-model="selectedStatus"
          class="p-4 text-sm font-semibold text-teal-800 border rounded-md appearance-none cursor-pointer w-36 focus:outline-none"
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
import { ref, onMounted, h, watch } from "vue";
import { useString } from "@/shared/composables/useString";
import { TableHeaderType } from "@/models/dashboard-type";
import { usePaymentStore } from "../store";
import useDate from "@/shared/composables/useDate";
import useEvents from "@/shared/composables/useEvents";
import PageContentWrapper from "@/shared/components/global-comps/page-content-wrapper.vue";
import TableContainer from "@/shared/components/table-comps/table-container.vue";
import TableContainerBody from "@/shared/components/table-comps/table-container-body.vue";
import TableDoubleColumn from "@/shared/components/table-comps/table-double-column.vue";
import { computed } from "vue";

const { getStatus, notAvailable } = useString();

const { getCustomers } = usePaymentStore();
const { processAPIRequest } = useEvents();

const selectedStatus = ref("");
const isLoading = ref<boolean>(true);

const tableBody = ref<any[]>([]);
const tablePaging = ref<any>({});
const searchQuery = ref<string>("");
const activePeriod = ref<[Date, Date] | null>(null);
const page = ref<number>(1);

const tableHeader = ref<TableHeaderType[]>([
  { title: "Added On", slug: "date_created" },
  { title: "Full Name", slug: "full_name" },
  { title: "Customer Email", slug: "customer_email" },
{ title: "Phone Number", slug: "phone_number" },
  { title: "Status", slug: "status" },
]);

const statusOptions = ["Active", "Blacklisted"];

const filters = computed(
  () =>
    `?page=${page.value}&status=${selectedStatus.value}&from=${activePeriod.value ? activePeriod.value[0].toISOString().split("T")[0] : ""}&to=${activePeriod.value ? activePeriod.value[1].toISOString().split("T")[0] : ""}`
);

const processSearchEntry = (searchValue: string) => {
  searchQuery.value = searchValue.toLocaleLowerCase().trim();
};

const getDateAdded = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const fetchCustomers = async (filters: string) => {
   tablePaging.value.current_page = page.value;
  const response = await processAPIRequest({
    action: getCustomers,
    payload: {filters, page: page.value},
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    tableBody.value = response.data.map((data: any) => {
      const customerName = data.customer
        ? `${data.customer.firstname} ${data.customer.lastname}`
        : "No customer info";
      const customerEmail = data.customer ? data.customer.email : "";
      const createdDate = new Date(Date.parse(data.created_at));

      return {
        date_created: h(TableDoubleColumn, {
          entry: {
            primaryText: getDateAdded(data.created_at),
            secondaryText: useDate.formatTime(data.created_at),
          },
        }),
        full_name: `${data.firstname} ${data.lastname}`,
        customer_email: data.email,
        phone_number: data.phone_number
          ? "+" + data.phone_number
          : notAvailable("No phone number"),
        status: getStatus(
          data.blacklisted ? "danger" : "success",
          data.blacklisted ? "Blacklisted" : "Active"
        ),
        raw: {
          customer_details: `${customerName} (${customerEmail})`,
          raw_date: createdDate,
          status: data.blacklisted ? "blacklisted" : "active",
        },
      };
    });

    tablePaging.value = response.pagination[0] || {};
  }
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



watch(activePeriod, () => {
  page.value = 1;
});

watch(filters, (newFilters) => {
  fetchCustomers(newFilters);
});

onMounted(fetchCustomers);
</script>

<style lang="scss" scoped></style>
