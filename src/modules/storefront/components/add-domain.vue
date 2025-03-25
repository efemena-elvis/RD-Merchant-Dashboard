<template>
  <div>
    <div class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-800">
        Customize Your Storefront Domain
      </h2>
      <p class="mt-2 text-gray-600">
        Make your store truly yours by setting up a custom domain. A branded
        domain enhances credibility, improves customer trust, and strengthens
        your online presence. Register a new domain in just a few steps. 🚀
      </p>
    </div>
    <div class="flex items-center gap-4">
      <div
        :class="domainCheckError ? 'border-red-500' : 'border-gray-300'"
        class="flex items-center w-[75%] gap-3 p-3 border rounded-md hover:border-green-400/80 focus:border-green-400"
      >
        <Globe class="text-gray-400" :size="16" />
        <input
          v-model="domain"
          type="text"
          class="w-full text-gray-500 border-none bg-transaparent"
          placeholder="Enter a domain name, e.g 'example.com'."
        />
      </div>
      <button
        :disabled="domain.trim() === ''"
        @click="handleCheckDomain"
        class="p-3 rounded-md bg-[#2c9a4b] text-white w-[18%] flex justify-center items-center disabled:opacity-50 hover:opacity-50"
      >
        <img
          src="@/shared/assets/images/loading_icon.gif"
          v-if="domainIsLoading"
          class="w-[18px]"
        />
        <span v-else>Search</span>
      </button>
    </div>
    <div class="text-red-500 text-sm py-2" v-if="domainCheckError">
      {{ domainCheckError }}
    </div>
    <div
      v-if="!domainCheckError && domainDetails"
      class="flex items-center justify-between mt-6"
    >
      <div class="flex items-center w-1/2 gap-3">
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
        v-if = "isDomainAvailable"
          class="bg-green-300 p-1 rounded-full 2xl:w-[100px] sm:w-[80px] text-center font-semibold text-[12px]"
        >
          ZMW8,000
        </div>
        <button
          @click="initiatePayment"
          v-if="isDomainAvailable"
          class="bg-black rounded-md p-2 2xl:w-[120px] xl:w-[100px] sm:w-[80px] hover:opacity-50 text-white"
        >
          Buy
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Globe, SearchCheck, X } from "lucide-vue-next";
import useEvents from "@/shared/composables/useEvents";
import { useStorefrontStore } from "../store";
import { initiateDomainPayment } from "../store/actions";
import { useRoute } from "vue-router";

const route = useRoute();
const { processAPIRequest } = useEvents();
const { lookUpDomain, fetchStoreById } = useStorefrontStore();

const domain = ref<string>("");
const checkedDomain = ref<string>("")
const domainIsLoading = ref<boolean>(false);
const loading = ref<boolean>(false);
const storeDetails = ref();
const domainDetails = ref();
const domainCheckError = ref<string>("");

const domainPattern = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

const isDomainAvailable = computed(
  () => domainDetails.value?.data === "AVAILABLE"
);

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
      payload: { domain: domain.value },
      showAlert: false,
    });

    if (response.code === 200) {
      domainDetails.value = response;
      checkedDomain.value = domain.value
 
    } else {
      domainCheckError.value = "Domain lookup failed. Try a different domain or retry.";
    }
  } catch (error: any) {
    domainCheckError.value = error.message || "Something went wrong.";
  } finally {
    domainIsLoading.value = false;
  }
};

// Fetch Store Details
const getStoreDetails = async () => {
  loading.value = true;
  try {
    const response = await processAPIRequest({
      action: fetchStoreById,
      payload: { storeId: route.params.storeId },
      showAlert: false,
    });

    storeDetails.value = response;
  } catch (error) {
    console.error("Error fetching store details:", error);
  } finally {
    loading.value = false;
  }

};

// Initiate Payment
const initiatePayment = async () => {
  if (!storeDetails.value?.data?.business_id) {
    console.error("Store details missing.");
    return;
  }

  const response = await processAPIRequest({
    action: initiateDomainPayment,
    payload: {
      payload: {
        currency: "ZMW",
        country: "ZM",
        narration: "Domain purchase",
        method: "mobilemoney",
        amount: 1.3,
        redirect_url: "",
        email: "",
        customer_first_name: "",
        customer_last_name: "",
        phone_number: "260977777777",
      },
      businessId: storeDetails.value.data.business_id,
    },
    showAlert: true,
  });

  console.log(response);
};

onMounted(getStoreDetails);
</script>

<style scoped></style>
