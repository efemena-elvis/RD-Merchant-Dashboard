<template>
  <SettingsDisplayBlock
    title="Provide your business bank account number"
    description="Ensure the name on your bank account matches the legal business name you provided."
    showActionRow
    @onContinueClick="saveChanges"
  >
    <div class="content-block mb-10">
      <SelectFieldInput
        labelId="bankName"
        labelTitle="Bank Name"
        inputPlaceholder="Select your bank name"
        inputBaseColor="bg-grey-10"
        inputValue=""
        :selectData="[
          { value: 'first_bank', name: 'First bank' },
          { value: 'gtbank', name: 'Guaranty trust bank' },
          { value: 'zenith_bank', name: 'Zenith bank' },
        ]"
      />

      <TextFieldInput
        labelId="bankAccountNumber"
        labelTitle="Bank Account Number"
        :inputType="IInputType.Text"
        inputPlaceholder="Provide your bank account number"
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
import SelectFieldInput from "@/shared/components/form-comps/select-field-input.vue";

const saveChanges = () => {
  console.log("Saving changes");
};
</script>

<style lang="scss" scoped>
.content-block {
  // @apply ;
}
</style>
