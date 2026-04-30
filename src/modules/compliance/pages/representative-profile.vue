<template>
  <ComplianceDisplayBlock
    title="Let's meet your business representative"
    description="A business representative could either be an owner, director or shareholder of your business."
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
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
        :inputValueList="businessPayload.business_role"
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
import { ref, onMounted, computed, toRaw, watch } from "vue";
import { useRouter } from "vue-router";
import { IInputType } from "@/models/form-type";
import countries from "@/shared/constants/country-list";
import ComplianceDisplayBlock from "@/modules/compliance/components/compliance-display-block.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import SelectFieldInput from "@/shared/components/form-comps/select-field-input.vue";
import MultiSelectFieldInput from "@/shared/components/form-comps/multi-select-field-input.vue";
import { useComplianceUtil } from "../composable/useComplianceUtil";
import { useComplianceStore } from "../store";
import { storeToRefs } from "pinia";

type IBusinessType = {
  legal_first_name: string;
  legal_last_name: string;
  dob: string;
  nationality: string;
  business_role: string[];
  percentage_ownership: string;
};

type IInputValidity = {
  dob: boolean;
};

const router = useRouter();
const { handleComplianceRequest } = useComplianceUtil();
const { getComplianceRepresentative } = storeToRefs(useComplianceStore());

const countryList = ref<{ value: string; name: string }[]>([]);
const stopClickHandler = ref<boolean>(false);

const formatBusinessRoles = (
  businessRoleData: string | string[] | undefined
): string[] => {
  try {
    if (!businessRoleData) return []; // Return an empty array if undefined

    if (Array.isArray(businessRoleData)) {
      // Check if the first element of the array is a string with square brackets
      const firstElement = businessRoleData[0];
      if (
        typeof firstElement === "string" &&
        firstElement.startsWith("[") &&
        firstElement.endsWith("]")
      ) {
        // If it has square brackets, parse the string as JSON
        const parsedInnerArray = JSON.parse(firstElement);
        return Array.isArray(parsedInnerArray) ? parsedInnerArray : [];
      }
      // Otherwise, return the array as is
      return businessRoleData;
    }

    // If it's a string, attempt to parse it as JSON
    const parsedString = JSON.parse(businessRoleData);

    // Ensure the parsed string is an array
    return Array.isArray(parsedString) ? parsedString : [];
  } catch (error) {
    console.error("Error parsing business roles:", error);
    return []; // Return an empty array in case of error
  }
};

const businessPayload = ref<IBusinessType>({
  legal_first_name:
    getComplianceRepresentative.value?.[0]?.legal_first_name || "",
  legal_last_name:
    getComplianceRepresentative.value?.[0]?.legal_last_name || "",
  dob: getComplianceRepresentative.value?.[0]?.dob || "",
  nationality: getComplianceRepresentative.value?.[0]?.nationality || "",
  business_role:
    formatBusinessRoles(
      getComplianceRepresentative.value?.[0]?.business_role
    ) || [],

  percentage_ownership:
    getComplianceRepresentative.value?.[0]?.percentage_ownership || "",
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
    return parseFloat(percentage_ownership) > 0 ? true : false;
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
    percentage_ownership: percentage_ownership.toString(),
  };
});

const handleRepresentativeProfileUpdate = async () => {
  await handleComplianceRequest({
    payload: getBusinessPayload,
    redirectRoute: "RedstoneRepresentativeIdentity",
    stopClickHandler,
    succesMsg: "Representative profile submitted",
    errorMsg: "Representative update failed",
    payloadType: "representatives",
  });
};

watch(
  getComplianceRepresentative,
  (newValue) => {
    if (newValue && newValue.length > 0) {
      businessPayload.value = {
        legal_first_name: newValue[0]?.legal_first_name || "",
        legal_last_name: newValue[0]?.legal_last_name || "",
        dob: newValue[0]?.dob || "",
        nationality: newValue[0]?.nationality || "",
        business_role: formatBusinessRoles(newValue[0]?.business_role) || [],
        percentage_ownership: newValue[0]?.percentage_ownership || "",
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
