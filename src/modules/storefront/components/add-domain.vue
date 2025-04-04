<template>
  <div class="w-full pb-20">
    <div class="mb-8">
      <div class="text-xl font-semibold text-neutral-800">
        Add a Storefront Domain
      </div>

      <p class="mt-2 text-grey-600/90 text-sm leading-6 w-1/2">
        Enhance your brand with a custom domain, boost credibility, build trust,
        and strengthen your online presence. Set it up in minutes! 🚀
      </p>
    </div>

    <!-- DOMAIN SEARCH AREA -->
    <div class="w-1/2">
      <TextFieldInput
        labelId="businessEmail"
        labelTitle=""
        :inputType="IInputType.Search"
        inputPlaceholder="Search storefront domain e.g 'myshop.com'"
        :isRequired="true"
        :hasBottomPadding="false"
        @inputChanged="domain = $event"
        @inputValidated=""
        :errorHandler="{
          validator: 'validateDomain',
          message: 'Provide a valid storefront domain URL',
        }"
      />

      <button
        ref="btnRef"
        class="btn btn-sm btn-primary mt-5 w-[180px]"
        :disabled="domain.trim() === ''"
        @click="handleCheckDomain"
      >
        Search domain
      </button>
    </div>

    <div
      v-if="!domainCheckError && domainDetails"
      class="flex items-center justify-between mt-6 xl:w-[75%] 2xl:w-[70%] sm:w-full"
    >
      <div class="flex items-center gap-3">
        <div>
          <p>
            <span class="font-semibold">{{ checkedDomain }} </span> is
            <span
              class="text-small"
              :class="isDomainAvailable ? 'text-green-600' : 'text-red-600'"
            >
              {{ isDomainAvailable ? "available" : "unavailable" }}
            </span>
          </p>
        </div>
      </div>

      <div class="flex items-center justify-between w-1/2">
        <div
          v-if="isDomainAvailable"
          class="bg-green-300 p-1 rounded-full w-[100px] text-center font-semibold text-[12px]"
        >
          ZMW{{ formatNumber(domainDetails?.data.price) }}
        </div>

        <button
          :disabled="newProfile?.businessMode === 'test'"
          @click="initiatePayment"
          v-if="isDomainAvailable"
          class="bg-black disabled:opacity-50 rounded-md p-2 2xl:w-[80px] xl:w-[60px] sm:w-[60px] flex justify-center items-center hover:opacity-50 text-white"
        >
          <img
            src="@/shared/assets/images/loading_icon.gif"
            v-if="isPaymentLoading"
            class="w-[18px]"
          />

          <span v-else>Buy</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, inject } from "vue";
import useEvents from "@/shared/composables/useEvents";
import { useStorefrontStore } from "../store";
import { useString } from "@/shared/composables/useString";
import { useProfile } from "@/shared/composables/useProfile";
import { Emitter } from "mitt";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import { IInputType } from "@/models/form-type";

type Events = {
  hidePageLoader: void;
  showPageLoader: void;
};

type registerDomainPayload = {
  domain: String;
  domain_duration: Number;
  store_id: String;
};

// !!NOTE Add type to your props @Aishat
const props = defineProps(["store"]);
const eventBus = inject<Emitter<Events>>("eventBus");

const { getBusiness } = useProfile();
const { createAndClickAnchor } = useString();

const { processAPIRequest, pushToastAlert } = useEvents();
const { lookUpDomain, initiateDomainPayment, registerDomain, addDomainConfig } =
  useStorefrontStore();

const btnRef = ref(null);

const getBusinessProfile = computed(() => getBusiness());

const newProfile = ref<{
  businessAddress: string;
  disputeEmailAddress: string;
  generalEmailAddress: string;
  businessId: string;
  businessLogo: string;
  businessMode: string;
  businessName: string;
  businessSector: string;
  bankName: string;
} | null>(null);

watch(
  getBusinessProfile,
  (newVal) => {
    if (newVal) {
      newProfile.value = newVal;
    }
  },
  { immediate: true }
);

const domain = ref<string>("");
const checkedDomain = ref<string>("");
const domainIsLoading = ref<boolean>(false);
const domainDetails = ref();
const domainCheckError = ref<string>("");

const registerDomainPayload = computed(() => {
  return {
    domain: checkedDomain?.value,
    domain_duration: 1,
    store_id: props.store?.id,
  };
});

const { formatNumber } = useString();

