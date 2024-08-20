<template>
  <ComplianceDisplayBlock
    title="Provide your business bank account number"
    description="Ensure the name on your bank account matches the legal business name you provided."
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    @onBackClick="router.push({ name: 'RedstoneRepresentativeConfirm' })"
    @onContinueClick="handleBankAccountUpdate"
  >
    <div class="content-block mb-10">
      <SelectFieldInput
        labelId="bankName"
        labelTitle="Bank Name"
        inputPlaceholder="Select your bank name"
        inputBaseColor="bg-grey-10"
        :inputValue="businessPayload.name"
        :selectData="[
          { value: 'first_bank', name: 'First bank' },
          { value: 'gtbank', name: 'Guaranty trust bank' },
          { value: 'zenith_bank', name: 'Zenith bank' },
        ]"
        isRequired
        @onSelectionChange="businessPayload.name = $event"
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
          message: 'Account number should contain only numbers',
        }"
      />
    </div>
  </ComplianceDisplayBlock>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { IInputType } from "@/models/form-type";
import ComplianceDisplayBlock from "@/modules/compliance/components/compliance-display-block.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import SelectFieldInput from "@/shared/components/form-comps/select-field-input.vue";

type IBusinessType = {
  name: string;
  account_number: string;
};

type IInputValidity = {
  account_number: boolean;
};

const router = useRouter();

const businessPayload = ref<IBusinessType>({
  name: "",
  account_number: "",
});

const payloadValidity = ref<IInputValidity>({
  account_number: false,
});

const isActionReady = computed(() => {
  return businessPayload.value.name &&
    businessPayload.value.account_number &&
    payloadValidity.value.account_number
    ? false
    : true;
});

const getBusinessPayload = computed(() => {
  const { name, account_number } = businessPayload.value;
  return { name, account_number };
});

const handleBankAccountUpdate = () => {
  // router.push({ name: 'RedstoneSignatoryProfile' })

  console.log("Payload", getBusinessPayload.value);
};
</script>

<style lang="scss" scoped>
.content-block {
  // @apply ;
}
</style>
