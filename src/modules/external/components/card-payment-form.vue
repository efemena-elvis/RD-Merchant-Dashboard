<template>
  <form
    class="grid grid-cols-2 gap-4 relative"
    @submit.prevent="handleSubmission"
  >
    <div
      class="absolute inset-0 bg-neutral-400/5 border grid place-items-center z-10"
      v-if="loadingInputs"
    >
      <div class="icon-spinner-ios text-2xl text-green-500 animate-spin"></div>
    </div>
    <TextFieldInput
      labelId="cardNumber"
      labelTitle="Card Number"
      :inputType="IInputType.Number"
      inputPlaceholder="0000 0000 0000 0000"
      :isRequired="true"
      class="col-span-2"
    >
      <div class="col-span-2 border" id="number-container"></div>
    </TextFieldInput>

    <div class="relative">
      <label
        for="cardExpiry"
        class="bg-white text-sm absolute left-1 -top-2 form-label z-10"
        >Card Expiry</label
      >
      <input
        type="text"
        class="form-control max-h-[52px]"
        id="cardExpiry"
        v-model="formattedDate"
        @input="formatInput"
        placeholder="03 / 2026"
        maxlength="9"
      />
      <div
        class="absolute bottom-3 text-sm font-medium text-red-500"
        v-if="invalidExpiry"
      >
        Invalid date
      </div>
    </div>

    <TextFieldInput
      labelId="cardCvv"
      labelTitle="CVV"
      :inputType="IInputType.Number"
      inputPlaceholder="123"
      :isRequired="true"
    >
      <div class="border" id="securityCode-container"></div>
    </TextFieldInput>

    <button
      type="submit"
      class="w-full btn btn-primary col-span-2"
      ref="btnRef"
      :disabled="invalidExpiry"
    >
      PAY
    </button>
  </form>
</template>

<script lang="ts" setup>
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import { IInputType } from "@/models/form-type";
import { useExternalStore } from "../store";
import { computed, onMounted, onUnmounted, ref } from "vue";
import useEvents from "@/shared/composables/useEvents";

const store = useExternalStore();
const cardForm = computed(() => store.cardPaymentForm);
const loading_card_number_input = ref(false);
const loading_card_security_input = ref(false);
const { clickHandler, pushToastAlert, processAPIRequest } = useEvents();
const btnRef = ref(null);

const formattedDate = ref("");
const invalidExpiry = ref(false);
const expiryMonth = ref("");
const expiryYear = ref("");

const formatInput = (event: Event) => {
  let value = (event?.target as HTMLInputElement)?.value.replace(/\D/g, "");

  if (value.length > 6) value = value.slice(0, 6);

  if (value.length >= 2) {
    formattedDate.value = `${value.slice(0, 2)} / ${value.slice(2)}`;
  } else {
    formattedDate.value = value;
  }
  if (value.length === 6) {
    const month = Number(value.slice(0, 2));
    const year = Number(value.slice(-4));
    const currentYear = new Date().getFullYear();
    if (year < currentYear) {
      invalidExpiry.value = true;
      return;
    }
    if (month < 0 || month > 12) {
      invalidExpiry.value = true;
      return;
    }
    invalidExpiry.value = false;
    expiryMonth.value = `${month}`.length < 2 ? `0${month}` : `${month}`;
    expiryYear.value = `${year}`;
  }
};

const loadingInputs = computed(
  () => loading_card_number_input.value || loading_card_security_input.value
);

