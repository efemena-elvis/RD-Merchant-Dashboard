<template>
  <AuthWrapper title_text="Create a Merchant Account">
    <form @submit.prevent="handleUserSignup">
      <!-- EMAIL ADDRESS -->
      <TextFieldInput
        labelId="businessEmail"
        labelTitle="Email address"
        :inputType="IInputType.Email"
        :inputValue="signupPayload.email"
        inputPlaceholder="hello@companyname.com"
        isRequired
        @inputChanged="signupPayload.email = $event"
        @inputValidated="payloadValidity.email = $event"
        :errorHandler="{
          validator: 'validateEmail',
        }"
      />

      <!-- BUSINESS NAME -->
      <TextFieldInput
        labelId="businessName"
        labelTitle="Business name"
        :inputType="IInputType.Text"
        :inputValue="signupPayload.business_name"
        inputPlaceholder="Provide a registered business name"
        isRequired
        @inputChanged="signupPayload.business_name = $event"
        @inputValidated="payloadValidity.business_name = $event"
        :errorHandler="{
          validator: 'validateRequired',
          message: 'Business name is a required field',
        }"
      />

      <!-- BUSINESS LOCATION -->
      <SelectFieldInput
        labelId="businessCountry"
        labelTitle="Business location"
        inputPlaceholder="Select country of business registeration"
        :inputValue="signupPayload.country_id"
        :selectData="validCountries"
        isRequired
        @onSelectionChange="signupPayload.country_id = $event"
      />

      <!-- PASSWORD -->
      <TextFieldInput
        labelId="userPassword"
        labelTitle="Choose a password"
        :inputType="IInputType.Password"
        :inputValue="signupPayload.password"
        inputPlaceholder="Please enter your password"
        :hasBottomPadding="false"
        isRequired
        @inputChanged="signupPayload.password = $event"
        @inputValidated="payloadValidity.password = $event"
        :errorHandler="{
          validator: 'validatePasswordStrength',
        }"
      />

      <div class="helper-row mt-4 mb-6">
        <div class="text text-grey-600/55 text-[11px]">
          By clicking the “<span class="font-semibold">Create your account</span
          >” button, you agree to Redstone's
          <a href="">terms and conditions</a> and <a href="">data policy</a>.
        </div>
      </div>

      <button
        class="btn btn-primary w-full -mt-1"
        ref="signupBtnRef"
        :disabled="isSignupReady"
      >
        Create your account
      </button>

      <div class="helper-row justify-center mt-5">
        <div class="text">
          Already have an account?
          <router-link :to="{ name: 'RedstoneLogin' }">Login</router-link>
        </div>
      </div>
    </form>
  </AuthWrapper>

  <teleport to="body" v-if="showVerifyModal">
    <VerifyAccountModal @closeTriggered="toggleVerifyModal" />
  </teleport>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { IInputType } from "@/models/form-type";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/modules/auth/store";
import { useGeneralStore } from "@/store/general";
import useEvents from "@/shared/composables/useEvents";
import AuthWrapper from "@/modules/auth/components/auth-wrapper.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import SelectFieldInput from "@/shared/components/form-comps/select-field-input.vue";
import VerifyAccountModal from "@/modules/auth/modals/verify-account-modal.vue";

type ISignupInputType = {
  business_name: string;
  country_id: string;
  email: string;
  password: string;
};

type IInputValidity = {
  business_name: boolean;
  email: boolean;
  password: boolean;
};

const signupPayload = ref<ISignupInputType>({
  business_name: "",
  country_id: "98e7ad5b-d718-41d1-ab38-10a245ff4279",
  email: "",
  password: "",
});

const payloadValidity = ref<IInputValidity>({
  business_name: false,
  email: false,
  password: false,
});

const router = useRouter();
const signupBtnRef = ref(null);

const { signupUser } = useAuthStore();
const { getBusinessCountries } = useGeneralStore();
const { processAPIRequest } = useEvents();

const isSignupReady = computed(() => {
  return signupPayload.value.email &&
    signupPayload.value.password &&
    signupPayload.value.business_name &&
    signupPayload.value.country_id &&
    payloadValidity.value.email &&
    payloadValidity.value.password &&
    payloadValidity.value.business_name
    ? false
    : true;
});

const getSignupPayload = computed(() => {
  const { email, password, business_name, country_id } = signupPayload.value;
  return { email, password, business_name, country_id };
});

const showVerifyModal = ref(false);
const validCountries = ref<{ value: string; name: string }[]>([]);

const toggleVerifyModal = () => {
  showVerifyModal.value = !showVerifyModal.value;
};

const fetchCountries = async () => {
  const response = await processAPIRequest({
    action: getBusinessCountries,
    payload: {},
  });

  if (response.code === 200) {
    const getZambia = response.data.filter(
      (country: any) => country.name === "Zambia"
    );

    if (getZambia.length > 0) {
      validCountries.value = [
        {
          value: getZambia[0].id,
          name: getZambia[0].name,
        },
      ];

      signupPayload.value.country_id = getZambia[0].id;
    }
  }
};

const handleUserSignup = async () => {
  const response = await processAPIRequest({
    action: signupUser,
    payload: getSignupPayload.value,
    btnRef: signupBtnRef,
    btnText: "Create your account",
    alertHandler: {
      201: {
        message: "Merchant account created",
        description: "Proceed to verify your account email address",
        type: "success",
      },

      400: {
        message: "Account creation failed",
        type: "error",
      },
    },
  });

  // REDIRECT TO EMAIL VERIFICATION PAGE
  if (response.code === 201) {
    setTimeout(() => {
      router.push({
        name: "RedstoneVerifyEmail",
        query: { email: encodeURIComponent(signupPayload.value.email) },
      });
      localStorage.clear();
    }, 2000);
  }
};

onMounted(() => fetchCountries());
</script>
