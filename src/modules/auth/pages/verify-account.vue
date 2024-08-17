<template>
  <AuthWrapper
    title_text="Verify your account"
    meta_text="Enter the OTP code we sent to <br> <span class='grey-800 font-semibold'>elvis@vesicash.com</span>"
    center_title
  >
    <form>
      <TextFieldInput
        :inputType="IInputType.Number"
        inputPlaceholder=""
        :isRequired="true"
      />

      <button class="btn btn-primary w-full">Verify email address</button>
    </form>
  </AuthWrapper>
</template>

<script lang="ts" setup>
import AuthWrapper from "@/modules/auth/components/auth-wrapper.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import { IInputType } from "@/models/form-type";
</script>
