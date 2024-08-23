<template>
  <CheckoutWrapper>
    <!-- CHECKOUT CONTAINER -->
    <div class="checkout-container transition duration-300 ease-in-out">
      <!-- PENDING VIEW -->
      <div
        class="flex flex-col justify-center items-center gap-y-6 sm:gap-y-5 transition duration-300 ease-in-out"
        v-if="activeStatus === 'pending'"
      >
        <!-- IMAGE ICON -->
        <div class="img-icon">
          <img :src="renderImg('pending-payment.png')" alt="PendingPayment" />
        </div>

        <!-- TITLE TEXT -->
        <div class="title-text">Processing your payment</div>

        <!-- DESCRIPTION TEXT -->
        <div class="description-text">
          Hang tight! We're processing your payment. This should take some few
          moments. Please do not refresh or close this page.
        </div>
      </div>

      <!-- FAILED VIEW -->
      <div
        class="flex flex-col justify-center items-center gap-y-6 sm:gap-y-5 transition duration-300 ease-in-out"
        v-if="activeStatus === 'failed'"
      >
        <!-- IMAGE ICON -->
        <div class="img-icon">
          <img :src="renderImg('failed-payment.png')" alt="FailedPayment" />
        </div>

        <!-- TITLE TEXT -->
        <div class="title-text">Payment Failed</div>

        <!-- DESCRIPTION TEXT -->
        <div class="description-text">
          "Oops! Something went wrong with your payment. Please check your
          details and try again. If the issue persists, contact your bank or our
          support team."
        </div>

        <button class="btn btn-primary" @click="retryCustomerPayment">
          Retry payment
        </button>
      </div>

      <!-- SUCCESS VIEW -->
      <div
        class="flex flex-col justify-center items-center gap-y-6 sm:gap-y-5 transition duration-300 ease-in-out"
        v-if="activeStatus === 'success'"
      >
        <!-- IMAGE ICON -->
        <div class="img-icon">
          <img :src="renderImg('success-payment.png')" alt="SuccessPayment" />
        </div>

        <!-- TITLE TEXT -->
        <div class="title-text">Payment Successful</div>

        <!-- DESCRIPTION TEXT -->
        <div class="description-text">
          Thank you! Your payment of {{ getPaymentDetails.currency }}
          {{ formatNumber(getPaymentDetails.amount) }} has been successfully
          processed. A receipt has been sent to your email. You may now continue
          with your transaction.
        </div>

        <button class="btn btn-primary" @click="exitTransactionFlow">
          Continue
        </button>
      </div>
    </div>
  </CheckoutWrapper>
</template>

<script setup lang="ts">
import { watch, ref, toRaw } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useExternalStore } from "../store";
import { useString } from "@/shared/composables/useString";
import useEvents from "@/shared/composables/useEvents";
import CheckoutWrapper from "@/modules/external/components/checkout-wrapper.vue";

const route = useRoute();
const router = useRouter();

const { renderImg, formatNumber } = useString();
const activeStatus = ref<string>("pending");

const { processAPIRequest } = useEvents();
const { makePayment } = useExternalStore();
const { getCustomerDetails, getPaymentDetails } =
  storeToRefs(useExternalStore());

const redirectURL = ref<string>(getPaymentDetails.value.redirect_url || "");

const exitTransactionFlow = () => {
  location.href = redirectURL.value;
};

const retryCustomerPayment = () => {
  router.push({
    name: "RedstoneCollectionCheckout",
    params: {
      paymentReference: route.params.paymentReference,
    },
  });
};

const updateTransactionState = (status: string) => {
  activeStatus.value = status;
  router.replace({
    name: route.name,
    params: {
      paymentReference: route.params.paymentReference,
      status,
    },
  });
};

const makeCustomerPayment = async (payload: any) => {
  const response = await processAPIRequest({
    action: makePayment,
    payload: {
      paymentReference: route.params.paymentReference,
      customerDetails: payload,
    },
    showAlert: false,
  });

  if (response.code === 200) {
    updateTransactionState("success");
  } else {
    updateTransactionState("failed");
  }
};

watch(
  [getCustomerDetails, getPaymentDetails],
  ([customerDetails, paymentDetails]) => {
    if (
      Object.keys(customerDetails || {}).length &&
      route.params.status === "pending"
    ) {
      makeCustomerPayment(toRaw(customerDetails));
      redirectURL.value = paymentDetails?.redirect_url;
    }
  },
  { immediate: true }
);

watch(
  () => route.params.status,
  (status) => {
    if (["pending", "success", "failed"].includes(status as string)) {
      activeStatus.value = status as string;
    } else {
      activeStatus.value = "pending";
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.checkout-container {
  @apply flex flex-col justify-center items-center gap-y-6 sm:gap-y-5;

  .img-icon {
    img {
      @apply w-[80px] sm:w-[70px] h-auto;
    }
  }

  .title-text {
    @apply text-xl sm:text-lg font-semibold text-teal-900;
  }

  .description-text {
    @apply text-[14.5px] sm:text-sm leading-6 sm:leading-[25px] text-grey-700/85 text-center sm:w-full mb-1;
  }
}
</style>
