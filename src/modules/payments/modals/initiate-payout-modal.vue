<template>
  <ModalDialog @closeModal="$emit('closeTriggered')">
    <!-- MODAL COVER HEADER -->
    <template #modal-cover-header>
      <div class="modal-cover-header">
        <div class="modal-cover-title">Initiate a Payout</div>
      </div>
    </template>

    <template #modal-cover-body>
      <div class="modal-cover-body mt-3">
        <!-- PAYOUT AMOUNT -->
        <TextFieldInput
          labelId="payoutAmount"
          labelTitle="Payout amount"
          :inputType="IInputType.Number"
          inputPlaceholder="Enter a payout amount"
          isRequired
          @inputChanged="payoutPayload.amount = $event"
          :errorHandler="{
            validator: 'validateNumberEntry',
            message: 'Please a valid payout amount',
          }"
        />

        <!-- PAYOUT NARRATION -->
        <TextFieldInput
          labelId="payoutNarration"
          labelTitle="Payout narration"
          :inputType="IInputType.Text"
          inputPlaceholder="Enter a payout request narration"
          isRequired
          isTextArea
          @inputChanged="payoutPayload.narration = $event"
          :errorHandler="{
            validator: 'validateRequired',
            message: 'Please provide a payout request narration',
          }"
        />
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template #modal-cover-footer>
      <div class="modal-cover-footer -mt-4">
        <button
          class="btn btn-primary w-full"
          ref="initiatePayoutBtnRef"
          :disabled="isActionReady"
          @click="handlePayoutInitiation"
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
import { useProfile } from "@/shared/composables/useProfile";
import { usePaymentStore } from "../store";

type IPayoutType = {
  amount: number;
  countryId: string;
  narration: string;
};

const emits = defineEmits(["closeTriggered", "reloadStorefront"]);

const { capitalizeFirstLetter } = useString();
const { getUser } = useProfile();
const { processAPIRequest, pushToastAlert } = useEvents();
const { initiatePayout } = usePaymentStore();

const payoutPayload = ref<IPayoutType>({
  amount: 0,
  countryId: getUser().country.id || "",
  narration: "",
});

const initiatePayoutBtnRef = ref(null);

const isActionReady = computed(() => {
  return payoutPayload.value.amount && payoutPayload.value.narration
    ? false
    : true;
});

const handlePayoutInitiation = async () => {
  if (payoutPayload.value.amount <= 100) {
    pushToastAlert({
      message: "Payout initiation failed",
      description: "Please provide a minimum payout amount of ZMW100.",
      type: "error",
    });
    return;
  }

  const response = await processAPIRequest({
    action: initiatePayout,
    payload: payoutPayload.value,
    btnRef: initiatePayoutBtnRef,
    btnText: "Confirm Request",
    alertHandler: {
      200: {
        message: "Payout initiated successfully",
        description: "You are being redirected to your payout dashboard",
        type: "success",
      },

      // 400: {
      //   message: "Payout initiation failed",
      //   description: "Please provide a valid payout details",
      //   type: "error",
      // },
    },
  });

  if (response.code === 200) {
    emits("reloadStorefront");
    emits("closeTriggered");
  }

  // HANDLE ANY NON 200 ERRORS
  else {
    pushToastAlert({
      message: "Payout initiation failed",
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
