<template>
  <div>
    <div class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-800">
        Customize Your Storefront Domain
      </h2>
      <p class="mt-2 text-gray-600 2xl:w-[60%] sm:w-[90%] text-[14px]">
        Make your store truly yours by setting up a custom domain. A branded
        domain enhances credibility, improves customer trust, and strengthens
        your online presence. Register a new domain in just a few steps. 🚀
      </p>
    </div>
    <div class="flex items-center w-full gap-4">
      <div
        :class="domainCheckError ? 'border-red-500' : 'border-gray-300'"
        class="flex items-center 2xl:w-[55%] xl:w-[60%] sm:w-[90%] gap-3 p-4 border rounded-lg hover:border-green-400/80 focus:border-green-400"
      >
        <Globe class="text-gray-400" :size="16" />
        <input
          v-model="domain"
          type="text"
          class="w-full text-lg bg-transparent border-none gray-500"
          placeholder="Enter a domain name. e.g. 'example.com'."
        />
      </div>
      <button
        :disabled="domain.trim() === ''"
        @click="handleCheckDomain"
        class="btn-primary btn-sm btn"
      >
        <img
          src="@/shared/assets/images/loading_icon.gif"
          v-if="domainIsLoading"
          class="w-[20px]"
        />
        <span v-else>Search</span>
      </button>
    </div>
    <div class="py-2 text-sm text-red-500" v-if="domainCheckError">
      {{ domainCheckError }}
    </div>
    <div
      v-if="!domainCheckError && domainDetails"
      class="flex items-center justify-between mt-6 xl:w-[75%] 2xl:w-[70%] sm:w-full"
    >
      <div class="flex items-center gap-3">
        <SearchCheck
          v-if="isDomainAvailable"
          :size="16"
          class="text-[#2c9a4b] mt-1"
        />
        <X v-else :size="16" class="mt-1 text-red-600" />
        <div>
          <p>
            <span class="italic font-bold">{{ checkedDomain }} </span> is
            <span
              class="text-small"
              :class="isDomainAvailable ? 'text-[#2c9a4b]' : 'text-red-600'"
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
import { ref, computed, reactive, onMounted, watch } from "vue";
import { Globe, SearchCheck, X } from "lucide-vue-next";
import useEvents from "@/shared/composables/useEvents";
import { useStorefrontStore } from "../store";
import {
  addDomainConfig,
  initiateDomainPayment,
  registerDomain,
} from "../store/actions";
import { useRoute } from "vue-router";
import { useString } from "@/shared/composables/useString";
import { inject } from "vue";
import { Emitter } from "mitt";
import { useProfile } from "@/shared/composables/useProfile";

type Events = {
  hidePageLoader: void;
  showPageLoader: void;
};

const route = useRoute();

type registerDomainPayload = {
  domain: String;
  domain_duration: Number;
  store_id: String;
};

const props = defineProps(["store"]);

const { createAndClickAnchor } = useString();
const eventBus = inject<Emitter<Events>>("eventBus");

const { processAPIRequest, pushToastAlert } = useEvents();
const { lookUpDomain } = useStorefrontStore();
const { getBusiness } = useProfile();
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

onMounted(() => {
  console.log("Business Profile:", newProfile.value);
});

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
      showAlert: false,
    });

    if (response.code === 200) {
      domainDetails.value = response;
      checkedDomain.value = domain.value;

      if(newProfile.value?.businessMode === "test"){
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
const handleAddDomainConfig = async () => {
  try {
    const response = await processAPIRequest({
      action: addDomainConfig,
      payload: registerDomainPayload.value,
      showAlert: true,
    });

    if (response.code === 200) {
      pushToastAlert({
        message: "Domain registered successfully.",
        description: "",
        type: "success",
      });
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

</script>

<style scoped>
.btn {
  @apply w-[82px] h-[46px] py-3 sm:py-3 px-7 text-grey-800/80 border text-[13px];
}

.btn-primary {
  @apply text-neutral-10;
}
</style>
