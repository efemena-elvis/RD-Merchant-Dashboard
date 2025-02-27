<template>
  <!-- CLOSE ICON -->
  <div class="close-icon-btn" title="Close" @click="cancelTransaction">
    <div class="icon icon-times"></div>
  </div>

  <div class="checkout-wrapper">
    <div class="checkout-ui">
      <div class="py-6" v-if="loading_payment_details">
        <SkeletonCheckout />
      </div>

      <template v-else>
        <!-- CHECKOUT UI TOP -->
        <div class="checkout-ui--top" :class="isCheckoutStatusRoute && 'pt-10'">
          <template v-if="!isCheckoutStatusRoute">
            <div class="text-xl font-semibold">Payment Checkout</div>

            <div
              class="grid grid-cols-2 gap-6 mt-8 mb-2"
              v-if="isCardCheckoutEnabled"
            >
              <!-- CARD -->
              <div
                class="rounded-lg border shadow-md p-3 relative cursor-pointer hover:border-green-500 transition-colors"
                :class="[
                  paymentMethod === 'card'
                    ? 'border-2 border-green-600'
                    : 'border-grey-200',
                ]"
                @click="mutatePaymentMethod('card')"
              >
                <div class="space-y-3 mx-auto grid place-items-center">
                  <div class="w-10 h-6 mb-1">
                    <img :src="renderImg('card.svg')" alt="money" />
                  </div>

                  <div class="text-sm text-grey-700 font-medium mt-2">CARD</div>
                </div>
                <div
                  class="size-4 bg-green-600 grid place-items-center rounded-full absolute right-2 top-2"
                  v-if="paymentMethod === 'card'"
                >
                  <div class="icon icon-checkmark text-white"></div>
                </div>
              </div>

              <!-- MOBILE MONEY -->
              <div
                class="rounded-lg border shadow-md p-3 relative cursor-pointer hover:border-green-500 transition-colors"
                :class="[
                  paymentMethod === 'mobilemoney'
                    ? 'border-2 border-green-600'
                    : 'border-grey-200',
                ]"
                @click="mutatePaymentMethod('mobilemoney')"
              >
                <div class="space-y-3 mx-auto grid place-items-center">
                  <div class="w-10 h-6 mb-1">
                    <img :src="renderImg('money.svg')" alt="money" />
                  </div>

                  <div class="text-sm text-grey-700 font-medium mt-2">
                    MOBILE MONEY
                  </div>
                </div>
                <div
                  class="size-4 bg-green-600 grid place-items-center rounded-full absolute right-2 top-2"
                  v-if="paymentMethod === 'mobilemoney'"
                >
                  <div class="icon icon-checkmark text-white"></div>
                </div>
              </div>

              <!-- <div
              class="col-span-2 border-2 border-grey-200 shadow-md p-3 rounded-lg text-center text-lg font-semibold text-green-600"
            >
              Pay
              {{ paymentDetails.currency }}
              {{ formatNumber(paymentDetails.amount) }}
            </div> -->
            </div>
          </template>
        </div>

        <!-- CHECKOUT UI BASE -->
        <div class="checkout-ui--base">
          <slot></slot>
        </div>
      </template>
    </div>

    <!-- SECURE BLOCK -->
    <div class="secure-block">
      <div class="secure-icon icon-shield-tick"></div>
      <div class="secure-text">Secured by <span>REDSTONE</span></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useColor } from "@/shared/composables/useColor";
import { useRoute } from "vue-router";
import { useString } from "@/shared/composables/useString";
import { useExternalStore } from "../store";
import useEvents from "@/shared/composables/useEvents";
import type { PaymentMethods } from "@/models/api-type";
import { storeToRefs } from "pinia";
import SkeletonCheckout from "@/modules/external/components/skeleton-checkout.vue";
import { jwtDecode } from "jwt-decode";

const route = useRoute();
const { setPageBackgroundColor } = useColor();
const { renderImg, formatNumber } = useString();

const { processAPIRequest } = useEvents();
const {
  fetchPaymentDetails,
  mutateCardPaymentContext,
  fetchCardPaymentContext,
  mutateCardPaymentForm,
  mutatePaymentMethod,
  mutateCardNumberInput,
  mutateCardSecurityInput,
} = useExternalStore();

const { paymentMethod } = storeToRefs(useExternalStore());
const loading_payment_details = ref(false);

const isCardCheckoutEnabled = ref(true);

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

const isCheckoutStatusRoute = computed(() => {
  return route.name === "RedstoneCollectionCheckoutStatus";
});

const cancelTransaction = () => {
  location.href = paymentDetails.value.redirect_url;
};

const loadpPaymentDetails = async (paymentReference: string) => {
  loading_payment_details.value = true;

  const response = await processAPIRequest({
    action: fetchPaymentDetails,
    payload: { paymentReference },
    showAlert: false,
  });

  if (response.code === 200) {
    paymentDetails.value = response.data;
    mutatePaymentMethod(paymentDetails.value.method as PaymentMethods);

    if (!isCardCheckoutEnabled.value) {
      loading_payment_details.value = false;
      return;
    }

    const contextResponse = await processAPIRequest({
      action: fetchCardPaymentContext,
      payload: {
        currency: paymentDetails.value.currency,
        amount: paymentDetails.value.amount,
      },
      showAlert: false,
    });
    contextResponse?.data?.capture_token &&
      loadPaymentCardform(contextResponse.data.capture_token);
  }
};

const loadPaymentCardform = async (token: string) => {
  const context = jwtDecode(token);
  const capture_context = context?.ctx?.[0]?.data;
  const head = document.getElementsByTagName("head")[0];
  const script = document.createElement("script");
  const clientLibraryIntegrity = capture_context?.clientLibraryIntegrity;
  script.type = "text/javascript";
  script.async = true;
  script.onload = async () => {
    loading_payment_details.value = false;
    const flex = new Flex(token);
    const form = flex.microform("card");
    const cardNumberInput = form.createField("number", {
      placeholder: "4444 4444 4444 4444",
    });
    const cardSecurityInput = form.createField("securityCode", {
      placeholder: "123",
    });
    mutateCardNumberInput(cardNumberInput);
    mutateCardSecurityInput(cardSecurityInput);
    mutateCardPaymentForm(form);
    mutateCardPaymentContext(token);
  };
  script.src = capture_context?.clientLibrary;
  if (clientLibraryIntegrity) {
    script.integrity = clientLibraryIntegrity;
    script.crossOrigin = "anonymous";
  }
  head.appendChild(script);
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
    @apply w-[36%] xl:w-[40%] lg:w-1/2 mdLg:w-[60%] md:w-[70%] sm:w-[80%] xs:w-[94%] mt-20 border border-grey-200/45 shadow-sm rounded-xl bg-neutral-10;

    &--top {
      @apply px-8 md:px-6 xs:px-4 py-[26px] md:py-6 xs:py-5;

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
      @apply px-8 md:px-6 xs:px-4 pb-10 md:pb-9 pt-4 md:pt-6 bg-grey-10/35;
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