const makePaymentWithCardToken = async (token: string) => {
  const payment_details = store.paymentDetails;
  const payload = {
    paymentReference: payment_details.reference,
    customerDetails: {
      customer_first_name: payment_details.customer_first_name,
      customer_last_name: payment_details.customer_last_name,
      phone_number: payment_details?.phone_number ?? "--",
      email: payment_details.email,
      method: store.paymentMethod,
      token,
      customer_address: "--",
      customer_address_2: "--",
      customer_country: "ZM",
      customer_city: "--",
      customer_state: "--",
      customer_zip: "10101",
    },
  };
  try {
    const response = await processAPIRequest({
      action: store.makePayment,
      payload,
      btnRef,
      btnText: "PAY",
      showAlert: false,
    });
    const processing_payment_message = "Payment already being processed";
    handleAlert(response);
    if (
      response?.message === processing_payment_message ||
      response?.code !== 200
    )
      return;
    const continueResponse = await processAPIRequest({
      action: store.continuePayment,
      payload: {
        paymentReference: payment_details.reference,
      },
      btnRef,
      btnText: "PAY",
      showAlert: false,
    });
    handleAlert(continueResponse);
    if (continueResponse?.code !== 200) return;
    if (!continueResponse?.data?.challenge_token) {
      setTimeout(() => {
        if (store.getPaymentDetails.redirect_url)
          location.href = store.getPaymentDetails.redirect_url;
      }, 1000);
    }
  } catch (e) {
    pushToastAlert({ type: "warning", message: "Failed to complete payment" });
  }
};

const handleAlert = (response: {
  code: number;
  data: any;
  message: string;
}) => {
  const message = response?.message;
  const code = response?.code;
  const type = code === 200 ? "success" : "warning";
  message && pushToastAlert({ type, message });
};

const handleSubmission = () => {
  const form = cardForm.value;
  if (form) {
    clickHandler(btnRef);
    form.createToken(
      { expirationMonth: expiryMonth.value, expirationYear: expiryYear.value },
      (err, token) => {
        clickHandler(btnRef, "PAY", false);
        if (err) {
          pushToastAlert({
            type: "warning",
            message: "Failed to complete payment",
          });
          return;
        }
        makePaymentWithCardToken(token);
      }
    );
  }
};

onMounted(() => {
  loadCardInputs();
});

onUnmounted(() => {
  const cardNumberInput = store.cardNumberInput;
  const cardSecurityInput = store.cardSecurityInput;
  if (cardNumberInput?._loaded) cardNumberInput.unload();
  if (cardSecurityInput?._loaded) cardSecurityInput.unload();
});

const loadCardInputs = () => {
  const form = cardForm?.value;
  const cardNumberInput = store.cardNumberInput;
  const cardSecurityInput = store.cardSecurityInput;

  if (!form) return;
  if (cardNumberInput) {
    loading_card_number_input.value = true;
    cardNumberInput?.on("load", () => {
      loading_card_number_input.value = false;
    });
    cardNumberInput.load("#number-container");
  }
  if (cardSecurityInput) {
    loading_card_security_input.value = true;
    cardSecurityInput?.on("load", () => {
      loading_card_security_input.value = false;
    });
    cardSecurityInput.load("#securityCode-container");
  }
};
</script>

<style scoped>
.flex-microform {
  @apply placeholder:text-grey-500/90 placeholder:text-sm focus:outline-0 select-none;
  @apply border border-grey-300 text-sm pb-[13.5px] md:pb-[13px] pt-[16.5px] md:pt-[15px] px-4 md:px-3.5 text-grey-800 transition-all duration-300 ease-in-out rounded-md box-border align-middle relative shadow-[unset] appearance-none overflow-hidden w-full outline-0 m-0 left-0 top-0 hover:border-green-400 focus:border-green-500 focus:shadow-[unset] focus:outline-0 disabled:bg-grey-10 disabled:border-grey-200 disabled:text-grey-500 disabled:box-border;
  height: 52px;
}

.flex-microform-disabled {
  @apply pointer-events-none cursor-not-allowed;
}

.flex-microform-invalid {
  @apply border border-red-500 hover:border-red-500 focus:border-red-500;
}

.card-input-skeleton {
  @apply h-[52px] animate-pulse;
  background: linear-gradient(90deg, #e8e8e8 25%, #efefef 50%, #e8e8e8 75%);
}
</style>
