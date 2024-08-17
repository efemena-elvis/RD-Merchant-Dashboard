<template>
  <ComplianceDisplayBlock
    title="Provide your business bank account number"
    description="Ensure the name on your bank account matches the legal business name you provided."
    showActionRow
    @onBackClick="router.push({ name: 'RedstoneRepresentativeConfirm' })"
    @onContinueClick="router.push({ name: 'RedstoneSignatoryProfile' })"
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
  </ComplianceDisplayBlock>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { IInputType } from "@/models/form-type";
import ComplianceDisplayBlock from "@/modules/compliance/components/compliance-display-block.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import SelectFieldInput from "@/shared/components/form-comps/select-field-input.vue";

const router = useRouter();
</script>

<style lang="scss" scoped>
.content-block {
  // @apply ;
}
</style>
