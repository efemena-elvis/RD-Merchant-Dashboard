<template>
  <SettingsDisplayBlock
    title="Provide your business bank account number"
    description="Ensure the name on your bank account matches the legal business name you provided."
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onContinueClick="saveChanges"
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
  </SettingsDisplayBlock>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { IInputType } from "@/models/form-type";
import { useSettingsStore } from "../store";
import { storeToRefs } from "pinia";
import useEvents from "@/shared/composables/useEvents";
import SettingsDisplayBlock from "@/modules/settings/components/settings-display-block.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";

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

const { processAPIRequest } = useEvents();

const {
  getProfileDetails,
  getProfileAccount,
  getProfileContact,
  getProfileDeveloper,
} = storeToRefs(useSettingsStore());
const { updateUserProfile } = useSettingsStore();

const stopClickHandler = ref<boolean>(false);

const businessPayload = ref<IBusinessType>({
  name: getProfileAccount.value?.name || "",
  account_number: getProfileAccount.value?.account_number.toString() || "",
  code: getProfileAccount.value?.code || "",
  account_holder_name: getProfileAccount.value?.account_holder_name || "",
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

const getPayload = computed(() => {
  return {
    profile: { ...getProfileDetails.value },
    contact: { ...getProfileContact.value },
    bank: { ...businessPayload.value },
    ...getProfileDeveloper.value,
  };
});

const saveChanges = async () => {
  const response = await processAPIRequest({
    action: updateUserProfile,
    payload: getPayload.value,
    alertHandler: {
      200: {
        message: "Bank account updated successfully",
        type: "success",
      },
      400: {
        message: "Bank account update failed",
        type: "error",
      },
    },
  });
  if (response.code) stopClickHandler.value = true;
};

watch(
  getProfileAccount,
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
