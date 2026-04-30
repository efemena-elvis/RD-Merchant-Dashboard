<template>
  <ModalDialog @closeModal="$emit('closeTriggered')">
    <!-- MODAL COVER HEADER -->
    <template #modal-cover-header>
      <div class="modal-cover-header">
        <div class="modal-cover-title">Request a Refund</div>
      </div>
    </template>

    <template #modal-cover-body>
      <div class="mt-3 modal-cover-body">
        <!-- REFUND AMOUNT -->
        <TextFieldInput
          labelId="refundAmount"
          labelTitle="Refund Amount"
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

            <!-- TRANSFER TO DROPDOWN -->
      <SelectFieldInput
          labelId="transferTo"
          labelTitle="Transfer To"
          :inputType="IInputType.Text"
          inputPlaceholder="Select where to transfer to"
          isRequired
          :selectData="[
            { value: 'bank', name: 'Bank Account' },
            { value: 'mobile_number', name: 'MoMo Phone Number' },
          ]"
          
          @onSelectionChange="refundPayload.transfer_to = $event"
          :inputValue="refundPayload.transfer_to"
          
          :errorHandler="{
            validator: 'validateRequired',
            message: 'Please provide a transfer destination',
          }"
        />

    <!-- MOMO PHONE NUMBER -->
   <TextFieldInput
   v-if="refundPayload.transfer_to === 'mobile_number'"
          labelId="momo_phone_number"
          labelTitle="MoMo Phone Number"
          :inputType="IInputType.Number"
          inputPlaceholder="Enter a MoMo phone number"
          isRequired
          isTextArea
          @inputChanged="refundPayload.momo_phone_number = $event"
          :errorHandler="{
            validator: 'validateRequired',
            message: 'Please provide a MoMo phone number',
          }"
        />

        <!-- Bank -->
      <div v-if="refundPayload.transfer_to === 'bank'">
        <SelectFieldInput
            labelId="bank_id"
            labelTitle="Bank Name"
            :inputType="IInputType.Text"
            inputPlaceholder="Select bank name"
            isRequired
            :selectData="[
              { value: 'bank', name: 'Bank Account' },
              { value: 'mobile_number', name: 'MoMo Phone Number' },
            ]"
        
            @onSelectionChange="refundPayload.bank_id = $event"
            :inputValue="refundPayload.bank_id" 
            :errorHandler="{
              validator: 'validateRequired',
              message: 'Please provide a bank name',
            }"
          />
            <TextFieldInput
          
            labelId="account_number"
            labelTitle="Account Number"
            :inputType="IInputType.Text"
            inputPlaceholder="Enter an account number"
            isRequired
            isTextArea
            @inputChanged="refundPayload.account_number = $event"
            :errorHandler="{
              validator: 'validateRequired',
              message: 'Please provide an account number',
            }"
          />
      </div>
      </div>
   

 
    </template>

    <!-- MODAL COVER FOOTER -->
    <template #modal-cover-footer>
      <div class="-mt-4 modal-cover-footer">
        <button
          class="w-full btn btn-primary"
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
import SelectFieldInput from "@/shared/components/form-comps/select-field-input.vue";

type IRefundType = {
amount: number;
payment_reference: string;
reason: string;
transfer_to: string;
account_number?: string;
momo_phone_number?: string;
bank_id?: string;
};

const emits = defineEmits(["closeTriggered", "reloadRefunds"]);

const { capitalizeFirstLetter } = useString();

const { processAPIRequest, pushToastAlert } = useEvents();
const { requestRefund } = usePaymentStore();

const refundPayload = ref<IRefundType>({
  amount: 0,
  payment_reference: "",
  reason: "",
  transfer_to: "",
  // account_number: "",
  momo_phone_number: "",
  // bank_id: "",
});

const requestRefundBtnRef = ref(null);

const isActionReady = computed(() => {
  return refundPayload.value.amount && refundPayload.value.reason
    ? false
    : true;
});

const handleRefundRequest = async () => {

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
