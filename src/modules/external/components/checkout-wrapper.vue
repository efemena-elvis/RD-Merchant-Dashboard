<template>
  <!-- CLOSE ICON -->
  <div class="close-icon-btn" title="Close" @click="cancelTransaction">
    <div class="icon icon-times"></div>
  </div>

  <div class="checkout-wrapper">
    <div class="checkout-ui">
      <!-- CHECKOUT UI TOP -->
      <div class="checkout-ui--top">
        <div class="checkout-ui--top--left">
          <!-- REDSTONE BRAND ICON -->
          <div class="brand-icon">
            <img :src="renderImg('redstone-dark.svg')" alt="RedstonePGS" />
          </div>
        </div>

        <div class="checkout-ui--top--right">
          <div class="help-text">Amount to pay</div>
          <div class="payment-amount">
            {{ paymentDetails.currency }}
            {{ formatNumber(paymentDetails.amount) }}
          </div>
        </div>
      </div>

      <!-- CHECKOUT UI BASE -->
      <div class="checkout-ui--base">
        <slot></slot>
      </div>
    </div>

    <!-- SECURE BLOCK -->
    <div class="secure-block">
      <div class="secure-icon icon-shield-tick"></div>
      <div class="secure-text">Secured by <span>REDSTONE</span></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useColor } from "@/shared/composables/useColor";
import { useRoute } from "vue-router";
import { useString } from "@/shared/composables/useString";
import { useExternalStore } from "../store";
import useEvents from "@/shared/composables/useEvents";

const route = useRoute();
const { setPageBackgroundColor } = useColor();
const { renderImg, formatNumber } = useString();

const { processAPIRequest } = useEvents();
const { fetchPaymentDetails } = useExternalStore();

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

const cancelTransaction = () => {
  location.href = paymentDetails.value.redirect_url;
};

const loadpPaymentDetails = async (paymentReference: string) => {
  const response = await processAPIRequest({
    action: fetchPaymentDetails,
    payload: { paymentReference },
    showAlert: false,
  });

  if (response.code === 200) {
    paymentDetails.value = response.data;
  }
};

watch(
  () => route.params.paymentReference,
  (paymentReference) => {
    loadpPaymentDetails(paymentReference as string);
  },
  { immediate: true }
);

onMounted(() => {
  setPageBackgroundColor("#f2f3f2");
});
</script>

<style scoped lang="scss">
.close-icon-btn {
  @apply fixed top-8 md:top-6 xs:top-4 right-8 md:right-6 xs:right-3 rounded-full size-10 min-w-10 min-h-10 bg-neutral-10 flex justify-center items-center cursor-pointer transition duration-300 ease-in-out hover:bg-green-10;

  .icon {
    @apply text-2xl font-medium text-grey-700;
  }
}

.checkout-wrapper {
  @apply w-full h-screen flex flex-col justify-start items-center bg-[#f0f0f0];

  .checkout-ui {
    @apply w-[32%] xl:w-[40%] lg:w-1/2 mdLg:w-[60%] md:w-[70%] sm:w-[80%] xs:w-[94%] mt-20 border border-grey-200/45 shadow-sm rounded-lg bg-neutral-10;

    &--top {
      @apply px-8 md:px-6 xs:px-4 py-[26px] md:py-6 xs:py-5 flex justify-between items-center gap-x-4 border-b border-b-grey-200/60;

      &--left {
        .brand-icon {
          img {
            @apply md:w-[135px] xs:w-[128px] h-auto;
          }
        }
      }

      &--right {
        @apply flex flex-col justify-center items-end;

        .help-text {
          @apply text-sm md:text-[13px] xs:text-[12.5px] leading-6 xs:leading-5 text-grey-600/80;
        }

        .payment-amount {
          @apply text-xl md:text-lg xs:text-[17px] text-teal-900 font-semibold;
        }
      }
    }

    &--base {
      @apply px-8 md:px-6 xs:px-4 pb-10 md:pb-9 pt-11 md:pt-9 bg-grey-10/35;
    }
  }

  .secure-block {
    @apply flex justify-center items-center gap-x-2 mt-7 text-teal-900/70;

    .secure-icon {
      @apply text-lg;
    }

    .secure-text {
      @apply text-[13.5px];

      span {
        @apply font-semibold;
      }
    }
  }
}
</style>
