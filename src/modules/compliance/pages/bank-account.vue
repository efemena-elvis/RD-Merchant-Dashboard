<template>
  <ComplianceDisplayBlock
    title="Provide your business bank account number"
    description="Ensure the name on your bank account matches the legal business name you provided."
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'RedstoneRepresentativeConfirm' })"
    @onContinueClick="handleBankAccountUpdate"
  >
    <div class="content-block mb-10">
      <TextFieldInput
        labelId="bankName"
        labelTitle="Bank Name"
        :inputType="IInputType.Text"
        :inputValue="businessPayload.name"
        inputPlaceholder="Provide your business bank name"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @inputChanged="businessPayload.name = $event"
        :errorHandler="{
          validator: 'validateRequired',
          message: 'Bank name is a required field',
        }"
      />

      <TextFieldInput
        labelId="bankAccountNumber"
        labelTitle="Bank Account Number"
        :inputType="IInputType.Text"
        :inputValue="businessPayload.account_number"
        inputPlaceholder="Provide your bank account number"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @inputChanged="businessPayload.account_number = $event"
        @inputValidated="payloadValidity.account_number = $event"
        :errorHandler="{
          validator: 'validateNumberEntry',
          message: 'Account number should only contain numbers',
        }"
      />

      <TextFieldInput
        labelId="bankCode"
        labelTitle="Bank Code"
        :inputType="IInputType.Text"
        :inputValue="businessPayload.code"
        inputPlaceholder="Provide your bank code"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @inputChanged="businessPayload.code = $event"
        @inputValidated="payloadValidity.code = $event"
        :errorHandler="{
          validator: 'validateNumberEntry',
          message: 'Bank code should only contain numbers',
        }"
      />

      <TextFieldInput
        labelId="accountHolderName"
        labelTitle="Account Holder Name"
        :inputType="IInputType.Text"
        :inputValue="businessPayload.account_holder_name"
        inputPlaceholder="Provide your account holder name"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @inputChanged="businessPayload.account_holder_name = $event"
        :errorHandler="{
          validator: 'validateRequired',
          message: 'Account holder name is a required field',
        }"
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
import { useComplianceUtil } from "../composable/useComplianceUtil";
import { storeToRefs } from "pinia";
import { useComplianceStore } from "../store";

type IBusinessType = {
  name: string;
  account_number: string;
  code: string;
  account_holder_name: string;
};

type IInputValidity = {
  account_number: boolean;
  code: boolean;
};

const router = useRouter();
const stopClickHandler = ref<boolean>(false);

const { handleComplianceRequest } = useComplianceUtil();
const { getComplianceBankAccount } = storeToRefs(useComplianceStore());

const businessPayload = ref<IBusinessType>({
  name: getComplianceBankAccount.value?.name || "",
  account_number:
    getComplianceBankAccount.value?.account_number.toString() || "",
  code: getComplianceBankAccount.value?.code || "",
  account_holder_name:
    getComplianceBankAccount.value?.account_holder_name || "",
});

const payloadValidity = ref<IInputValidity>({
  account_number: false,
  code: false,
});

const isActionReady = computed(() => {
  return businessPayload.value.name &&
    businessPayload.value.account_number &&
    businessPayload.value.code &&
    businessPayload.value.account_holder_name &&
    payloadValidity.value.account_number &&
    payloadValidity.value.code
    ? false
    : true;
});

const getBusinessPayload = computed(() => {
  const { name, account_number, code, account_holder_name } =
    businessPayload.value;
  return { name, account_number, code, account_holder_name };
});

const handleBankAccountUpdate = async () => {
  await handleComplianceRequest({
    payload: getBusinessPayload,
    redirectRoute: "RedstoneSignatoryProfile",
    stopClickHandler,
    succesMsg: "Bank account details submitted",
    errorMsg: "Bank account update failed",
    payloadType: "bank_account",
  });
};

watch(
  getComplianceBankAccount,
  (newValue) => {
    if (newValue) {
      businessPayload.value = {
        name: newValue.name || "",
        account_number: newValue.account_number.toString() || "",
        code: newValue.code || "",
        account_holder_name: newValue.account_holder_name || "",
      };
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
