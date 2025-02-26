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
    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="tableBody"
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
        v-for="(payload, index) in tableBody"
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
import { ref } from "vue";
import { useString } from "@/shared/composables/useString";
import { TableHeaderType } from "@/models/dashboard-type";
import { usePaymentStore } from "../store";
import useDate from "@/shared/composables/useDate";
import useEvents from "@/shared/composables/useEvents";
import InitiatePayoutModal from "@/modules/payments/modals/initiate-payout-modal.vue";
import PageContentWrapper from "@/shared/components/global-comps/page-content-wrapper.vue";
import TableContainer from "@/shared/components/table-comps/table-container.vue";
import TableContainerBody from "@/shared/components/table-comps/table-container-body.vue";

const { getBoldTableText, formatNumber, capitalizeFirstLetter } = useString();

const { fetchAllPayouts } = usePaymentStore();
const { processAPIRequest } = useEvents();

const isLoading = ref<boolean>(true);

const showInitiatePayoutModal = ref(false);

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

const tableBody: any[] = [];
const tablePaging = ref<any>({});

const processSearchEntry = (searchValue: string) => {
  console.log("SEARCH VALUE", searchValue);
};

const processFilterSelection = (selectedPeriod: string) => {
  console.log("FILTERING BY PERIOD", selectedPeriod);
};

const getDateCreated = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const fetchPayouts = async () => {
  const response = await processAPIRequest({
    action: fetchAllPayouts,
    payload: {},
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    tableBody.length = 0;

    response.data.map((data: any) => {
      tableBody.push({
        date_created: getDateCreated(data.created_at),
        reference_id: data.reference,
        amount_requested: getBoldTableText(
          `${data.currency} ${formatNumber(data.amount)}`
        ),
        narration: data.narration,
        status: capitalizeFirstLetter(data.status.split("_").join(" ")),
      });
    });

    tablePaging.value = response.pagination[0];
  }
};

fetchPayouts();
</script>

<style lang="scss" scoped></style>
