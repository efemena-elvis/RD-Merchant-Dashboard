<template>
  <PageContentWrapper
    searchInputPlaceholder="Search by payout reference id"
    :showFilterSelection="false"
    pageDescription="All payouts"
    :pagingData="tablePaging"
    :pageKeys="{ green: 'Successful', yellow: 'Pending', red: 'Failed' }"
    :hasPayload="tableBody.length > 0"
    :showCustomActionBtn="true"
    :customActionBtnText="'Initiate a payout'"
    @customActionBtnClicked="toggleInitiatePayoutModal"
    @searchEntered="processSearchEntry"
    @filterSelected="processFilterSelection"
  >

    <div class="flex gap-4 mb-4" v-if="!isLoading">
     
        <select
          v-model="selectedStatus"
          class="p-4 text-sm border rounded-md cursor-pointer focus:outline-none text-teal-800 font-semibold"
        >
          <option value="">Status</option>
          <option
            v-for="(status, index) in statusOptions"
            :value="status"
            :key="index"
          >
            {{ status }}
          </option>
        </select>

        
        <div class="relative">
          <div
            class="flex justify-between items-center gap-x-2 p-4 text-teal-800 font-semibold border rounded-md  cursor-pointer text-sm w-[120px]"
            @click="showDropdown = !showDropdown"
          >
            <span>{{ activePeriod }}</span>
            <span class="icon-calendar transition-transform duration-200"></span>
          </div>

          <div
            v-if="showDropdown"
            class="absolute z-10 mt-1 bg-white border rounded-md shadow-md w-full"
          >
            <div
              v-for="(period, index) in periodList"
              :key="index"
              @click="processFilterSelection(period); showDropdown = false"
              class="px-4 py-2 text-sm cursor-pointer hover:bg-indigo-50"
            >
              {{ period }}
            </div>
          </div>
        </div>
      
      </div>
    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="filteredTableBody"
      :isLoading="isLoading"
      :emptyData="{
        title: 'No payout initiated yet',
        description:
          'You haven\'t initiated any payout yet. This is where you\'ll be able to see all your  initiated payout transactions',
        actionText: 'Initiate a payout',
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
    <InitiatePayoutModal @closeTriggered="toggleInitiatePayoutModal" />
  </teleport>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useString } from "@/shared/composables/useString";
import { TableHeaderType } from "@/models/dashboard-type";
import { usePaymentStore } from "../store";
import useDate from "@/shared/composables/useDate";
import useEvents from "@/shared/composables/useEvents";
import InitiatePayoutModal from "@/modules/payments/modals/initiate-payout-modal.vue";
import PageContentWrapper from "@/shared/components/global-comps/page-content-wrapper.vue";
import TableContainer from "@/shared/components/table-comps/table-container.vue";
import TableContainerBody from "@/shared/components/table-comps/table-container-body.vue";

const { getBoldTableText, formatNumber, getStatus } = useString();

const { fetchAllPayouts } = usePaymentStore();
const { processAPIRequest } = useEvents();

const isLoading = ref<boolean>(true);

const showInitiatePayoutModal = ref(false);
const activePeriod = ref("All Time");
const showDropdown = ref(false);

const periodList = ref([
  "Today",
  "Last 7 days",
  "This month",
  "Last month",
  "All time",
]);

const toggleInitiatePayoutModal = () => {
  showInitiatePayoutModal.value = !showInitiatePayoutModal.value;
};

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date Initiated", slug: "date_created" },
  { title: "Payout Reference", slug: "reference_id" },
  { title: "Amount Requested", slug: "amount_requested" },
  { title: "Payout Narration", slug: "narration" },
  { title: "Status", slug: "status" },
]);

const tableBody = ref<any[]>([]);
const tablePaging = ref<any>({});
const selectedStatus = ref("");
const statusOptions = ["Successful", "Pending", "Failed"];


const processSearchEntry = (searchValue: string) => {
  console.log("SEARCH VALUE", searchValue);
};



const getDateCreated = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const processFilterSelection = (selectedPeriod: string) => {
  activePeriod.value = selectedPeriod;
};

const normalize = (val: string) => val?.trim().toLowerCase() || "";

const isWithinPeriod = (date: Date, period: string): boolean => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  switch (period) {
    case "Today":
      return date >= startOfToday;
    case "Last 7 days":
      return date >= sevenDaysAgo;
    case "This month":
      return date >= startOfMonth;
    case "Last month":
      return date >= startOfLastMonth && date <= endOfLastMonth;
    case "All time":
    default:
      return true;
  }
};

const fetchPayouts = async () => {
  const response = await processAPIRequest({
    action: fetchAllPayouts,
    payload: {},
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    tableBody.value = response.data.map((data: any) => ({
      // raw values (for filtering)
      raw_date: data.created_at,
      raw_status: data.status,

      // formatted values (for display)
     
      date_created: getDateCreated(data.created_at),
      reference_id: data.reference,
      amount_requested: getBoldTableText(
        `${data.currency} ${formatNumber(data.amount)}`
      ),
      narration: data.narration,
      status: getStatus(data.status, data.status),
    }));

    tablePaging.value = response.pagination[0];
  }
};


const filteredTableBody = computed(() =>


    tableBody.value.filter((tx) => {
      const rawDate = tx.raw_date ? new Date(tx.raw_date) : null;
    const matchesStatus = selectedStatus.value
      ? tx.raw_status.toLowerCase() === selectedStatus.value.toLowerCase()
      : true;

     const matchesDate = rawDate ? isWithinPeriod(rawDate, activePeriod.value) : true;
    return matchesStatus && matchesDate;
  })
);

fetchPayouts();
</script>

<style lang="scss" scoped></style>
