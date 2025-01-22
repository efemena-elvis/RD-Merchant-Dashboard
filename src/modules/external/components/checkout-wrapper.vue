<template>
  <!-- CLOSE ICON -->
  <div class="close-icon-btn" title="Close" @click="cancelTransaction">
    <div class="icon icon-times"></div>
  </div>

  <div class="checkout-wrapper">
    <div class="checkout-ui">
      <!-- CHECKOUT UI TOP -->
      <div class="checkout-ui--top">
        <div class="text-xl font-medium">Select payment method</div>
        <div class="grid grid-cols-2 gap-6 mt-8 mb-2">
          <div
            class="rounded-lg border border-grey-200 shadow-md p-3 relative cursor-pointer hover:border-teal-400"
            :class="{ 'border-teal-400': selected_payment_method === 'card' }"
          >
            <div class="space-y-1 mx-auto grid place-items-center">
              <span class="text-sm text-grey-700">CARD</span>
              <div class="w-10 h-6 border"></div>
            </div>
            <div
              class="size-4 bg-teal-500 grid place-items-center rounded-full absolute right-2 top-2"
              v-if="selected_payment_method === 'card'"
            >
              <div class="icon icon-checkmark text-white"></div>
            </div>
          </div>
          <div
            class="rounded-lg border border-grey-200 shadow-md p-3 relative cursor-pointer hover:border-teal-400"
            :class="{
              'border-teal-400': selected_payment_method === 'mobilemoney',
            }"
          >
            <div class="space-y-1 mx-auto grid place-items-center">
              <span class="text-sm text-grey-700">MOBILE MONEY</span>
              <div class="w-10 h-6 border"></div>
            </div>
            <div
              class="size-4 bg-teal-500 grid place-items-center rounded-full absolute right-2 top-2"
              v-if="selected_payment_method === 'mobilemoney'"
            >
              <div class="icon icon-checkmark text-white"></div>
            </div>
          </div>
          <div
            class="col-span-2 border-2 border-grey-200 shadow-md p-3 rounded-lg text-center text-lg font-semibold text-green-600"
          >
            Pay
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

const selected_payment_method = ref("card");

const updatePaymentMethod = (method: string) => {
  selected_payment_method.value = method;
};

const { processAPIRequest } = useEvents();
const {
  fetchPaymentDetails,
  mutateCardPaymentContext,
  fetchCardPaymentContext,
  mutateCardPaymentForm,
} = useExternalStore();

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

watch(
  () => paymentDetails.value.method,
  (data) => {
    selected_payment_method.value = data;
  }
);

const cancelTransaction = () => {
  location.href = paymentDetails.value.redirect_url;
};

