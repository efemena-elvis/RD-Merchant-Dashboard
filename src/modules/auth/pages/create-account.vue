<template>
  <AuthWrapper title_text="Welcome to Redstone">
    <form>
      <!-- EMAIL ADDRESS -->
      <TextFieldInput
        labelId="businessEmail"
        labelTitle="Email address"
        :inputType="IInputType.Email"
        inputPlaceholder="hello@companyname.com"
        isRequired
        :showVerifyEmail="true"
        @verifyClicked="toggleVerifyModal"
      />

      <!-- BUSINESS NAME -->
      <TextFieldInput
        labelId="businessName"
        labelTitle="Business name"
        :inputType="IInputType.Text"
        inputPlaceholder="Provide a registered business name"
        isRequired
      />

      <!-- BUSINESS LOCATION -->
      <SelectFieldInput
        labelId="businessCountry"
        labelTitle="Business location"
        inputPlaceholder="Select country of business registeration"
        inputValue="zambia"
        :selectData="[
          { value: 'nigeria', name: 'Nigeria' },
          { value: 'ghana', name: 'Ghana' },
          { value: 'zambia', name: 'Zambia' },
        ]"
        isRequired
      />

      <!-- PASSWORD -->
      <TextFieldInput
        labelId="userPassword"
        labelTitle="Choose a password"
        :inputType="IInputType.Password"
        inputPlaceholder="Please enter your password"
        :hasBottomPadding="false"
        isRequired
      />

      <div class="helper-row mt-4 mb-6">
        <div class="text text-grey-600/55 text-[11px]">
          By clicking the “<span class="font-semibold">Create your account</span
          >” button, you agree to Redstone's
          <a href="">terms and conditions</a> and <a href="">data policy</a>.
        </div>
      </div>

      <button class="btn btn-primary w-full -mt-1">Create your account</button>

      <div class="helper-row justify-center mt-5">
        <div class="text">
          Already have an account?
          <router-link :to="{ name: 'RedstoneLogin' }">Login</router-link>
        </div>
      </div>
    </form>
  </AuthWrapper>

  <teleport to="body" v-if="show_verify_modal">
    <VerifyAccountModal @closeTriggered="toggleVerifyModal" />
  </teleport>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import AuthWrapper from "@/modules/auth/components/auth-wrapper.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import SelectFieldInput from "@/shared/components/form-comps/select-field-input.vue";
import VerifyAccountModal from "@/modules/auth/modals/verify-account-modal.vue";
import { IInputType } from "@/models/form-type";

const show_verify_modal = ref(false);

const toggleVerifyModal = () => {
  show_verify_modal.value = !show_verify_modal.value;
};
</script>
