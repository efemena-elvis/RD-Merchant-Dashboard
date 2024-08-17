<template>
  <ComplianceDisplayBlock
    title="Let's meet your business representative"
    description="A business representative could either be an owner, director or shareholder of your business."
    showActionRow
    @onBackClick="router.push({ name: 'RedstoneRegistrationConfirm' })"
    @onContinueClick="router.push({ name: 'RedstoneRepresentativeIdentity' })"
  >
    <div class="content-block mb-10">
      <TextFieldInput
        labelId="legalFirstName"
        labelTitle="Legal First Name"
        :inputType="IInputType.Text"
        inputPlaceholder="Provide legal first name"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
      />

      <TextFieldInput
        labelId="legalLastName"
        labelTitle="Legal Last Name"
        :inputType="IInputType.Text"
        inputPlaceholder="Provide legal last name"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
      />

      <TextFieldInput
        labelId="dateOfBirth"
        labelTitle="Date of Birth"
        :inputType="IInputType.Date"
        inputPlaceholder="Provide representative date of birth"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
      />

      <SelectFieldInput
        labelId="nationality"
        labelTitle="Nationality"
        inputPlaceholder="Select your representation nationality"
        inputBaseColor="bg-grey-10"
        inputValue=""
        :selectData="countryList"
        isRequired
      />

      <MultiSelectFieldInput
        labelId="businessRole"
        labelTitle="Business Role"
        inputPlaceholder="Select your representation business role"
        inputBaseColor="bg-grey-10"
        :inputValueList="[]"
        :selectData="[
          { value: 'owner', name: 'Owner' },
          { value: 'director', name: 'Director' },
          { value: 'shareholder', name: 'Shareholder' },
        ]"
        isRequired
        @onSelectionChange="handleSelectionChange"
      />

      <TextFieldInput
        v-if="
          selectedRepresentativeRole.includes('owner') ||
          selectedRepresentativeRole.includes('shareholder')
        "
        labelId="percentageOwnership"
        labelTitle="Percentage ownership of the business"
        :inputType="IInputType.Number"
        inputPlaceholder="Provide the percentage ownership of the business"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
      />
    </div>
  </ComplianceDisplayBlock>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { IInputType } from "@/models/form-type";
import countries from "@/shared/constants/country-list";
import ComplianceDisplayBlock from "@/modules/compliance/components/compliance-display-block.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import SelectFieldInput from "@/shared/components/form-comps/select-field-input.vue";
import MultiSelectFieldInput from "@/shared/components/form-comps/multi-select-field-input.vue";

const router = useRouter();
const countryList = ref<{ value: string; name: string }[]>([]);
const selectedRepresentativeRole = ref<string[]>([]);

onMounted(() => {
  countryList.value = countries.map(({ country }) => {
    const countryData = {
      value: country.toLowerCase(),
      name: country,
    };

    return countryData;
  });
});

const handleSelectionChange = (value: string[]) => {
  selectedRepresentativeRole.value = value;
};
</script>

<style lang="scss" scoped>
.content-block {
  // @apply ;
}
</style>
