<template>
  <ComplianceDisplayBlock
    title="Tell us more about your business"
    description="As a financial services company, we would need to verify your business registration information."
    showActionRow
    @onBackClick="router.push({ name: 'RedstoneDocuments' })"
    @onContinueClick="router.push({ name: 'RedstoneBusinessContact' })"
  >
    <div class="content-block">
      <TextFieldInput
        labelId="businessName"
        labelTitle="Legal Business Name"
        :inputType="IInputType.Text"
        inputPlaceholder="Provide registered business name"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
      />

      <TextFieldInput
        labelId="tradingName"
        labelTitle="Trading Name"
        :inputType="IInputType.Text"
        inputPlaceholder="Provide a commonly known business name"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
      />

      <TextFieldInput
        labelId="businessDescription"
        labelTitle="Business Description"
        :inputType="IInputType.Text"
        inputPlaceholder="Provide a detailed business description"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        :isTextArea="true"
      />

      <TextFieldInput
        labelId="businessRegistrationDate"
        labelTitle="Business Registration Date"
        :inputType="IInputType.Date"
        inputPlaceholder="Provide your business registration date"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
      />

      <SelectFieldInput
        labelId="businessLegalForm"
        labelTitle="Business Legal Form"
        inputPlaceholder="Select your business legal form/type"
        inputBaseColor="bg-grey-10"
        :selectData="businessLegalForms"
        isRequired
      />
    </div>
  </ComplianceDisplayBlock>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { IInputType } from "@/models/form-type";
import ComplianceDisplayBlock from "@/modules/compliance/components/compliance-display-block.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import SelectFieldInput from "@/shared/components/form-comps/select-field-input.vue";

const router = useRouter();

const businessLegalForms = ref([
  {
    value: "limited_lianility_company",
    name: "Limited liability company",
  },
  {
    value: "joint_stock_venture",
    name: "Joint stock venture",
  },
  {
    value: "self_employed",
    name: "Self employed",
  },
  {
    value: "general_partnership",
    name: "General partnership",
  },
  {
    value: "limited_partnership",
    name: "Limited partnership",
  },
  {
    value: "society",
    name: "Society",
  },
  {
    value: "government_llc",
    name: "Government LLC",
  },
  {
    value: "foundation",
    name: "Foundation",
  },
  {
    value: "other",
    name: "Other",
  },
]);
</script>

<style lang="scss" scoped></style>
