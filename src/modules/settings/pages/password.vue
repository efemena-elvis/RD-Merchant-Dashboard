<template>
  <SettingsDisplayBlock
    title="Manage your account authentication"
    description="Keep your account secure by managing your authentication settings."
    showActionRow
    @onContinueClick="saveChanges"
  >
    <div class="content-block mb-12">
      <TextFieldInput
        labelId="oldPassword"
        labelTitle="Old Password"
        :inputType="IInputType.Password"
        inputPlaceholder="Enter your existing password"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
      />

      <TextFieldInput
        labelId="newPassword"
        labelTitle="New Password"
        :inputType="IInputType.Password"
        inputPlaceholder="Enter your new password"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
      />

      <TextFieldInput
        labelId="retypeNewPassword"
        labelTitle="Retype New Password"
        :inputType="IInputType.Password"
        inputPlaceholder="Retype your new password"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
      />
    </div>
  </SettingsDisplayBlock>
</template>

<script lang="ts" setup>
import { IInputType } from "@/models/form-type";
import SettingsDisplayBlock from "@/modules/settings/components/settings-display-block.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import PhoneFieldInput from "@/shared/components/form-comps/phone-field-input.vue";

const saveChanges = () => {
  console.log("Saving changes");
};
</script>

<style lang="scss" scoped></style>
