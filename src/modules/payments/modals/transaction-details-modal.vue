<template>
  <ModalDialog @closeModal="$emit('closeTriggered')">
    <!-- MODAL COVER HEADER -->
    <template #modal-cover-header>
      <div class="modal-cover-header">
        <div class="modal-cover-title">Transaction Log</div>
      </div>
    </template>

    <!-- MODAL BODY -->
    <template #modal-cover-body>
      <div class="modal-cover-body mt-3 space-y-3 max-h-[400px] overflow-y-auto flex items-center justify-center">
        <div v-if="isLoading" class="flex flex-col items-center justify-center text-teal-700">
          <svg
            class="animate-spin h-6 w-6 mb-2 text-teal-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <p>Loading transaction log...</p>
        </div>

        <div
          v-else-if="transactionLog"
          class="rounded-lg p-3 flex justify-between items-start hover:bg-grey-50 transition w-full"
        >
          {{ transactionLog }}
        </div>

        <div v-else class="text-center text-[16px] text-teal-700">
          Log not found for the selected transaction.
        </div>
      </div>
    </template>
  </ModalDialog>
</template>

<script lang="ts" setup>
import ModalDialog from "@/shared/components/global-comps/modal-dialog.vue";
import useEvents from "@/shared/composables/useEvents";
import { usePaymentStore } from "../store";
import { ref, onMounted } from "vue";

const { processAPIRequest } = useEvents();
const { getSingleTransaction } = usePaymentStore();

const transactionLog = ref(null);
const isLoading = ref(false);

const emits = defineEmits(["closeTriggered"]);

interface Transaction {
  description: string;
  raw_date: string;
  time: string;
  amount: number;
  type: "credit" | "debit";
  status: "success" | "failed" | "pending";
  reference: string;
}

const props = defineProps<{
  transaction: Transaction | null;
}>();

const fetchSingleTransaction = async () => {
  isLoading.value = true;
  const response = await processAPIRequest({
    action: getSingleTransaction,
    payload: { ref: props.transaction?.reference },
  });

  if (response.code === 200) {
    transactionLog.value = response;
  }
  isLoading.value = false;
};

onMounted(() => {
  fetchSingleTransaction();
});
</script>

<style lang="scss" scoped>
.modal-cover-body {
  @apply h-[300px];
}

.modal-cover-title {
  @apply text-lg font-semibold text-grey-800;
}
</style>
