<template>
  <div class="w-full pb-20">
    <section class="mb-8">
      <h2 class="text-xl font-semibold text-neutral-800">
        Add a Storefront Domain
      </h2>
      <p class="mt-2 text-grey-600/90 text-sm leading-6 w-1/2 sm:w-full">
        Enhance your brand with a custom domain, boost credibility, build trust,
        and strengthen your online presence. Set it up in minutes! 🚀
      </p>
    </section>

    <!-- DOMAIN SEARCH AREA -->
    <div class="w-1/2 sm:w-full">
      <TextFieldInput
        labelId="domain"
        labelTitle=""
        :inputType="IInputType.Search"
        inputPlaceholder="Search storefront domain e.g 'myshop.com'"
        :isRequired="true"
        :hasBottomPadding="false"
        @inputChanged="domain = $event"
        :errorHandler="{
          validator: 'validateDomain',
          message: 'Provide a valid storefront domain URL',
        }"
      />

      <button
        ref="btnRef"
        class="btn btn-sm btn-primary mt-5 "
        :disabled="!domain.trim()"
        @click="handleCheckDomain"
      >
        Search domain
      </button>
    </div>

    <div
      v-if="domainDetails"
      class="flex items-center justify-between mt-6 xl:w-[75%] 2xl:w-[70%] sm:w-full"
    >
      <div class="flex items-center gap-3">
        <p>
          <span class="font-semibold">{{ checkedDomain }}</span>
          is
          <span :class="isDomainAvailable ? 'text-green-600' : 'text-red-600'">
            {{ isDomainAvailable ? "available" : "unavailable" }}
          </span>
        </p>
      </div>

      <div class="flex items-center justify-between w-1/2">
        <div
          v-if="isDomainAvailable"
          class="bg-green-300 p-2 rounded-full w-[120px] text-center font-semibold text-[12px]"
        >
          ZMW{{ formatNumber(domainDetails?.data.price) }}
        </div>

        <button
          v-if="isDomainAvailable"
          :disabled="newProfile?.businessMode === 'test'"
          @click="initiatePayment"
          class="bg-black disabled:opacity-50 rounded-md p-2 2xl:w-[80px] xl:w-[60px] sm:w-[60px] flex justify-center items-center hover:opacity-50 text-white"
        >
          <img
            v-if="isPaymentLoading"
            src="@/shared/assets/images/loading_icon.gif"
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
import { Emitter } from "mitt";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import { IInputType } from "@/models/form-type";
import useEvents from "@/shared/composables/useEvents";
import { useStorefrontStore } from "../store";
import { useString } from "@/shared/composables/useString";
import { useProfile } from "@/shared/composables/useProfile";

const props = defineProps<{ store: { id: string; slug: string } | null }>();

const eventBus = inject<Emitter<any>>("eventBus");
const { getBusiness } = useProfile();
const { createAndClickAnchor, formatNumber } = useString();
const { processAPIRequest, pushToastAlert } = useEvents();
const { lookUpDomain, initiateDomainPayment, registerDomain } =
  useStorefrontStore();

const btnRef = ref(null);
const domain = ref("");
const checkedDomain = ref("");
const domainIsLoading = ref(false);
const domainDetails = ref<any>(null);
const isPaymentLoading = ref(false);

const newProfile = ref<{ businessMode: string } | null>(null);

const domainPattern = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

watch(
  () => getBusiness(),
  (newVal) => {
    if (newVal) newProfile.value = newVal;
  },
  { immediate: true, deep: true }
);

const validateDomain = () => {
  if (!domain.value.trim()) {
    pushToastAlert({
      message: "Invalid input",
      description: "Domain is required",
      type: "error",
    });
    return false;
  } else if (!domainPattern.test(domain.value)) {
    pushToastAlert({
      message: "Invalid input",
      description: "Enter a valid domain.",
      type: "error",
    });
    return false;
  } else {
    return true;
  }
};

const splitDomain = () => {
  const parts = domain.value.split(".");
  return {
    name: parts.slice(0, -1).join("."),
    extension: "." + parts.slice(-1)[0],
  };
};

const isDomainAvailable = computed(
  () => domainDetails.value?.data.response === "AVAILABLE"
);

const registerDomainPayload = computed(() => {
  if (!props.store) return null;
  return {
    domain: checkedDomain.value,
    domain_duration: 1,
    store_id: props.store.id,
  };
});

const getPaymentPayload = computed(() => {
  if (!props.store || !domainDetails.value) return null;
  return {
    currency: "ZMW",
    country: "ZM",
    narration: "Domain purchase",
    method: "mobilemoney",
    amount: domainDetails.value.data.price,
    redirect_url: `/storefront/overview/${props.store.id}?storeSlug=${props.store.slug}`,
    email: "",
    customer_first_name: "",
    customer_last_name: "",
    phone_number: "",
  };
});

const handleCheckDomain = async () => {
  if (!validateDomain()) return;
  domainIsLoading.value = true;

  try {
    const response = await processAPIRequest({
      action: lookUpDomain,
      payload: splitDomain(),
      btnRef,
      btnText: "Search domain",
      showAlert: false,
    });

    if (response.code === 200) {
      domainDetails.value = response;
      checkedDomain.value = domain.value;

      if (
        response.data.response === "AVAILABLE" &&
        newProfile.value?.businessMode === "test"
      ) {
        pushToastAlert({
          message: "Warning",
          description: "Activate your business to buy a domain.",
          type: "warning",
        });
      }
    }
  else{
    pushToastAlert({
          message: "Failed",
          description: "Enter a valid domain extension.",
          type: "error",
        });
  }
    
  } catch (error: any) {
    pushToastAlert({
          message: "Failed",
          description: "Something went wrong.",
          type: "error",
        });

  } finally {
    domainIsLoading.value = false;
  }
 
};

const handleRegisterDomain = async () => {
  if (!registerDomainPayload.value) return;

  try {
    const response = await processAPIRequest({
      action: registerDomain,
      payload: registerDomainPayload.value,
      showAlert: true,
    });

    if (response.code === 200) {
      pushToastAlert({
        message: "Domain registered successfully.",
        type: "success",
      });
      createAndClickAnchor(response.data.payment_link);
    } else {
      pushToastAlert({ message: "Unable to register domain.", type: "error" });
    }
  } catch {
    pushToastAlert({ message: "Something went wrong.", type: "error" });
  }
};

const initiatePayment = async () => {
  if (!getPaymentPayload.value) return;
  isPaymentLoading.value = true;

  const response = await processAPIRequest({
    action: initiateDomainPayment,
    payload: getPaymentPayload.value,
    showAlert: true,
  });

  if (response?.code === 200) {
    handleRegisterDomain();
  } else {
    eventBus?.emit("hidePageLoader");

    const message =
      response?.message === "Unknown Operator"
        ? "Unknown Mobile Operator. Please check phone number and try again."
        : "Unable to process your payment. Please try again later.";

    pushToastAlert({
      message: "Domain payment failed",
      description: message,
      type: "error",
    });
  }

  isPaymentLoading.value = false;
};
</script>

<style scoped lang="scss"></style>
