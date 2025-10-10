<template>
  <PageContentWrapper
    searchInputPlaceholder="Search by customer email"
    :filterActiveValue="activePeriod"
    :showFilterSelection="true"
    pageDescription="All customers"
    :pagingData="tablePaging"
    :pageKeys="{ green: 'Active', red: 'Blacklisted' }"
    :hasPayload="tableBody.length > 0"
    :showCustomActionBtn="false"
    @searchEntered="processSearchEntry"
    @filterSelected="processFilterSelection"
  >
    <div
      class="flex items-center gap-4 mb-4"
      v-if="tableBody.length > 0 && !isLoading"
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
      :tableBody="filteredTableBody"
      :isLoading="isLoading"
      :emptyData="{
        title: 'No customers yet',
        description:
          'We haven\'t collected payment from any customer on this account yet. This is where you\'ll be able to see all customers you\'ve collected payment from',
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

const tableHeader = ref<TableHeaderType[]>([
  { title: "Added On", slug: "date_created" },
  { title: "Full Name", slug: "full_name" },
  { title: "Customer Email", slug: "customer_email" },
  { title: "Phone Number", slug: "phone_number" },
  { title: "Status", slug: "status" },
]);

const statusOptions = ["Active", "Blacklisted"];

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
    const status = tx.raw?.status;
    const rawDate = tx.raw?.raw_date ? new Date(tx.raw.raw_date) : null;

    const matchesStatus = selectedStatus.value
      ? status === selectedStatus.value
      : true;

    const matchesDate = rawDate
      ? isWithinRange(rawDate, activePeriod.value)
      : true;

    const matchesSearch =
      !searchQuery.value ||
      tx.customer_email?.toLowerCase().includes(searchQuery.value);

    return matchesStatus && matchesDate && matchesSearch;
  });
});



const processSearchEntry = (searchValue: string) => {
  searchQuery.value = searchValue.trim();
};

const getDateAdded = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const fetchCustomers = async () => {
  const response = await processAPIRequest({
    action: getCustomers,
    payload: {},
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
        date_created: getDateAdded(data.created_at),
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

onMounted(() => {
  fetchCustomers();
});
</script>

<style lang="scss" scoped></style>
