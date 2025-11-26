<template>
  <ModalDialog @closeModal="$emit('closeTriggered')">
    <!-- MODAL COVER HEADER -->
    <template #modal-cover-header>
      <div class="modal-cover-header">
        <div class="modal-cover-title">Request a Refund</div>
      </div>
    </template>

    <template #modal-cover-body>
      <div class="modal-cover-body mt-3">
        <!-- REFUND AMOUNT -->
        <TextFieldInput
          labelId="refundAmount"
          labelTitle="refund amount"
          :inputType="IInputType.Number"
          inputPlaceholder="Enter a refund amount"
          isRequired
          @inputChanged="refundPayload.amount = $event"
          :errorHandler="{
            validator: 'validateNumberEntry',
            message: 'Please a valid refund amount',
          }"
        />
         <!-- PAYMENT REFERENCE -->
        <TextFieldInput
          labelId="paymentReference"
          labelTitle="Payment Reference"
          :inputType="IInputType.Text"
          inputPlaceholder="Enter the payment reference"
          isRequired
          isTextArea
          @inputChanged="refundPayload.payment_reference = $event"
          :errorHandler="{
            validator: 'validateRequired',
            message: 'Please provide a payment reference',
          }"
        />

        <!-- REFUND REASON -->
        <TextFieldInput
          labelId="refundReason"
          labelTitle="Refund Reason"
          :inputType="IInputType.Text"
          inputPlaceholder="Enter a refund request reason"
          isRequired
          isTextArea
          @inputChanged="refundPayload.reason = $event"
          :errorHandler="{
            validator: 'validateRequired',
            message: 'Please provide a refund request reason',
          }"
        />
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template #modal-cover-footer>
      <div class="modal-cover-footer -mt-4">
        <button
          class="btn btn-primary w-full"
          ref="requestRefundBtnRef"
          :disabled="isActionReady"
          @click="handleRefundRequest"
        >
          Confirm Request
        </button>
      </div>
    </template>
  </ModalDialog>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { IInputType } from "@/models/form-type";
import ModalDialog from "@/shared/components/global-comps/modal-dialog.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import useEvents from "@/shared/composables/useEvents";
import { useString } from "@/shared/composables/useString";
import { usePaymentStore } from "../store";

type IRefundType = {
  amount: number;
 payment_reference: string;
reason: string;
  
};

const emits = defineEmits(["closeTriggered", "reloadRefunds"]);

const { capitalizeFirstLetter } = useString();

const { processAPIRequest, pushToastAlert } = useEvents();
const { requestRefund } = usePaymentStore();

const refundPayload = ref<IRefundType>({
  amount: 0,
 payment_reference: "",
  reason: "",
});

const requestRefundBtnRef = ref(null);

const isActionReady = computed(() => {
  return refundPayload.value.amount && refundPayload.value.reason
    ? false
    : true;
});

const handleRefundRequest = async () => {
  if (refundPayload.value.amount < 100) {
    pushToastAlert({
      message: "Refund Request failed",
      description: "Please provide a minimum refund amount of ZMW100.",
      type: "error",
    });
    return;
  }

  const response = await processAPIRequest({
    action: requestRefund,
    payload: refundPayload.value,
    btnRef: requestRefundBtnRef,
    btnText: "Confirm Request",
    alertHandler: {
      200: {
        message: "Refund Requested successfully",
        description: "You are being redirected to your refund dashboard",
        type: "success",
      },

      // 400: {
      //   message: "Payout initiation failed",
      //   description: "Please provide valid payout details.",
      //   type: "error",
      // },
    },
  });

  if (response.code === 200) {
    emits("reloadRefunds");
    emits("closeTriggered");
  }

  // HANDLE ANY NON 200 ERRORS
  else {
    pushToastAlert({
      message: "Refund request failed",
      description: capitalizeFirstLetter(response.message),
      type: "error",
    });
  }
};
</script>

<style lang="scss" scoped>
.storefront-display-block {
  @apply border border-grey-300 rounded-md px-4 py-3 -mt-1 mb-8;

  .top-row {
    @apply flex justify-start items-center gap-x-2 mb-2;

    .icon {
      @apply text-lg text-grey-600;
    }

    .ptimary-text {
      @apply text-[14px] text-grey-700 font-semibold;
    }
  }

  .bottom-row {
    @apply flex justify-start items-start text-sm;

    .base-domain-url {
      @apply text-grey-500;
    }

    .secondary-domain-url {
      @apply text-grey-600 font-semibold break-all text-wrap whitespace-pre;
    }
  }
}
</style>