const loadpPaymentDetails = async (paymentReference: string) => {
  const response = await processAPIRequest({
    action: fetchPaymentDetails,
    payload: { paymentReference },
    showAlert: false,
  });

  // const contextResponse = await processAPIRequest({
  //   action: fetchCardPaymentContext,
  //   payload: {},
  //   showAlert: false,
  // });

  // console.log({ contextResponse });

  if (response.code === 200) {
    paymentDetails.value = response.data;
    const context =
      "eyJraWQiOiJ6dSIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJWclg5T0kwSVRwbzMxclhScmVLZVFoQUFFT2JUK0tCWEx2aExodjljOUtoSVU5MTNkdmZtZUVSNlh3MzdFcUNJemNEWmVZUVV3RCtQRjN1V3o0SUsraWJrQkZleTV6c2hBVnptajJXcHdJUHdMdFFLb0RyWmx6MzdoQnRiWjJmbDBYWlZnUWdvR2FHNHYvWmJHTzJnWnBmc1hRXHUwMDNkXHUwMDNkIiwib3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20iLCJqd2siOnsia3R5IjoiUlNBIiwiZSI6IkFRQUIiLCJ1c2UiOiJlbmMiLCJuIjoic0s3bWJPZFI0NDV2bFMyTUFUR2NDVlVQS3ZVTy0yM0dUQS1kdzE2QXRsMkVUUmxXcUkyeDZJM0xqLVFGTDRZUGZzeTBmNXQ3YUxpTGZUS3JkR3d5SzUzVHFxY29TRDNzdlhadUwzMU95X19pRS1IM093QnoyUk9sSmFDVWV4MUpiSEJvZjA2ckFaRl96ZjRCRVR2WnlGMjBTU2VwcFhMU29TSDhUbU02c1dHOUtzbTY0RjJGMlZZdjYwLVBZbEthaFN5Mm5wbnJKdXVZRy1nb0h1SUowZmZ0OG1yNUk2aEozRFM2ZnJQemVoWWJNSkEzX19vYWpHZmZteXE2dVdHU0oyZEp5dkhWd0JlNTc5OW8zVjV4a256OGxfTUx6OEktVWY4WDZGVWVCOXdlczh1aGFpMmpaQ0ZVTFVsZnM1YXZGU1VTMFMyREJoTi1uS1dObE56WG1RIiwia2lkIjoiMDh2QUtOQnJ0Y205VVlZdGtCNnV1UVhCNnVJYzlWUFcifX0sImN0eCI6W3siZGF0YSI6eyJjbGllbnRMaWJyYXJ5SW50ZWdyaXR5Ijoic2hhMjU2LXZkWWkxaDV1ZTNwcm5iVC8xYThJSkxlUkNrSGVqSHBkRGR3My95RkxaREFcdTAwM2QiLCJjbGllbnRMaWJyYXJ5IjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20vbWljcm9mb3JtL2J1bmRsZS92Mi41LjEvZmxleC1taWNyb2Zvcm0ubWluLmpzIiwiYWxsb3dlZENhcmROZXR3b3JrcyI6WyJWSVNBIiwiTUFTVEVSQ0FSRCIsIkFNRVgiLCJDQVJORVQiLCJDQVJURVNCQU5DQUlSRVMiLCJDVVAiLCJESU5FUlNDTFVCIiwiRElTQ09WRVIiLCJFRlRQT1MiLCJFTE8iLCJKQ0IiLCJKQ1JFVyIsIk1BREEiLCJNQUVTVFJPIiwiTUVFWkEiXSwidGFyZ2V0T3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjgwNjUiXSwibWZPcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImFsbG93ZWRQYXltZW50VHlwZXMiOlsiQ0FSRCJdfSwidHlwZSI6Im1mLTIuMS4wIn1dLCJpc3MiOiJGbGV4IEFQSSIsImV4cCI6MTczNzM5MDUxMiwiaWF0IjoxNzM3Mzg5NjEyLCJqdGkiOiJNeFp1WURzSkVwZHpqazk4In0.WZQc3GfOi3dU12PU7vY84INUMKi29jY5j__SZkXjLrRpytzyu78SCK6RAJloS8Ej0iaix4P_abw4VqZUiVXsTTPFy2m0SiWYBaEUWJF8FxlxgSLe-0yzPDEmLSiCpR34IDpynTbsut09ad-5tFcupjgdueKeJobRISz1cWfZm3hbouLI3vOorZ4X5Z5SWFSAYUk3C_IkQweGjMmZVVbNBafFIC4rMIAdd2vGfXkb2EjkOjt8r3bdPk0IbWyhRT_093qiZIwUVHigVnAMdMtYhUM9lLLO1mvlom3w5PEQSJ9Qs0T0Bq4ik76nnBoDl5wzrJaOS66V8HIbReJXzDf9uw";
    loadCardFrom(context);
  }
};

