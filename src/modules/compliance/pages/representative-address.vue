<template>
  <ComplianceDisplayBlock
    title="How can we reach your representative?"
    description="Provide the residential address details of your business representative."
    showActionRow
    @onBackClick="router.push({ name: 'RedstoneRepresentativeIdentity' })"
    @onContinueClick="router.push({ name: 'RedstoneRepresentativeConfirm' })"
  >
    <div class="content-block mb-12">
      <TextFieldInput
        labelId="residentialAddressLine1"
        labelTitle="Residential Address Line 1"
        :inputType="IInputType.Text"
        inputPlaceholder="Provide your residential address"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
      />

      <TextFieldInput
        labelId="residentialAddressLine2"
        labelTitle="Residential Address Line 2 (Optional)"
        :inputType="IInputType.Text"
        inputPlaceholder="Provide your other residential address"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
      />

      <TextFieldInput
        labelId="residentialCity"
        labelTitle="Residential City"
        :inputType="IInputType.Text"
        inputPlaceholder="Provide your residential city"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
      />

      <SelectFieldInput
        labelId="residentialState"
        labelTitle="Residential State"
        inputPlaceholder="Provide your residential state"
        inputBaseColor="bg-grey-10"
        inputValue=""
        :selectData="[
          { value: 'lagos', name: 'Lagos' },
          { value: 'edo', name: 'Edo' },
        ]"
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
