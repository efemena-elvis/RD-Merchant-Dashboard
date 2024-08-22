<template>
  <ComplianceDisplayBlock
    title="How can we locate your business?"
    description="Provide your business address details so we can identify your physical location for compliance and verification purposes"
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'RedstoneBusinessContact' })"
    @onContinueClick="handleBusinessAddressUpdate"
  >
    <div class="content-block">
      <TextFieldInput
        labelId="businessAddressLine1"
        labelTitle="Business Address Line 1"
        :inputType="IInputType.Text"
        :inputValue="businessPayload.first_address"
        inputPlaceholder="Provide your business address"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @inputChanged="businessPayload.first_address = $event"
        :errorHandler="{
          validator: 'validateRequired',
          message: 'Business address is a required field',
        }"
      />

      <TextFieldInput
        labelId="businessAddressLine2"
        labelTitle="Business Address Line 2 (Optional)"
        :inputType="IInputType.Text"
        :inputValue="businessPayload.second_address"
        inputPlaceholder="Provide your other business address"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @inputChanged="businessPayload.second_address = $event"
      />

      <TextFieldInput
        labelId="businessCity"
        labelTitle="Business City"
        :inputType="IInputType.Text"
        :inputValue="businessPayload.city"
        inputPlaceholder="Provide your business city"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @inputChanged="businessPayload.city = $event"
        :errorHandler="{
          validator: 'validateRequired',
          message: 'Business city is a required field',
        }"
      />

      <SelectFieldInput
        labelId="businessState"
        labelTitle="Business State / Province"
        inputPlaceholder="Provide your business state"
        inputBaseColor="bg-grey-10"
        :inputValue="businessPayload.state"
        :selectData="zambianProvinces"
        isRequired
        @onSelectionChange="businessPayload.state = $event"
      />
    </div>
  </ComplianceDisplayBlock>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { IInputType } from "@/models/form-type";
import { useComplianceStore } from "@/modules/compliance/store";
import { useComplianceUtil } from "../composable/useComplianceUtil";
import ComplianceDisplayBlock from "@/modules/compliance/components/compliance-display-block.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import SelectFieldInput from "@/shared/components/form-comps/select-field-input.vue";
import zambiaProvinceList from "@/shared/constants/zambia-provinces";
import { storeToRefs } from "pinia";

type IBusinessType = {
  first_address: string;
  second_address: string;
  city: string;
  state: string;
};

const router = useRouter();
const zambianProvinces = ref([...zambiaProvinceList]);
const stopClickHandler = ref<boolean>(false);

const { handleComplianceRequest } = useComplianceUtil();
const { getComplianceBusiness } = storeToRefs(useComplianceStore());

const businessPayload = ref<IBusinessType>({
  first_address: getComplianceBusiness.value?.first_address || "",
  second_address: getComplianceBusiness.value?.second_address || "",
  city: getComplianceBusiness.value?.city || "",
  state: getComplianceBusiness.value?.state || "",
});

const isActionReady = computed(() => {
  return businessPayload.value.first_address &&
    businessPayload.value.city &&
    businessPayload.value.state
    ? false
    : true;
});

const getBusinessPayload = computed(() => {
  const { first_address, second_address, city, state } = businessPayload.value;
  return { first_address, second_address, city, state };
});

const handleBusinessAddressUpdate = async () => {
  await handleComplianceRequest({
    payload: getBusinessPayload,
    redirectRoute: "RedstoneBusinessConfirm",
    stopClickHandler,
    succesMsg: "Business address submitted",
    errorMsg: "Business update failed",
    payloadType: "business",
  });
};

watch(
  getComplianceBusiness,
  (newValue) => {
    if (newValue) {
      businessPayload.value = {
        first_address: newValue.first_address || "",
        second_address: newValue.second_address || "",
        city: newValue.city || "",
        state: newValue.state || "",
      };
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
