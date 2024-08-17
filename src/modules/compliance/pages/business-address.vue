<template>
  <ComplianceDisplayBlock
    title="How can we locate your business?"
    description="Provide your business address details so we can identify your physical location for compliance and verification purposes"
    showActionRow
    @onBackClick="router.push({ name: 'RedstoneBusinessContact' })"
    @onContinueClick="router.push({ name: 'RedstoneBusinessConfirm' })"
  >
    <div class="content-block">
      <TextFieldInput
        labelId="businessAddressLine1"
        labelTitle="Business Address Line 1"
        :inputType="IInputType.Text"
        inputPlaceholder="Provide your business address"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
      />

      <TextFieldInput
        labelId="businessAddressLine2"
        labelTitle="Business Address Line 2 (Optional)"
        :inputType="IInputType.Text"
        inputPlaceholder="Provide your other business address"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
      />

      <TextFieldInput
        labelId="businessCity"
        labelTitle="Business City"
        :inputType="IInputType.Text"
        inputPlaceholder="Provide your business city"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
      />

      <SelectFieldInput
        labelId="businessState"
        labelTitle="Business State"
        inputPlaceholder="Provide your business state"
        inputBaseColor="bg-grey-10"
        inputValue=""
        :selectData="zambianProvinces"
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

const zambianProvinces = ref([
  {
    id: 1,
    name: "Central Province",
    value: "Central",
  },
  {
    id: 2,
    name: "Copperbelt Province",
    value: "Copperbelt",
  },
  {
    id: 3,
    name: "Eastern Province",
    value: "Eastern",
  },
  {
    id: 4,
    name: "Luapula Province",
    value: "Luapula",
  },
  {
    id: 5,
    name: "Lusaka Province",
    value: "Lusaka",
  },
  {
    id: 6,
    name: "Muchinga Province",
    value: "Muchinga",
  },
  {
    id: 7,
    name: "Northern Province",
    value: "Northern",
  },
  {
    id: 8,
    name: "North-Western Province",
    value: "North-Western",
  },
  {
    id: 9,
    name: "Southern Province",
    value: "Southern",
  },
  {
    id: 10,
    name: "Western Province",
    value: "Western",
  },
]);
</script>

<style lang="scss" scoped>
.content-block {
  // @apply ;
}
</style>
