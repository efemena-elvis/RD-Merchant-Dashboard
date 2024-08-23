<template>
  <CheckoutWrapper>
    <template v-if="fetchingPaymentDetails">
      <SkeletonCheckout />
    </template>

    <template v-else>
      <form @submit.prevent="handleCheckoutPayment">
        <!-- FORM AREA -->
        <div class="form-area">
          <!-- CUSTOMER FULLNAME -->
          <TextFieldInput
            labelId="customerName"
            labelTitle="Customer Full Name"
            :inputType="IInputType.Text"
            :inputValue="payload.full_name"
            inputPlaceholder="Provide your full name"
            isRequired
            @inputChanged="payload.full_name = $event"
            @inputValidated="payloadValidity.full_name = $event"
            :errorHandler="{
              validator: 'validateFullName',
            }"
          />

          <!-- EMAIL ADDRESS -->
          <TextFieldInput
            labelId="businessEmail"
            labelTitle="Email address"
            :inputType="IInputType.Email"
            :inputValue="payload.email"
            inputPlaceholder="Provide your email address"
            :isRequired="true"
            @inputChanged="payload.email = $event"
            @inputValidated="payloadValidity.email = $event"
            :errorHandler="{
              validator: 'validateEmail',
            }"
          />

          <!-- CUSTOMER PHONE NUMBER -->
          <PhoneFieldInput
            labelId="phoneNumber"
            labelTitle="Phone Number"
            :inputValue="payload.phone_number"
            inputPlaceholder="Provide your phone number"
            :isRequired="true"
            :activeCountryCode="phoneCountryCode"
            @countryCodeChanged="phoneCountryCode = $event"
            @inputChanged="payload.phone_number = $event"
            @inputValidated="payloadValidity.phone_number = $event"
            :errorHandler="{
              validator: 'validatePhone',
            }"
          />
        </div>

        <!-- ACTION BUTTON -->
        <div class="action-row -mt-1">
          <button
            class="btn btn-primary w-full"
            ref="checkoutBtnRef"
            :disabled="isActionReady"
          >
            Pay {{ paymentDetails.currency }}
            {{ formatNumber(paymentDetails.amount) }}
          </button>
        </div>
      </form>
    </template>
  </CheckoutWrapper>
</template>

<script setup lang="ts">
import { computed, ref, toRaw, watch } from "vue";
import { IInputType } from "@/models/form-type";
import { useRouter, useRoute } from "vue-router";
import { useString } from "@/shared/composables/useString";
import { useExternalStore } from "../store";
import useEvents from "@/shared/composables/useEvents";
import CheckoutWrapper from "@/modules/external/components/checkout-wrapper.vue";
import SkeletonCheckout from "@/modules/external/components/skeleton-checkout.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import PhoneFieldInput from "@/shared/components/form-comps/phone-field-input.vue";
import { storeToRefs } from "pinia";

type IPayloadInputType = {
  full_name: string;
  email: string;
  phone_number: string;
};

type IInputValidity = {
  full_name: boolean;
  email: boolean;
  phone_number: boolean;
};

const route = useRoute();
const router = useRouter();

const { formatNumber } = useString();
const { clickHandler } = useEvents();

const { mutateCustomerDetails } = useExternalStore();
const { getPaymentDetails } = storeToRefs(useExternalStore());

const checkoutBtnRef = ref(null);
const phoneCountryCode = ref<string>("260");
const fetchingPaymentDetails = ref<boolean>(true);

const paymentDetails = ref({
  amount: 0,
  business_id: "",
  currency: "ZMW",
  method: "",
  customer_first_name: "",
  customer_last_name: "",
  email: "",
  environment: "",
  redirect_url: "",
  reference: "",
});

const payload = ref<IPayloadInputType>({
  full_name:
    `${getPaymentDetails.value.customer_first_name} ${getPaymentDetails.value.customer_last_name}` ||
    "",
  email: getPaymentDetails.value.email || "",
  phone_number: "",
});

const payloadValidity = ref<IInputValidity>({
  full_name: false,
  email: false,
  phone_number: false,
});

const isActionReady = computed(() => {
  return payload.value.email &&
    payload.value.phone_number &&
    payload.value.full_name &&
    payloadValidity.value.email &&
    payloadValidity.value.phone_number &&
    payloadValidity.value.full_name
    ? false
    : true;
});

const getPayload = computed(() => {
  const { full_name, email, phone_number } = payload.value;

  const updatedPayload = {
    full_name,
    email,
    phone_number,
  };

  const phoneNumberString = phone_number?.toString() || "";

  if (phoneNumberString.startsWith(phoneCountryCode.value)) {
    updatedPayload.phone_number = phoneNumberString;
  } else if (phoneNumberString.startsWith("+")) {
    updatedPayload.phone_number = phoneNumberString.slice(1);
  } else {
    updatedPayload.phone_number = `${phoneCountryCode.value}${phoneNumberString}`;
  }

  return updatedPayload;
});

const handleCheckoutPayment = () => {
  clickHandler(checkoutBtnRef);
  mutateCustomerDetails(getPayload.value);

  setTimeout(
    () =>
      router.push({
        name: "RedstoneCollectionCheckoutStatus",
        params: {
          paymentReference: route.params.paymentReference,
          status: "pending",
        },
      }),
    800
  );
};

watch(
  getPaymentDetails,
  (payment) => {
    if (Object.keys(payment).length) {
      paymentDetails.value = toRaw(payment);
      fetchingPaymentDetails.value = false;

      payload.value.full_name = `${payment.customer_first_name} ${payment.customer_last_name}`;
      payload.value.email = payment.email;
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="scss"></style>
