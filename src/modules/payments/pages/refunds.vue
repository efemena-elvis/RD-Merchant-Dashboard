<template>
  <PageContentWrapper
    searchInputPlaceholder="Search by refund reference id"
    :filterActiveValue="activePeriod"
    pageDescription="All requested refunds"
    :pagingData="tablePaging"
    :hasPayload="true"
    :showCustomActionBtn="true"
    :customActionBtnText="'Export'"
    @customActionBtnClicked="exportToExcel"
   @updatePage="(currentPage) => (page = currentPage)"
    :pageCount="10"
    :pageKeys="{ green: 'Refunded', yellow: 'Pending', red: 'Declined' }"
    @searchEntered="processSearchEntry"
    @filterSelected="processFilterSelection"
  >
    <div
      class="flex items-center justify-between mb-4"
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

      <!-- <div class="">
        <button
          @click="toggleRequestRefundModal"
          class="p-3 rounded-md btn-primary"
        >
          Request a Refund
        </button>
      </div> -->
    </div>
    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="tableBody"
      :isLoading="isLoading"
      :emptyData="{
        title: 'No refund request',
        description:
          'We haven\'t received any refund request on this account. This is where you\'ll be able to see all initiated refund requests',
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
  <!-- <teleport to="body" v-if="showRequestRefundModal">
    <RequestRefundModal
      @closeTriggered="toggleRequestRefundModal"
      @reloadRefunds="fetchRefunds"
    />
  </teleport> -->
</template>

<script lang="ts" setup>
import { computed, ref, h, watch, onMounted} from "vue";
import { useString } from "@/shared/composables/useString";
import { TableHeaderType } from "@/models/dashboard-type";
import { usePaymentStore } from "../store";
import useDate from "@/shared/composables/useDate";
import useEvents from "@/shared/composables/useEvents";
import * as XLSX from "xlsx";
import PageContentWrapper from "@/shared/components/global-comps/page-content-wrapper.vue";
import TableContainer from "@/shared/components/table-comps/table-container.vue";
import TableContainerBody from "@/shared/components/table-comps/table-container-body.vue";
import TableDoubleColumn from "@/shared/components/table-comps/table-double-column.vue";
// import RequestRefundModal from "../modals/request-refund-modal.vue";

const { getBoldTableText, formatNumber, getStatus, capitalizeFirstLetter } =
  useString();

const { getRefunds, fetchAllRefunds } = usePaymentStore();
const { processAPIRequest } = useEvents();

const statusOptions = ["Successful", "Pending", "Failed"];
const tableHeader = ref<TableHeaderType[]>([
  { title: "Date Initiated", slug: "date_initiated" },
  { title: "Refund Amount", slug: "refund_amount" },
  // { title: "Customer's Number", slug: "momo_number" },
  { title: "Refund Status", slug: "refund_status" },
  { title: "Reason", slug: "reason_for_failure" },
  // { title: "Refunded On", slug: "date_refunded" },
  { title: "Refund Reference", slug: "reference" },
]);

const tableBody = ref<any[]>([]);
const tablePaging = ref<any>({});
const selectedStatus = ref("");
const activePeriod = ref<[Date, Date] | null>(null);
const isLoading = ref<boolean>(true);
const searchQuery = ref<string>("");
const page = ref<number>(1);


// const showRequestRefundModal = ref(false);

// const toggleRequestRefundModal = () => {
//   showRequestRefundModal.value = !showRequestRefundModal.value;
// };

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

const filters = computed(
  () =>
    `?page=${page.value}&status=${selectedStatus.value}&from=${
      activePeriod.value
        ? activePeriod.value[0].toISOString().split("T")[0]
        : ""
    }&to=${
      activePeriod.value
        ? activePeriod.value[1].toISOString().split("T")[0]
        : ""
    }`
);

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

const fetchRefunds = async (filters: string) => {
  isLoading.value = true;
  tablePaging.value.current_page = page;
  const response = await processAPIRequest({
    action: getRefunds,
    payload: {filters, page: page.value },
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    tableBody.value = response.data.map((data: any) => {
      const formattedAmount = `${formatNumber(data.amount)}`;

      return {
        date_initiated: h(TableDoubleColumn, {
          entry: {
            primaryText: getDateCreated(data.created_at),
            secondaryText: useDate.formatTime(data.created_at),
          },
        }),
        reference: data.reference,
        refund_amount: getBoldTableText(
          `${data.currency} ${formatNumber(data.amount)}`
        ),

        refund_status: getStatus(data.status, data.status),
        reason_for_failure: capitalizeFirstLetter(
          (data.reason_for_failure || "-").toString().toLowerCase()
        ),

        // momo_number: "",
        raw: {
          date_initiated: `${getDateCreated(data.created_at)} - ${useDate.formatTime(data.created_at)}`,
          raw_date: new Date(data.created_at),
          refund_amount: formattedAmount,
          refund_status: data.status ?? "-",
          reference: data.reference ?? "-",
          momo_number: "",
        },
      };
    });

    tablePaging.value = response.pagination[0];
  }
};



const fetchAllRefundPages = async () => {
  let page = 1;
  let all: any[] = [];
  let totalPages = 1;

  do {
    const response = await processAPIRequest({
      action: fetchAllRefunds,
      payload: { page },
      showAlert: false,
    });

    if (response?.code !== 200) break;

    const mapped = response.data.map((data: any) => {
      return {
        date_initiated: `${getDateCreated(data.created_at)} - ${useDate.formatTime(data.created_at)}`,
        raw_date: new Date(data.created_at),
        refund_amount: `${formatNumber(data.amount)}`,
        refund_status: data.status ?? "-",
        currency: data.currency ?? "-",
        reason_for_failure: capitalizeFirstLetter(
          (data.reason_for_failure || "-").toString().toLowerCase()
        ),

        // momo_number: "",
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
  const allRefunds = await fetchAllRefundPages();

  const filtered = allRefunds.filter((tx) => {
    const status = tx.refund_status.toLowerCase();
    const date = tx.raw_date ? new Date(tx.raw_date) : null;

    const matchesStatus = selectedStatus.value
      ? status === selectedStatus.value
      : true;
    const matchesDate = date ? isWithinRange(date, activePeriod.value) : true;

    return matchesStatus && matchesDate;
  });

  const cleanData = filtered.map((tx) => ({
    "Date Initiated": tx.date_initiated,
    Currency: tx.currency,
    Amount: tx.refund_amount || "-",
    Status: tx.refund_status,
    Reference: tx.reference,
    Reason: tx.reason_for_failure || "-",
  }));
  const worksheet = XLSX.utils.json_to_sheet(cleanData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Merchant Refunds");
  XLSX.writeFile(workbook, "Merchant_Refunds.xlsx");
};

watch([selectedStatus, activePeriod], () => {
  page.value = 1;
});

watch(filters, (newFilters) => {
  fetchRefunds(newFilters);
});

onMounted(fetchRefunds);
</script>

<style lang="scss" scoped></style>
