<template>
  <ComplianceDisplayBlock
    title="How can we contact your business?"
    description="Share your business contact channels to ensure smooth communication when needed."
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'RedstoneBusinessProfile' })"
    @onContinueClick="handleBusinessContactUpdate"
  >
    <div class="content-block">
      <TextFieldInput
        labelId="businessEmailAddress"
        labelTitle="Business Email Address"
        :inputType="IInputType.Email"
        :inputValue="businessPayload.email"
        inputPlaceholder="Provide a business email address"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @inputChanged="businessPayload.email = $event"
        @inputValidated="payloadValidity.email = $event"
        :errorHandler="{
          validator: 'validateEmail',
        }"
      />

      <PhoneFieldInput
        labelId="businessPhoneNumber"
        labelTitle="Phone Number"
        :inputValue="businessPayload.phone_number"
        inputPlaceholder="Provide a business phone number"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @countryCodeChanged="phoneCountryCode = $event"
        @inputChanged="businessPayload.phone_number = $event"
        @inputValidated="payloadValidity.phone_number = $event"
        :errorHandler="{
          validator: 'validatePhone',
        }"
      />

      <TextFieldInput
        labelId="businessWebsite"
        labelTitle="Business Website (Optional)"
        :inputType="IInputType.Text"
        :inputValue="businessPayload.website"
        inputPlaceholder="Provide a business website url"
        inputBaseColor="bg-grey-10"
        :isRequired="false"
        @inputChanged="businessPayload.website = $event"
      />

      <SelectFieldInput
        labelId="businessHasSocialMedia"
        labelTitle="Do you have social media accounts?"
        inputPlaceholder="Select if you have any social media profiles"
        inputBaseColor="bg-grey-10"
        inputValue="no"
        :selectData="[
          { value: 'no', name: 'No' },
          { value: 'yes', name: 'Yes' },
        ]"
        @onSelectionChange="handleSelectChange"
      />

      <div v-if="showSocialMediaSection">
        <!-- FACEBOOK USERNAME -->
        <TextFieldInput
          labelId="businessFacebook"
          labelTitle="Facebook Username"
          :inputType="IInputType.Text"
          :inputValue="businessPayload.facebook_username"
          inputPlaceholder="Provide facebook account usewrname"
          inputBaseColor="bg-grey-10"
          :isRequired="true"
          @inputChanged="businessPayload.facebook_username = $event"
        />

        <!-- TWITTER USERNAME -->
        <TextFieldInput
          labelId="businessTwitter"
          labelTitle="X(Twitter) Username"
          :inputType="IInputType.Text"
          :inputValue="businessPayload.twitter_username"
          inputPlaceholder="Provide x(twitter) account username"
          inputBaseColor="bg-grey-10"
          :isRequired="true"
          @inputChanged="businessPayload.twitter_username = $event"
        />

        <!-- INSTAGRAM USERNAME -->
        <TextFieldInput
          labelId="businessInstagram"
          labelTitle="Instagram Username"
          :inputType="IInputType.Text"
          :inputValue="businessPayload.instagram_username"
          inputPlaceholder="Provide instagram account username"
          inputBaseColor="bg-grey-10"
          :isRequired="true"
          @inputChanged="businessPayload.instagram_username = $event"
        />
      </div>
    </div>
  </ComplianceDisplayBlock>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { IInputType } from "@/models/form-type";
import { useComplianceStore } from "../store";
import useEvents from "@/shared/composables/useEvents";
import { useString } from "@/shared/composables/useString";
import ComplianceDisplayBlock from "@/modules/compliance/components/compliance-display-block.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import SelectFieldInput from "@/shared/components/form-comps/select-field-input.vue";
import PhoneFieldInput from "@/shared/components/form-comps/phone-field-input.vue";

type IBusinessType = {
  email: string;
  phone_number: string;
  website?: string;
  facebook_username?: string;
  instagram_username?: string;
  twitter_username?: string;
};

type IInputValidity = {
  email: boolean;
  phone_number: boolean;
};

const router = useRouter();
const { processAPIRequest } = useEvents();
const { formatPhoneNumber } = useString();
const {
  uploadCompliance,
  getComplianceBusiness,
  getComplianceRegistration,
  getComplianceRepresentative,
  getComplianceBankAccount,
  getComplianceBusinessSignatory,
  getComplianceAgreement,
} = useComplianceStore();

const showSocialMediaSection = ref<boolean>(false);
const stopClickHandler = ref<boolean>(false);

const handleSelectChange = (value: string): void => {
  showSocialMediaSection.value = value === "yes";
};

const phoneCountryCode = ref<string>("260");

const businessPayload = ref<IBusinessType>({
  email: getComplianceBusiness?.email || "",
  phone_number: getComplianceBusiness?.phone_number || "",
  website: getComplianceBusiness?.website || "",
  facebook_username: getComplianceBusiness?.facebook_username || "",
  instagram_username: getComplianceBusiness?.instagram_username || "",
  twitter_username: getComplianceBusiness?.twitter_username || "",
});

const payloadValidity = ref<IInputValidity>({
  email: false,
  phone_number: false,
});

const isActionReady = computed(() => {
  return businessPayload.value.email &&
    businessPayload.value.phone_number &&
    payloadValidity.value.email &&
    payloadValidity.value.phone_number
    ? false
    : true;
});

const getBusinessPayload = computed(() => {
  const {
    email,
    phone_number,
    website,
    facebook_username,
    instagram_username,
    twitter_username,
  } = businessPayload.value;
  return {
    email,
    phone_number: formatPhoneNumber(phone_number, phoneCountryCode.value),
    website,
    facebook_username,
    instagram_username,
    twitter_username,
  };
});

const handleBusinessContactUpdate = async () => {
  const response = await processAPIRequest({
    action: uploadCompliance,
    payload: {
      business: { ...getComplianceBusiness, ...getBusinessPayload.value },
      getComplianceRegistration,
      getComplianceRepresentative,
      getComplianceBankAccount,
      getComplianceBusinessSignatory,
      getComplianceAgreement,
    },
    alertHandler: {
      200: {
        message: "Business contact submitted",
        type: "success",
      },

      400: {
        message: "Business contact update failed",
        type: "error",
      },
    },
  });

  if (response.code === 200) {
    stopClickHandler.value = true;
    setTimeout(() => router.push({ name: "RedstoneBusinessAddress" }), 2000);
  }

  // ON FAILED UPDATE STOP PROCESSING
  else {
    stopClickHandler.value = true;
  }

  onMounted(() => {
    console.log("LOG", getComplianceBusiness);

    showSocialMediaSection.value =
      getComplianceBusiness?.facebook_username ||
      getComplianceBusiness?.twitter_username ||
      getComplianceBusiness?.instagram_username
        ? true
        : false;
  });
};
</script>
<style lang="scss" scoped>
.content-block {
  .helper-text {
    @apply text-sm font-semibold text-grey-800/80;
  }
}
</style>