const getPaymentPayload = computed(() => {
  return {
    currency: "ZMW",
    country: "ZM",
    narration: "Domain purchase",
    method: "mobilemoney",
    amount: domainDetails?.value.data.price,
    redirect_url: `/storefront/overview/${props.store?.id}?storeSlug=${props.store?.slug}`,
    email: "",
    customer_first_name: "",
    customer_last_name: "",
    phone_number: "",
  };
});

const isPaymentLoading = ref<boolean>(false);

const domainPattern = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

const splitDomain = () => {
  if (domain.value) {
    const parts = domain.value.split(".");
    const name = parts.slice(0, -1).join(".");
    const extension = "." + parts.slice(-1)[0];
    return { name, extension };
  }
};
const isDomainAvailable = computed(() => {
  if (domainDetails.value?.data.response === "AVAILABLE") return true;
  else return false;
});

//Validate Domain Function
const validateDomain = () => {
  if (!domain.value.trim()) {
    domainCheckError.value = "Domain is required";
    return false;
  } else if (!domainPattern.test(domain.value)) {
    domainCheckError.value = "Invalid domain format";
    return false;
  } else {
    domainCheckError.value = "";
    return true;
  }
};

// Handle Domain Lookup
const handleCheckDomain = async () => {
  if (!validateDomain()) return;
  domainIsLoading.value = true;

  try {
    const response = await processAPIRequest({
      action: lookUpDomain,
      payload: splitDomain(),
      btnRef: btnRef,
      btnText: "Search domain",
      showAlert: false,
    });

    if (response.code === 200) {
      domainDetails.value = response;
      checkedDomain.value = domain.value;

      if (newProfile.value?.businessMode === "test") {
        pushToastAlert({
          message: "Warning",
          description: "Activate your business to buy a domain.",
          type: "warning",
        });
      }
    } else {
      domainCheckError.value =
        "Failed to lookup domain. Try again or try a different domain extension.";
    }
  } catch (error: any) {
    domainCheckError.value = error.message || "Something went wrong.";
  } finally {
    domainIsLoading.value = false;
  }
};

// Register Dmonain
const handleRegisterDomain = async () => {
  try {
    const response = await processAPIRequest({
      action: registerDomain,
      payload: registerDomainPayload.value,
      showAlert: true,
    });
    if (response.code === 200) {
      pushToastAlert({
        message: "Domain registered successfully.",
        description: "",
        type: "success",
      });
      createAndClickAnchor(response.data.payment_link);
    } else if (response.code === 400) {
      pushToastAlert({
        message: "Unable to register domain",
        description: "Please, try again.",
        type: "error",
      });
    }
  } catch (error) {
    pushToastAlert({
      message: "Something went wrong.",
      description: "Something went wrong. Please, try again.",
      type: "error",
    });
  }
};

// Initiate Domain Payment
const initiatePayment = async () => {
  isPaymentLoading.value = true;
  const response = await processAPIRequest({
    action: initiateDomainPayment,
    payload: getPaymentPayload.value,
    showAlert: true,
  });

  if (response?.code === 200) {
    handleRegisterDomain();
  }

  // HANDLE UNIDENTIFIED MOBILE OPERATOR
  else if (response?.code === 400 && response?.message === "Unknown Operator") {
    eventBus?.emit("hidePageLoader");

    pushToastAlert({
      message: "Unknown Mobile Operator",
      description: "Please check phone number and try again.",
      type: "error",
    });
  }

  // HANDLE ERROR RESPONSE
  else {
    eventBus?.emit("hidePageLoader");

    pushToastAlert({
      message: "Domain payment failed",
      description: "Unable to process your payment. Please try again later.",
      type: "error",
    });
  }
  isPaymentLoading.value = false;
};

// Add Domain Config
// const handleAddDomainConfig = async () => {
//   try {
//     const response = await processAPIRequest({
//       action: addDomainConfig,
//       payload: registerDomainPayload.value,
//       showAlert: true,
//     });

//     if (response.code === 200) {
//       pushToastAlert({
//         message: "Domain registered successfully.",
//         description: "",
//         type: "success",
//       });
//     } else if (response.code === 400) {
//       pushToastAlert({
//         message: "Unable to register domain",
//         description: "Please, try again.",
//         type: "error",
//       });
//     }
//   } catch (error) {
//     pushToastAlert({
//       message: "Something went wrong.",
//       description: "Something went wrong. Please, try again.",
//       type: "error",
//     });
//   }
// };
</script>

<style lang="scss" scoped></style>
