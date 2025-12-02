<template>
  <PageContentWrapper
    searchInputPlaceholder="Search by payout reference id"
    :showFilterSelection="true"
    :filterActiveValue="activePeriod"
    pageDescription="All payouts"
    :pagingData="tablePaging"
    :pageKeys="{ green: 'Successful', yellow: 'Pending', red: 'Failed' }"
    :hasPayload="tableBody.length > 0"
    :showCustomActionBtn="true"
    :customActionBtnText="'Export'"
    @customActionBtnClicked="exportToExcel"
    @searchEntered="processSearchEntry"
    @filterSelected="processFilterSelection"
    :fetchDataByPage="fetchPayouts"
  >
    <div
      class="flex items-center justify-between mb-4"
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
<!-- 
      <div class="">
        <button
          @click="toggleInitiatePayoutModal"
          class="p-3 rounded-md btn-primary"
        >
          Initiate a Payout
        </button>
      </div> -->
      
    </div>

    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="filteredTableBody"
      :isLoading="isLoading"
      :emptyData="{
        title: 'No payout initiated yet',
        description:
          'You haven\'t initiated any payout yet. This is where you\'ll be able to see all your  initiated payout transactions',
    
      }"
      @onActionClicked="toggleInitiatePayoutModal"
    >
      <TableContainerBody
        v-for="(payload, index) in filteredTableBody"
        :key="index"
        :tableHeader="tableHeader"
        :tableData="payload"
      />
    </TableContainer>
  </PageContentWrapper>

  <teleport to="body" v-if="showInitiatePayoutModal">
    <InitiatePayoutModal
      @closeTriggered="toggleInitiatePayoutModal"
      @reloadPayouts="fetchPayouts"
    />
  </teleport>
</template>

<script lang="ts" setup>
import { computed, ref, h } from "vue";
import { useString } from "@/shared/composables/useString";
import { TableHeaderType } from "@/models/dashboard-type";
import { usePaymentStore } from "../store";
import useDate from "@/shared/composables/useDate";
import useEvents from "@/shared/composables/useEvents";
import * as XLSX from "xlsx";
import InitiatePayoutModal from "@/modules/payments/modals/initiate-payout-modal.vue";
import PageContentWrapper from "@/shared/components/global-comps/page-content-wrapper.vue";
import TableContainer from "@/shared/components/table-comps/table-container.vue";
import TableContainerBody from "@/shared/components/table-comps/table-container-body.vue";
import TableDoubleColumn from "@/shared/components/table-comps/table-double-column.vue";

const { getBoldTableText, formatNumber, getStatus, capitalizeFirstLetter} = useString();

const { getPayouts, fetchAllPayouts } = usePaymentStore();
const { processAPIRequest } = useEvents();

const isLoading = ref<boolean>(true);
const searchQuery = ref<string>("");
const showInitiatePayoutModal = ref(false);

const activePeriod = ref<[Date, Date] | null>(null);

const toggleInitiatePayoutModal = () => {
  showInitiatePayoutModal.value = !showInitiatePayoutModal.value;
};

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date Initiated", slug: "date_created" },
  { title: "Amount Requested", slug: "amount_requested" },
  { title: "Status", slug: "status" },
  { title: "Reason", slug: "reason_for_failure" },
  // { title: "Customer's Number", slug: "momo_number" },
  { title: "Payout Reference", slug: "reference" },
]);

const tableBody = ref<any[]>([]);
const tablePaging = ref<any>({});
const selectedStatus = ref("");
const statusOptions = ["Successful", "Pending", "Failed"];

const processSearchEntry = (searchValue: string) => {
  searchQuery.value = searchValue.toLocaleLowerCase().trim();
};

const getDateCreated = (date: string) => {
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

const fetchPayouts = async (page = 1) => {
  tablePaging.value.current_page = page;
  const response = await processAPIRequest({
    action: getPayouts,
    payload: { page },
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    tableBody.value = response.data.map((data: any) => {
      const formattedAmount = `${formatNumber(data.amount)}`;

      return {
        date_created: h(TableDoubleColumn, {
          entry: {
            primaryText: getDateCreated(data.created_at),
            secondaryText: useDate.formatTime(data.created_at),
          },
        }),
        reference: data.reference,
        amount_requested: getBoldTableText(
          `${data.currency} ${formatNumber(data.amount)}`
        ),

        status: getStatus(data.status, data.status),
        reason_for_failure: capitalizeFirstLetter(data.reason_for_failure?.toLowerCase() || "-"),
        momo_number: "-",
        raw: {
          raw_date: new Date(data.created_at),
          date_created: `${getDateCreated(data.created_at)} - ${useDate.formatTime(data.created_at)}`,
          amount: formattedAmount,
          status: data.status ?? "-",
          reference: data.reference ?? "-",
          // momo_number: "",
        },
      };
    });

    tablePaging.value = response.pagination[0];
  }
};

const filteredTableBody = computed(() =>
  tableBody.value.filter((tx) => {
    const rawDate = tx.raw?.raw_date ? new Date(tx.raw?.raw_date) : null;
    const matchesStatus = selectedStatus.value
      ? tx.raw?.status.toLowerCase() === selectedStatus.value.toLowerCase()
      : true;

    const matchesDate = rawDate
      ? isWithinRange(rawDate, activePeriod.value)
      : true;

    const matchesSearch =
      !searchQuery.value ||
      tx.reference.toLowerCase().includes(searchQuery.value);

    return matchesStatus && matchesDate && matchesSearch;
  })
);

const fetchAllPayoutPages = async () => {
  let page = 1;
  let all: any[] = [];
  let totalPages = 1;

  do {
    const response = await processAPIRequest({
      action: fetchAllPayouts,
      payload: { page },
      showAlert: false,
    });

    if (response?.code !== 200) break;

    const mapped = response.data.map((data: any) => {
      return {
        date_created: `${getDateCreated(data.created_at)} - ${useDate.formatTime(data.created_at)}`,
        raw_date: new Date(data.created_at),
        amount: `${formatNumber(data.amount)}`,
        status: data.status ?? "-",
        reason_for_failure: data.reason_for_failure ?? "-",
        // momo_number: "",
        currency: data.currency,
        reference: data.reference ?? "-",
      };
    });

    all.push(...mapped);

    totalPages = response.pagination[0]?.total_pages ?? 1;
    page++;
  } while (page <= totalPages);

  return all;
};

const exportToExcel = async () => {
  const allPayouts = await fetchAllPayoutPages();

  const filtered = allPayouts.filter((tx) => {
    const status = tx.status.toLowerCase();
    const date = tx.raw_date ? new Date(tx.raw_date) : null;

    const matchesStatus = selectedStatus.value
      ? status === selectedStatus.value
      : true;
    const matchesDate = date ? isWithinRange(date, activePeriod.value) : true;

    return matchesStatus && matchesDate;
  });

  const cleanData = filtered.map((tx) => ({
    "Date Created": tx.date_created,
    Amount: tx.amount || "-",
    Currency: tx.currency,
    Status: tx.status,
    Reference: tx.reference,
    Reason: capitalizeFirstLetter(data.reason_for_failure.toLowerCase() || "-"),
 
  })
  )

  const worksheet = XLSX.utils.json_to_sheet(cleanData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Merchant Payouts");
  XLSX.writeFile(workbook, "Merchant_Payouts.xlsx");
};

fetchPayouts();
</script>

<style lang="scss" scoped></style>
