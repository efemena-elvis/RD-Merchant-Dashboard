<template>
  <ComplianceDisplayBlock
    title="Let's meet your business signatory"
    description="A business signatory could either be an owner, director or shareholder of your business."
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
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
    </div>
  </ComplianceDisplayBlock>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { IInputType } from "@/models/form-type";
import countries from "@/shared/constants/country-list";
import ComplianceDisplayBlock from "@/modules/compliance/components/compliance-display-block.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import SelectFieldInput from "@/shared/components/form-comps/select-field-input.vue";
import { useComplianceUtil } from "../composable/useComplianceUtil";
import { useComplianceStore } from "../store";
import { storeToRefs } from "pinia";

type IBusinessType = {
  legal_first_name: string;
  legal_last_name: string;
  dob: string;
  nationality: string;
};

type IInputValidity = {
  dob: boolean;
};

const router = useRouter();
const stopClickHandler = ref<boolean>(false);

const { handleComplianceRequest } = useComplianceUtil();
const { getComplianceBusinessSignatory } = storeToRefs(useComplianceStore());

const countryList = ref<{ value: string; name: string }[]>([]);

const businessPayload = ref<IBusinessType>({
  legal_first_name:
    getComplianceBusinessSignatory.value?.legal_first_name || "",
  legal_last_name: getComplianceBusinessSignatory.value?.legal_last_name || "",
  dob: getComplianceBusinessSignatory.value?.dob || "",
  nationality: getComplianceBusinessSignatory.value?.nationality || "",
});

const payloadValidity = ref<IInputValidity>({
  dob: false,
});

const isActionReady = computed(() => {
  return businessPayload.value.legal_first_name &&
    businessPayload.value.legal_last_name &&
    businessPayload.value.dob &&
    payloadValidity.value.dob &&
    businessPayload.value.nationality
    ? false
    : true;
});

const getBusinessPayload = computed(() => {
  const { legal_first_name, legal_last_name, dob, nationality } =
    businessPayload.value;

  return {
    legal_first_name,
    legal_last_name,
    dob,
    nationality,
  };
});

const handleSignatoryProfileUpdate = async () => {
  await handleComplianceRequest({
    payload: getBusinessPayload,
    redirectRoute: "RedstoneSignatoryIdentity",
    stopClickHandler,
    succesMsg: "Signatory profile submitted",
    errorMsg: "Signatory update failed",
    payloadType: "business_signatory",
  });
};

watch(
  getComplianceBusinessSignatory,
  (newValue) => {
    if (newValue) {
      businessPayload.value = {
        legal_first_name: newValue.legal_first_name || "",
        legal_last_name: newValue.legal_last_name || "",
        dob: newValue.dob || "",
        nationality: newValue.nationality || "",
      };
    }
  },
  { immediate: true }
);

const loadCountryList = () => {
  countryList.value = countries.map(({ country }) => {
    const countryData = {
      value: country.toLowerCase(),
      name: country,
    };

    return countryData;
  });
};

loadCountryList();
</script>

<style lang="scss" scoped></style>
