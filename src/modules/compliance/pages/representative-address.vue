<template>
  <ComplianceDisplayBlock
    title="How can we reach your representative?"
    description="Provide the residential address details of your business representative."
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    @onBackClick="router.push({ name: 'RedstoneRepresentativeIdentity' })"
    @onContinueClick="handleRepresentativeAddressUpdate"
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
        labelTitle="Residential State / Province"
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
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { IInputType } from "@/models/form-type";
import ComplianceDisplayBlock from "@/modules/compliance/components/compliance-display-block.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import SelectFieldInput from "@/shared/components/form-comps/select-field-input.vue";
import zambiaProvinceList from "@/shared/constants/zambia-provinces";

type IBusinessType = {
  first_address: string;
  second_address: string;
  city: string;
  state: string;
};

const router = useRouter();
const zambianProvinces = ref([...zambiaProvinceList]);

const businessPayload = ref<IBusinessType>({
  first_address: "",
  second_address: "",
  city: "",
  state: "",
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

const handleRepresentativeAddressUpdate = () => {
  // router.push({ name: 'RedstoneRepresentativeConfirm' })

  console.log("Payload", getBusinessPayload.value);
};
</script>

<style lang="scss" scoped>
.content-block {
  // @apply ;
}
</style>
