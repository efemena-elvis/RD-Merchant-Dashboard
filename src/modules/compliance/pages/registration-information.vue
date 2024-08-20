<template>
  <ComplianceDisplayBlock
    title="Business registration information"
    description="Provide your registered business details, so Redstone PGS can verify your business information."
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
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
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { IInputType } from "@/models/form-type";
import ComplianceDisplayBlock from "@/modules/compliance/components/compliance-display-block.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";

type IBusinessType = {
  number: string;
};

const businessPayload = ref<IBusinessType>({
  number: "",
});

const isActionReady = computed(() => {
  return businessPayload.value.number.length ? false : true;
});

const getBusinessPayload = computed(() => {
  return { number: businessPayload.value.number };
});

const handleRegistrationInformationUpdate = () => {
  // router.push({ name: 'RedstoneRegistrationConfirm' })

  console.log("PAYLOAD", getBusinessPayload.value);
};

const router = useRouter();
</script>

<style lang="scss" scoped>
.content-block {
  // @apply ;
}
</style>
