<template>
  <ComplianceDisplayBlock
    title="Business registration information"
    description="Provide your registered business number, so Redstone can verify your business information."
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'RedstoneBusinessConfirm' })"
    @onContinueClick="handleRegistrationInformationUpdate"
  >
    <div class="content-block">
      <TextFieldInput
        labelId="businessRegistrationNumber"
        labelTitle="Business Registration Number"
        :inputType="IInputType.Text"
        :inputValue="businessPayload.number"
        inputPlaceholder="Provide your business registration number"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @inputChanged="businessPayload.number = $event"
        :errorHandler="{
          validator: 'validateRequired',
          message: 'Business registration number is a required field',
        }"
      />

      <TextFieldInput
        labelId="businessTaxNumber"
        labelTitle="Tax Payer Identification Number (TPIN)"
        :inputType="IInputType.Text"
        :inputValue="businessPayload.tpin"
        inputPlaceholder="Provide your business TPIN"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @inputChanged="businessPayload.tpin = $event"
        :errorHandler="{
          validator: 'validateRequired',
          message: 'TPIN is a required field',
        }"
      />
    </div>
  </ComplianceDisplayBlock>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { IInputType } from "@/models/form-type";
import { useComplianceUtil } from "../composable/useComplianceUtil";
import { useComplianceStore } from "@/modules/compliance/store";
import ComplianceDisplayBlock from "@/modules/compliance/components/compliance-display-block.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import { storeToRefs } from "pinia";

type IBusinessType = {
  number: string;
  tpin: string;
};

const router = useRouter();
const { handleComplianceRequest } = useComplianceUtil();
const { getComplianceRegistration } = storeToRefs(useComplianceStore());

const stopClickHandler = ref<boolean>(false);

const businessPayload = ref<IBusinessType>({
  number: getComplianceRegistration.value?.number || "",
  tpin: getComplianceRegistration.value?.tpin || "",
});

const isActionReady = computed(() => {
  return businessPayload.value.number.length &&
    businessPayload.value.tpin.length
    ? false
    : true;
});

const getBusinessPayload = computed(() => {
  return { ...businessPayload.value };
});

const handleRegistrationInformationUpdate = async () => {
  await handleComplianceRequest({
    payload: getBusinessPayload,
    redirectRoute: "RedstoneRegistrationConfirm",
    stopClickHandler,
    succesMsg: "Registration information submitted",
    errorMsg: "Registration update failed",
    payloadType: "registration",
  });
};

watch(
  getComplianceRegistration,
  (newValue) => {
    if (newValue) {
      businessPayload.value = {
        number: newValue.number || "",
        tpin: newValue.tpin || "",
      };
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
