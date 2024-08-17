<template>
  <ComplianceDisplayBlock
    title="How can we contact your business?"
    description="Share your business contact channels to ensure smooth communication when needed."
    showActionRow
    @onBackClick="router.push({ name: 'RedstoneBusinessProfile' })"
    @onContinueClick="router.push({ name: 'RedstoneBusinessAddress' })"
  >
    <div class="content-block">
      <TextFieldInput
        labelId="businessEmailAddress"
        labelTitle="Business Email Address"
        :inputType="IInputType.Email"
        inputPlaceholder="Provide a business email address"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
      />

      <PhoneFieldInput
        labelId="businessPhoneNumber"
        labelTitle="Phone Number"
        inputValue=""
        inputPlaceholder="Provide a business phone number"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
      />

      <TextFieldInput
        labelId="businessWebsite"
        labelTitle="Business Website (Optional)"
        :inputType="IInputType.Text"
        inputPlaceholder="Provide a business website url"
        inputBaseColor="bg-grey-10"
        :isRequired="false"
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
          inputPlaceholder="Provide facebook account usewrname"
          inputBaseColor="bg-grey-10"
          :isRequired="true"
        />

        <!-- TWITTER USERNAME -->
        <TextFieldInput
          labelId="businessTwitter"
          labelTitle="X(Twitter) Username"
          :inputType="IInputType.Text"
          inputPlaceholder="Provide x(twitter) account username"
          inputBaseColor="bg-grey-10"
          :isRequired="true"
        />

        <!-- INSTAGRAM USERNAME -->
        <TextFieldInput
          labelId="businessInstagram"
          labelTitle="Instagram Username"
          :inputType="IInputType.Text"
          inputPlaceholder="Provide instagram account username"
          inputBaseColor="bg-grey-10"
          :isRequired="true"
        />
      </div>
    </div>
  </ComplianceDisplayBlock>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { IInputType } from "@/models/form-type";
import ComplianceDisplayBlock from "@/modules/compliance/components/compliance-display-block.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import SelectFieldInput from "@/shared/components/form-comps/select-field-input.vue";
import PhoneFieldInput from "@/shared/components/form-comps/phone-field-input.vue";

const router = useRouter();

const showSocialMediaSection = ref<boolean>(false);

const handleSelectChange = (value: string): void => {
  showSocialMediaSection.value = value === "yes";
};
</script>
<style lang="scss" scoped>
.content-block {
  .helper-text {
    @apply text-sm font-semibold text-grey-800/80;
  }
}
</style>
