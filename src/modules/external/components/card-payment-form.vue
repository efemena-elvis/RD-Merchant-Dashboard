<template>
  <form class="grid grid-cols-2 gap-4" @submit.prevent="handleSubmission">
    <template v-if="setting_up">
      <div class="card-input-skeleton col-span-2"></div>
      <div class="card-input-skeleton"></div>
      <div class="card-input-skeleton"></div>
    </template>
    <template v-else>
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

      <TextFieldInput
        labelId="cardExpiry"
        labelTitle="Card Expiry"
        :inputType="IInputType.Text"
        inputPlaceholder="MM / YY"
        :isRequired="true"
      />

      <TextFieldInput
        labelId="cardCvv"
        labelTitle="CVV"
        :inputType="IInputType.Number"
        inputPlaceholder="123"
        :isRequired="true"
      >
        <div class="border" id="securityCode-container"></div>
      </TextFieldInput>
    </template>

    <button
      type="submit"
      class="w-full btn btn-primary col-span-2"
      :disabled="setting_up"
    >
      PAY
    </button>
  </form>
</template>

<script lang="ts" setup>
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import { IInputType } from "@/models/form-type";
import { useExternalStore } from "../store";
import $api from "@/shared/composables/useServiceAPI";
import { onMounted, ref } from "vue";

const store = useExternalStore();
const setting_up = ref(false);
const cardFrom = ref(null);

const props = defineProps<{ details: { currency: string; amount: number } }>();

const handleSubmission = () => {
  const form = store.cardPaymentForm;
  if (form) {
    form.createToken(
      { expirationMonth: "01", expirationYear: "2025" },
      (err, token) => {
        console.log({ err, token });
      }
    );
  }
};

onMounted(() => {
  // setUpCard();
});

const setUpCard = async () => {
  try {
    setting_up.value = true;
    const response = await $api.push("payment/get-capture-context", {
      payload: {
        currency: props.details.currency,
        amount: props.details.amount,
      },
      requiresPublicKey: true,
      resolve: true,
    });

    setting_up.value = false;
  } catch (err) {
    setting_up.value = false;
    console.error("FAILED TO SETUP CARD");
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
  @apply h-[52px] bg-slate-200 animate-pulse;
}
</style>
