<template>
  <AuthWrapper title_text="Welcome to Redstone">
    <form @submit.prevent="handleUserLogin">
      <!-- EMAIL ADDRESS -->
      <TextFieldInput
        labelId="businessEmail"
        labelTitle="Email address"
        :inputType="IInputType.Email"
        inputPlaceholder="hello@companyname.com"
        :isRequired="true"
        @inputChanged="loginPayload.email = $event"
        @inputValidated="emailValidity = $event"
        :errorHandler="{
          validator: 'validateEmail',
        }"
      />

      <TextFieldInput
        labelId="userPassword"
        labelTitle="Password"
        :inputType="IInputType.Password"
        inputPlaceholder="Please enter your password"
        :isRequired="true"
        :hasBottomPadding="false"
        @inputChanged="loginPayload.password = $event"
        :errorHandler="{
          validator: 'validateRequired',
          message: 'Password is a required field',
        }"
      />

      <div class="helper-row mt-3 mb-7">
        <div class="text">
          Forgot your password?
          <router-link :to="{ name: 'RedstonePasswordRequest' }"
            >Reset it</router-link
          >
        </div>
      </div>

      <button class="btn btn-primary w-full" :disabled="isLoginReady">
        Login to your dashboard
      </button>

      <div class="helper-row justify-center mt-5">
        <div class="text">
          Don't have an account yet?
          <router-link :to="{ name: 'RedstoneCreateAccount' }"
            >Register now</router-link
          >
        </div>
      </div>
    </form>
  </AuthWrapper>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { IInputType } from "@/models/form-type";
import { useAuthStore } from "@/modules/auth/store";
import AuthWrapper from "@/modules/auth/components/auth-wrapper.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";

type ILoginInputType = {
  email: string;
  password: string;
};

const loginPayload = ref<ILoginInputType>({
  email: "",
  password: "",
});

const emailValidity = ref<boolean>(false);

const { loginUser } = useAuthStore();

const isLoginReady = computed(() => {
  return loginPayload.value.email &&
    loginPayload.value.password &&
    emailValidity.value
    ? false
    : true;
});

const handleUserLogin = async () => {
  const { email, password } = loginPayload.value;

  await loginUser({ email, password });
};
</script>
