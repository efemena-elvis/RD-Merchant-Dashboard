<template>
  <ComplianceDisplayBlock
    title="How can we reach your signatory?"
    description="Provide the residential address details of your business signatory."
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'RedstoneSignatoryIdentity' })"
    @onContinueClick="handleSignatoryAddressUpdate"
  >
    <div class="content-block mb-12">
      <TextFieldInput
        labelId="residentialAddressLine1"
        labelTitle="Residential Address Line 1"
        :inputType="IInputType.Text"
        :inputValue="businessPayload.first_address"
        inputPlaceholder="Provide residential address"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @inputChanged="businessPayload.first_address = $event"
        :errorHandler="{
          validator: 'validateRequired',
          message: 'Residential address is a required field',
        }"
      />

      <TextFieldInput
        labelId="residentialAddressLine2"
        labelTitle="Residential Address Line 2 (Optional)"
        :inputType="IInputType.Text"
        :inputValue="businessPayload.second_address"
        inputPlaceholder="Provide other residential address"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @inputChanged="businessPayload.second_address = $event"
      />

      <TextFieldInput
        labelId="residentialCity"
        labelTitle="Residential City"
        :inputType="IInputType.Text"
        :inputValue="businessPayload.city"
        inputPlaceholder="Provide residential city"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @inputChanged="businessPayload.city = $event"
        :errorHandler="{
          validator: 'validateRequired',
          message: 'Residential city is a required field',
        }"
      />

      <SelectFieldInput
        labelId="residentialState"
        labelTitle="Residential State"
        inputPlaceholder="Provide residential state"
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
import ComplianceDisplayBlock from "@/modules/compliance/components/compliance-display-block.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import SelectFieldInput from "@/shared/components/form-comps/select-field-input.vue";
import zambiaProvinceList from "@/shared/constants/zambia-provinces";
import { useComplianceUtil } from "../composable/useComplianceUtil";
import { useComplianceStore } from "../store";
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
const { getComplianceBusinessSignatory } = storeToRefs(useComplianceStore());

const businessPayload = ref<IBusinessType>({
  first_address: getComplianceBusinessSignatory.value?.first_address || "",
  second_address: getComplianceBusinessSignatory.value?.second_address || "",
  city: getComplianceBusinessSignatory.value?.city || "",
  state: getComplianceBusinessSignatory.value?.state || "",
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

const handleSignatoryAddressUpdate = async () => {
  await handleComplianceRequest({
    payload: getBusinessPayload,
    redirectRoute: "RedstoneSignatoryConfirm",
    stopClickHandler,
    succesMsg: "Signatory address submitted",
    errorMsg: "Signatory update failed",
    payloadType: "business_signatory",
  });
};

watch(
  getComplianceBusinessSignatory,
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
