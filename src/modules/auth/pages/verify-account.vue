<template>
  <AuthWrapper
    title_text="Verify your email address"
    :meta_text="`An confirmation code has been sent to your email address at <span class='grey-800 font-semibold'>${userEmailAddress}</span>`"
  >
    <form @submit.prevent="handleUserEmailVerification" class="mt-4">
      <!-- CONFIRMATION CODE -->
      <TextFieldInput
        labelId="confirmationCode"
        labelTitle="Confirmation code"
        :inputType="IInputType.Number"
        :inputValue="verifyPayload.token"
        inputPlaceholder="Provide the confirmation code received"
        isRequired
        @inputChanged="verifyPayload.token = $event"
        @inputValidated="tokenValidity = $event"
        :errorHandler="{
          validator: 'validateRequired',
          message: 'Please enter a confirmation code',
        }"
      />

      <div class="helper-row -mt-3 mb-8">
        <div class="text text-grey-600/60 text-xs">
          Didn't receive a confirmation code?
          <span
            v-if="resendCountdown === 0"
            class="link"
            @click="triggerTokenResend"
            >Resend code</span
          >
          <span v-else class="text-green-500" @click="triggerTokenResend"
            >Resending in 0.{{ resendCountdown }}s</span
          >
        </div>
      </div>

      <button
        class="btn btn-primary w-full"
        ref="verifyBtnRef"
        :disabled="isVerifyReady"
      >
        Verify email address
      </button>
    </form>
  </AuthWrapper>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { IInputType } from "@/models/form-type";
import { useAuthStore } from "../store";
import useEvents from "@/shared/composables/useEvents";
import AuthWrapper from "@/modules/auth/components/auth-wrapper.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";

type IVerifyInputType = {
  email: string;
  token: string;
};

const route = useRoute();
const router = useRouter();

const userEmailAddress = ref<string | null>(null);
const tokenValidity = ref<boolean>(false);
const verifyBtnRef = ref(null);
const resendCountdown = ref<number>(0);

const verifyPayload = ref<IVerifyInputType>({
  email: "",
  token: "",
});

if (!Array.isArray(route.query.email)) {
  const decodedEmail = decodeURIComponent(route.query.email as string);

  userEmailAddress.value = decodedEmail || "No email address";
  verifyPayload.value.email = decodedEmail || "";
}

const isVerifyReady = computed(() => {
  return verifyPayload.value.email && verifyPayload.value.token ? false : true;
});

const { sendVerifyEmail, verifyEmail } = useAuthStore();
const { processAPIRequest } = useEvents();

const getVerifyPayload = computed(() => {
  const { email, token } = verifyPayload.value;
  return { email, token: token.toString() };
});

const handleUserEmailVerification = async () => {
  const response = await processAPIRequest({
    action: verifyEmail,
    payload: getVerifyPayload.value,
    btnRef: verifyBtnRef,
    btnText: "Verify email address",
    alertHandler: {
      200: {
        message: "Email address verified",
        description: "Proceed to login and gain access to your dashboard",
        type: "success",
      },

      400: {
        message: "Email verification failed",
        type: "error",
      },
    },
  });

  if (response.code === 200) {
    setTimeout(() => router.push({ name: "RedstoneLogin" }), 1200);
  }
};

const triggerResetCountdown = (count: number) => {
  resendCountdown.value = count;

  const intervalCall = setInterval(() => {
    resendCountdown.value -= 1;

    if (resendCountdown.value === 0) clearInterval(intervalCall);
  }, 1000);
};

const triggerTokenResend = async () => {
  await sendOutEmailToken();
  triggerResetCountdown(15);
};

// SEND OUT EMAIL VERIFICATION
const sendOutEmailToken = async () => {
  await processAPIRequest({
    action: sendVerifyEmail,
    payload: { email: userEmailAddress.value },
    showAlert: false,
  });
};

onMounted(async () => await sendOutEmailToken());
</script>
