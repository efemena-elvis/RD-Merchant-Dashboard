<template>
  <AuthWrapper title_text="Request password reset">
    <form>
      <!-- EMAIL ADDRESS -->
      <TextFieldInput
        labelId="businessEmail"
        labelTitle="Email address"
        :inputType="IInputType.Email"
        inputPlaceholder="hello@companyname.com"
        :isRequired="true"
      />

      <button class="btn btn-primary w-full">Request password reset</button>

      <div class="helper-row justify-center mt-5">
        <div class="text">
          Remember your password?
          <router-link to="/login">Login</router-link>
        </div>
      </div>
    </form>
  </AuthWrapper>
</template>

<script lang="ts" setup>
import AuthWrapper from "@/modules/auth/components/auth-wrapper.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import { IInputType } from "@/models/form-type";
</script>
