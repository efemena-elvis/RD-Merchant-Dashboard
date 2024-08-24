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
};

const router = useRouter();
const { handleComplianceRequest } = useComplianceUtil();
const { getComplianceRegistration } = storeToRefs(useComplianceStore());

const stopClickHandler = ref<boolean>(false);

const businessPayload = ref<IBusinessType>({
  number: getComplianceRegistration.value?.number || "",
});

const isActionReady = computed(() => {
  return businessPayload.value.number.length ? false : true;
});

const getBusinessPayload = computed(() => {
  return { number: businessPayload.value.number };
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
      };
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
