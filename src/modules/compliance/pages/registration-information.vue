<template>
  <ComplianceDisplayBlock
    title="Business registration information"
    description="Provide your registered business details, so Redstone PGS can verify your business information."
    showActionRow
    @onBackClick="router.push({ name: 'RedstoneBusinessConfirm' })"
    @onContinueClick="router.push({ name: 'RedstoneRegistrationConfirm' })"
  >
    <div class="content-block">
      <TextFieldInput
        labelId="businessRegistrationNumber"
        labelTitle="Business Registration Number"
        :inputType="IInputType.Text"
        inputPlaceholder="Provide your business registration number"
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

const router = useRouter();
</script>

<style lang="scss" scoped>
.content-block {
  // @apply ;
}
</style>
