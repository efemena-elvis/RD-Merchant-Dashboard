<template>
  <SettingsDisplayBlock
    title="Tell us more about your yourself"
    description="Share a bit about yourself by providing your contact details."
    showActionRow
    @onContinueClick="saveChanges"
  >
    <div class="content-block mb-12">
      <!-- PROFILE BANNER AREA -->
      <div class="profile-banner-area">
        <div class="image-wrapper">
          <div class="brand-initials">VI</div>
        </div>

        <div class="info-area">
          <div class="title-text">Vesicash Innovative Technologies Limited</div>
          <div class="description-row">
            <div class="text">elvis@vesicash.com</div>
            <!-- <div class="status">Verified</div> -->
          </div>

          <button class="btn btn-sm btn-tertiary mt-3.5">
            Upload business logo
          </button>
        </div>
      </div>

      <TextFieldInput
        labelId="firstName"
        labelTitle="First Name"
        :inputType="IInputType.Text"
        inputPlaceholder="Enter your first name"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
      />

      <TextFieldInput
        labelId="lastName"
        labelTitle="Last Name"
        :inputType="IInputType.Text"
        inputPlaceholder="Enter your last name"
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
    </div>
  </SettingsDisplayBlock>
</template>

<script lang="ts" setup>
import { IInputType } from "@/models/form-type";
import SettingsDisplayBlock from "@/modules/settings/components/settings-display-block.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import PhoneFieldInput from "@/shared/components/form-comps/phone-field-input.vue";

const saveChanges = () => {
  console.log("Saving changes");
};
</script>

<style lang="scss" scoped>
.profile-banner-area {
  @apply -mt-2 mb-10 flex justify-start items-start gap-x-3;

  .image-wrapper {
    @apply relative size-16 xl:size-14 sm:size-12 min-w-16 xl:min-w-14 sm:min-w-12 min-h-16 xl:min-h-14 sm:min-h-12 rounded-full border border-grey-200/70 bg-grey-300/60 flex justify-center items-center;

    .brand-initials {
      @apply text-2xl xl:text-xl sm:text-lg font-semibold text-teal-900;
    }
  }

  .info-area {
    @apply flex flex-col justify-start items-start gap-y-1;

    .title-text {
      @apply font-semibold text-base xl:text-[15px] sm:text-[14.5px] text-teal-900;
    }

    .description-row {
      @apply flex justify-start items-center gap-x-2;

      .text {
        @apply text-sm sm:text-[13.75px] text-grey-700/85;
      }

      .status {
        @apply rounded-full py-[3px] px-2.5 w-max text-white bg-green-500/95 text-[10.75px] font-medium;
      }
    }
  }
}
</style>