const loadCardFrom = async (context: string) => {
  const head = document.getElementsByTagName("head")[0];
  const script = document.createElement("script");
  const clientLibraryIntegrity =
    "sha256-vdYi1h5ue3prnbT/1a8IJLeRCkHejHpdDdw3/yFLZDA=";
  script.type = "text/javascript";
  script.async = true;
  script.onload = () => {
    const flex = new Flex(
      "eyJraWQiOiJ6dSIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJaS2RUWjVOa0FRS1F4L1RDeXhoMU5oQUFFTFN6RG51elg1Wml4RGs1NnVWbFJxenZSZDV6U1RiZktqcGlZd3V0Yjk5VXQ5WEhWYytIYllOS2JPa1VPRndPcnV1R0dNOUsxWW1zWmRtcVE5SUNMSUg1Y3pxTFNZOWRlaEZmL0dGOHFnS2JBV0d6cVZwcmovdnJ4WitBUVBYcWNBXHUwMDNkXHUwMDNkIiwib3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20iLCJqd2siOnsia3R5IjoiUlNBIiwiZSI6IkFRQUIiLCJ1c2UiOiJlbmMiLCJuIjoiNlFmOE5adENTY1RPWmtqMV9RUW9zeERyUWV6a1lNckdkRmdWX1p5T2szTGtEcnZ2SlRwXzRyanU5eUNIQkc4R2V5UHc5RGdBZXFVZDV0Rk9sOWZnN3Q0cVJTTTQxejFoXzB0QmRINUVJMnYyWWNzRks3U3N6TmxEbGt6MnZsZVg2WmtLaVRoVDNub1NOWkR5Z3ozMmRsejRuSkZ6Ynp1d2xwdG4yWW02M1pLVGpFNWJiTzlWdm9HQ3BTWnFwakFSMVh3dFJ6OTh3emtxdUs0RGJ6QVZVcklmTTBEYVlUMVAyeGZXNm1TQzZfeXNKRl8tbV9JWVo2ekFyb1JkSFRoQXZtWE1GUGlsZWZKbktpUUN5R1JWSE4xNGZfWFczU3VyWTgxbVpNUVk4SWdhaVFJYWM3cFpGbW9IZTJQVDRVZ182c1NRdUxLRXhfcVFXWmhVQ2dPZF9RIiwia2lkIjoiMDhBQVROYm9ic1VTdGZRM0ZBbk16Y0UyUHJ6Yld4QUQifX0sImN0eCI6W3siZGF0YSI6eyJjbGllbnRMaWJyYXJ5SW50ZWdyaXR5Ijoic2hhMjU2LXZkWWkxaDV1ZTNwcm5iVC8xYThJSkxlUkNrSGVqSHBkRGR3My95RkxaREFcdTAwM2QiLCJjbGllbnRMaWJyYXJ5IjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20vbWljcm9mb3JtL2J1bmRsZS92Mi41LjEvZmxleC1taWNyb2Zvcm0ubWluLmpzIiwiYWxsb3dlZENhcmROZXR3b3JrcyI6WyJWSVNBIiwiTUFTVEVSQ0FSRCIsIkFNRVgiLCJDQVJORVQiLCJDQVJURVNCQU5DQUlSRVMiLCJDVVAiLCJESU5FUlNDTFVCIiwiRElTQ09WRVIiLCJFRlRQT1MiLCJFTE8iLCJKQ0IiLCJKQ1JFVyIsIk1BREEiLCJNQUVTVFJPIiwiTUVFWkEiXSwidGFyZ2V0T3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjgwNjUiXSwibWZPcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImFsbG93ZWRQYXltZW50VHlwZXMiOlsiQ0FSRCJdfSwidHlwZSI6Im1mLTIuMS4wIn0seyJkYXRhIjp7ImNoZWNrb3V0QXBpSW5pdGlhbGl6YXRpb24iOnsiY3VycmVuY3kiOiJaTVciLCJhbW91bnQiOiIzIn19LCJ0eXBlIjoic2EtMS4wLjAifV0sImlzcyI6IkZsZXggQVBJIiwiZXhwIjoxNzM3NDcwMDI2LCJpYXQiOjE3Mzc0NjkxMjYsImp0aSI6Ikd3QVpZb3I0RDVMU0RNdUQifQ.aAQuiUBwwiu3J82RRBsEmqvdYJpfg5RVIm_hHhyLQ2xbQc2QA7cd1aOzBU9yPdNxa4yyXmANYhXFMEoC9dc9SDdydTivC80uRdN8sdV95mSUJK1SMLn7WtqfcLvyjqz6oqh0SM4kxMRjs2b3pxAyA7BaJBgSj8rSIV09TyHOR2olECPhLw6APO7S_9Y9rght0u8p-C3LK-DCLNoo7ejY9D-mNLIPfzTbMxk_QqzVu44HurHpo6dP_uAjrtki-WfAe8Z1AXZnZt-lGO43vHN5jcP8kwZVWGRAFZwQMTTHmNCd40HnV0GSLbpHxHniHnUrc25j4ouJVTu-rwa7WeIMgg"
    );
    const form = flex.microform("card");
    mutateCardPaymentForm(form);
    const cardNumber = form.createField("number", {
      placeholder: "4444 4444 4444 4444",
      class: "bg-red-500",
    });
    mutateCardPaymentContext(form);
    const cvvNumber = form.createField("securityCode", { placeholder: "123" });
    cardNumber.load("#number-container");
    cvvNumber.load("#securityCode-container");
  };
  //url extracted from the JWT
  script.src =
    "https://testflex.cybersource.com/microform/bundle/v2.5.1/flex-microform.min.js";
  //integrity extracted from the JWT
  if (clientLibraryIntegrity) {
    script.integrity = clientLibraryIntegrity;
    script.crossOrigin = "anonymous";
  }
  head.appendChild(script);
};

// CYBERSOURCE_TEST_MERCHANT_ID=abz_redstone_1196542_zmw
// CYBERSOURCE_TEST_KEY_ID=736da51d-f1d6-482a-8b93-f170879a16f8
// CYBERSOURCE_TEST_SECRET_KEY=Wkie3YCYfkaLFz8gzCwgqwLD9YfxkKUUvbiL8TzuJSA=

const testpYalod = {
  clientReferenceInformation: {
    code: "PY_3c6e0011a68d4aefb496a75a6",
  },
  paymentInformation: {
    card: {
      number: "4456530000001096",
      expirationMonth: "05",
      expirationYear: "2025",
    },
  },
  orderInformation: {
    amountDetails: {
      totalAmount: "6",
      currency: "ZMW",
    },
    billTo: {
      address1: "1 Independence Avenue",
      address2: "Suite 2B",
      administrativeArea: "Lusaka",
      country: "ZM",
      locality: "Lusaka",
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "260978123456",
      email: "test@example.com",
      postalCode: "10101",
    },
  },
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
