<template>
  <ComplianceDisplayBlock
    title="Tell us more about your business"
    description="As a financial services company, we would need to verify your business registration information."
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'RedstoneDocuments' })"
    @onContinueClick="handleBusinessProfileUpdate"
  >
    <div class="content-block">
      <TextFieldInput
        labelId="businessName"
        labelTitle="Legal Business Name"
        :inputType="IInputType.Text"
        :inputValue="businessPayload.legal_name"
        inputPlaceholder="Provide registered business name"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        :isDisabled="true"
        @inputChanged="businessPayload.legal_name = $event"
        @inputValidated="payloadValidity.legal_name = $event"
        :errorHandler="{
          validator: 'validateRequired',
          message: 'Legal business name is a required field',
        }"
      />

      <TextFieldInput
        labelId="tradingName"
        labelTitle="Trading Name"
        :inputType="IInputType.Text"
        :inputValue="businessPayload.trading_name"
        inputPlaceholder="Provide a commonly known business name"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @inputChanged="businessPayload.trading_name = $event"
        @inputValidated="payloadValidity.trading_name = $event"
        :errorHandler="{
          validator: 'validateRequired',
          message: 'Trading name is a required field',
        }"
      />

      <TextFieldInput
        labelId="businessDescription"
        labelTitle="Nature of Business"
        :inputType="IInputType.Text"
        :inputValue="businessPayload.description"
        inputPlaceholder="Provide a detailed nature of your business"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        :isTextArea="true"
        @inputChanged="businessPayload.description = $event"
        @inputValidated="payloadValidity.description = $event"
        :errorHandler="{
          validator: 'validateRequired',
          message: 'Business description is a required field',
        }"
      />

      <TextFieldInput
        labelId="businessRegistrationDate"
        labelTitle="Business Registration Date"
        :inputType="IInputType.Date"
        :inputValue="businessPayload.registration_date"
        inputPlaceholder="Provide your business registration date"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @inputChanged="businessPayload.registration_date = $event"
        @inputValidated="payloadValidity.registration_date = $event"
        :errorHandler="{
          validator: 'validateRequired',
          message: 'Registration date is a required field',
        }"
      />

      <SelectFieldInput
        labelId="businessSector"
        labelTitle="Business Sector"
        inputPlaceholder="Select business sector"
        :inputValue="businessPayload.sector"
        inputBaseColor="bg-grey-10"
        :selectData="businessSectors"
        isRequired
        @onSelectionChange="businessPayload.sector = $event"
      />
    </div>
  </ComplianceDisplayBlock>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { IInputType } from "@/models/form-type";
import { useProfile } from "@/shared/composables/useProfile";
import { businessSectors } from "@/modules/compliance/constant/compliance-navigation-list";
import { useComplianceUtil } from "../composable/useComplianceUtil";
import { useComplianceStore } from "@/modules/compliance/store";
import ComplianceDisplayBlock from "@/modules/compliance/components/compliance-display-block.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import SelectFieldInput from "@/shared/components/form-comps/select-field-input.vue";
import { storeToRefs } from "pinia";

type IBusinessType = {
  legal_name: string;
  trading_name: string;
  description: string;
  registration_date: string;
  sector: string;
};

type IInputValidity = {
  legal_name: boolean;
  trading_name: boolean;
  description: boolean;
  registration_date: boolean;
  sector: boolean;
};

const router = useRouter();
const { handleComplianceRequest } = useComplianceUtil();
const { getComplianceBusiness } = storeToRefs(useComplianceStore());

const stopClickHandler = ref<boolean>(false);

const { getBusiness } = useProfile();
const getBusinessProfile = computed(() => getBusiness());

const businessPayload = ref<IBusinessType>({
  legal_name: getBusinessProfile.value.businessName,
  trading_name:
    getComplianceBusiness.value?.trading_name ||
    getBusinessProfile.value.businessName,
  description: getComplianceBusiness.value?.description || "",
  registration_date: getComplianceBusiness.value?.registration_date || "",
  sector: getComplianceBusiness.value?.sector || "",
});

const payloadValidity = ref<IInputValidity>({
  legal_name: false,
  trading_name: false,
  description: false,
  registration_date: false,
  sector: false,
});

const isActionReady = computed(() => {
  return businessPayload.value.legal_name &&
    businessPayload.value.trading_name &&
    businessPayload.value.description &&
    businessPayload.value.registration_date &&
    businessPayload.value.sector
    ? false
    : true;
});

const getBusinessPayload = computed(() => {
  const { legal_name, trading_name, description, registration_date, sector } =
    businessPayload.value;
  return {
    legal_name,
    trading_name,
    description,
    registration_date,
    sector,
  };
});

const handleBusinessProfileUpdate = async () => {
  await handleComplianceRequest({
    payload: getBusinessPayload,
    redirectRoute: "RedstoneBusinessContact",
    stopClickHandler,
    succesMsg: "Business profile submitted",
    errorMsg: "Business update failed",
    payloadType: "business",
  });
};

watch(
  getComplianceBusiness,
  (newValue) => {
    if (newValue) {
      businessPayload.value = {
        legal_name: getBusinessProfile.value.businessName,
        trading_name:
          newValue.trading_name || getBusinessProfile.value.businessName,
        description: newValue.description || "",
        registration_date: newValue.registration_date || "",
        sector: newValue.sector || "",
      };
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
