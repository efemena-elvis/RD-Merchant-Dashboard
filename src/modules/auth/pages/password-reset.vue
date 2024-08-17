<template>
  <AuthWrapper title_text="Confirm password reset">
    <form>
      <!-- PASSWORD -->
      <TextFieldInput
        labelId="password"
        labelTitle="New password"
        :inputType="IInputType.Password"
        inputPlaceholder="Please enter a new password"
        :isRequired="true"
        :showPasswordDisplay="false"
      />

      <!-- CONFIRM PASSWORD -->
      <TextFieldInput
        labelId="confirmPassword"
        labelTitle="Confirm password"
        :inputType="IInputType.Password"
        inputPlaceholder="Please confirm new password"
        :isRequired="true"
        :showPasswordDisplay="false"
      />

      <button class="btn btn-primary w-full">Reset password</button>

      <div class="helper-row justify-center mt-5">
        <div class="text">
          Remember your old password?
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
