<template>
  <ComplianceDisplayBlock
    title="Let's meet your business representative"
    description="A business representative could either be an owner, director or shareholder of your business."
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    @onBackClick="router.push({ name: 'RedstoneRegistrationConfirm' })"
    @onContinueClick="handleRepresentativeProfileUpdate"
  >
    <div class="content-block mb-10">
      <TextFieldInput
        labelId="legalFirstName"
        labelTitle="Legal First Name"
        :inputType="IInputType.Text"
        :inputValue="businessPayload.legal_first_name"
        inputPlaceholder="Provide legal first name"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @inputChanged="businessPayload.legal_first_name = $event"
        :errorHandler="{
          validator: 'validateRequired',
          message: 'Legal first name is a required field',
        }"
      />

      <TextFieldInput
        labelId="legalLastName"
        labelTitle="Legal Last Name"
        :inputType="IInputType.Text"
        :inputValue="businessPayload.legal_last_name"
        inputPlaceholder="Provide legal last name"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @inputChanged="businessPayload.legal_last_name = $event"
        :errorHandler="{
          validator: 'validateRequired',
          message: 'Legal last name is a required field',
        }"
      />

      <TextFieldInput
        labelId="dateOfBirth"
        labelTitle="Date of Birth"
        :inputType="IInputType.Date"
        :inputValue="businessPayload.dob"
        inputPlaceholder="Provide representative date of birth"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @inputChanged="businessPayload.dob = $event"
        @inputValidated="payloadValidity.dob = $event"
        :errorHandler="{
          validator: 'validateDateRange',
          range: 18,
          message: 'Date of birth should be over 18 years',
        }"
      />

      <SelectFieldInput
        labelId="nationality"
        labelTitle="Nationality"
        inputPlaceholder="Select your representative nationality"
        inputBaseColor="bg-grey-10"
        :inputValue="businessPayload.nationality"
        :selectData="countryList"
        isRequired
        @onSelectionChange="businessPayload.nationality = $event"
      />

      <MultiSelectFieldInput
        labelId="businessRole"
        labelTitle="Business Role"
        inputPlaceholder="Select your representative business role"
        inputBaseColor="bg-grey-10"
        :inputValueList="[]"
        :selectData="[
          { value: 'owner', name: 'Owner' },
          { value: 'director', name: 'Director' },
          { value: 'shareholder', name: 'Shareholder' },
        ]"
        isRequired
        @onSelectionChange="businessPayload.business_role = $event"
      />

      <TextFieldInput
        v-if="
          businessPayload.business_role.includes('owner') ||
          businessPayload.business_role.includes('shareholder')
        "
        labelId="percentageOwnership"
        labelTitle="Percentage ownership of the business"
        :inputType="IInputType.Number"
        :inputValue="businessPayload.percentage_ownership"
        inputPlaceholder="Provide the percentage ownership of the business"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @inputChanged="businessPayload.percentage_ownership = $event"
        :errorHandler="{
          validator: 'validateRequired',
          message: 'Percentage ownership is a required field',
        }"
      />
    </div>
  </ComplianceDisplayBlock>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, toRaw } from "vue";
import { useRouter } from "vue-router";
import { IInputType } from "@/models/form-type";
import countries from "@/shared/constants/country-list";
import ComplianceDisplayBlock from "@/modules/compliance/components/compliance-display-block.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import SelectFieldInput from "@/shared/components/form-comps/select-field-input.vue";
import MultiSelectFieldInput from "@/shared/components/form-comps/multi-select-field-input.vue";

type IBusinessType = {
  legal_first_name: string;
  legal_last_name: string;
  dob: string;
  nationality: string;
  business_role: string[];
  percentage_ownership: number;
};

type IInputValidity = {
  dob: boolean;
};

const router = useRouter();
const countryList = ref<{ value: string; name: string }[]>([]);

const businessPayload = ref<IBusinessType>({
  legal_first_name: "",
  legal_last_name: "",
  dob: "",
  nationality: "",
  business_role: [],
  percentage_ownership: 0,
});

const payloadValidity = ref<IInputValidity>({
  dob: false,
});

const percentageOwnershipProvided = computed(() => {
  const { business_role, percentage_ownership } = businessPayload.value;

  if (
    business_role.includes("owner") ||
    business_role.includes("shareholder")
  ) {
    return percentage_ownership > 0 ? true : false;
  }

  return true;
});

const isActionReady = computed(() => {
  return businessPayload.value.legal_first_name &&
    businessPayload.value.legal_last_name &&
    businessPayload.value.dob &&
    payloadValidity.value.dob &&
    businessPayload.value.nationality &&
    businessPayload.value.business_role.length &&
    percentageOwnershipProvided.value
    ? false
    : true;
});

const getBusinessPayload = computed(() => {
  const {
    legal_first_name,
    legal_last_name,
    dob,
    nationality,
    business_role,
    percentage_ownership,
  } = businessPayload.value;

  return {
    legal_first_name,
    legal_last_name,
    dob,
    nationality,
    business_role: toRaw(business_role),
    percentage_ownership,
  };
});

const handleRepresentativeProfileUpdate = () => {
  // router.push({ name: 'RedstoneRepresentativeIdentity' })

  console.log("PAYLOAD", getBusinessPayload.value);
};

onMounted(() => {
  countryList.value = countries.map(({ country }) => {
    const countryData = {
      value: country.toLowerCase(),
      name: country,
    };

    return countryData;
  });
});
</script>

<style lang="scss" scoped>
.content-block {
  // @apply ;
}
</style>
