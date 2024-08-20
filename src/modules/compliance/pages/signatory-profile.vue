<template>
  <ComplianceDisplayBlock
    title="Let's meet your business signatory"
    description="A business signatory could either be an owner, director or shareholder of your business."
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    @onBackClick="router.push({ name: 'RedstoneBankAccount' })"
    @onContinueClick="handleSignatoryProfileUpdate"
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
        inputPlaceholder="Provide signatory date of birth"
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
        inputPlaceholder="Select signatory nationality"
        inputBaseColor="bg-grey-10"
        :inputValue="businessPayload.nationality"
        :selectData="countryList"
        isRequired
        @onSelectionChange="businessPayload.nationality = $event"
      />

      <TextFieldInput
        labelId="jobTitle"
        labelTitle="Signatory Job Title"
        :inputType="IInputType.Text"
        :inputValue="businessPayload.job_title"
        inputPlaceholder="Provide the job title of signatory"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @inputChanged="businessPayload.job_title = $event"
        :errorHandler="{
          validator: 'validateRequired',
          message: 'Job title is a required field',
        }"
      />
    </div>
  </ComplianceDisplayBlock>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { IInputType } from "@/models/form-type";
import countries from "@/shared/constants/country-list";
import ComplianceDisplayBlock from "@/modules/compliance/components/compliance-display-block.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import SelectFieldInput from "@/shared/components/form-comps/select-field-input.vue";

type IBusinessType = {
  legal_first_name: string;
  legal_last_name: string;
  dob: string;
  nationality: string;
  job_title: string;
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
  job_title: "",
});

const payloadValidity = ref<IInputValidity>({
  dob: false,
});

const isActionReady = computed(() => {
  return businessPayload.value.legal_first_name &&
    businessPayload.value.legal_last_name &&
    businessPayload.value.dob &&
    payloadValidity.value.dob &&
    businessPayload.value.nationality &&
    businessPayload.value.job_title
    ? false
    : true;
});

const getBusinessPayload = computed(() => {
  const { legal_first_name, legal_last_name, dob, nationality, job_title } =
    businessPayload.value;

  return {
    legal_first_name,
    legal_last_name,
    dob,
    nationality,
    job_title,
  };
});

const handleSignatoryProfileUpdate = () => {
  // router.push({ name: 'RedstoneSignatoryIdentity' })

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
