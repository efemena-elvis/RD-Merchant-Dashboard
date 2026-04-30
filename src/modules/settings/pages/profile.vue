<template>
  <SettingsDisplayBlock
    title="Tell us more about your yourself"
    description="Share a bit about yourself by providing your contact details."
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onContinueClick="saveChanges"
  >
    <div class="content-block mb-12">
      <!-- PROFILE BANNER AREA -->
      <div class="profile-banner-area">
        <div class="image-wrapper">
          <img
            :src="profilePayload.logo"
            :alt="getBusinessProfile.businessName"
            v-if="profilePayload.logo"
          />

          <div class="brand-initials" v-else>
            {{ getBrandInitials(getBusinessProfile.businessName) }}
          </div>
        </div>

        <div class="info-area">
          <div class="title-text">{{ getBusinessProfile.businessName }}</div>
          <div class="description-row">
            <div class="text">{{ getUserProfile.email }}</div>
          </div>

          <label for="logoUpload">
            <div class="btn btn-sm btn-tertiary mt-3.5">
              <template v-if="isUploading">
                <div
                  class="icon-spinner-ios text-2xl text-green-600/80 animate-spin"
                ></div>

                <div>Uploading logo...</div>
              </template>

              <template v-else>Upload business logo</template>
            </div>
          </label>

          <input
            type="file"
            id="logoUpload"
            ref="fileUploadRef"
            class="hidden"
            :disabled="isUploading"
            @change="processDocumentUpload"
            accept=".jpg, .jpeg, .png"
          />
        </div>
      </div>

      <TextFieldInput
        labelId="firstName"
        labelTitle="First Name"
        :inputType="IInputType.Text"
        :inputValue="profilePayload.first_name"
        inputPlaceholder="Enter your first name"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @inputChanged="profilePayload.first_name = $event"
        :errorHandler="{
          validator: 'validateRequired',
          message: 'First name is a required field',
        }"
      />

      <TextFieldInput
        labelId="lastName"
        labelTitle="Last Name"
        :inputType="IInputType.Text"
        :inputValue="profilePayload.last_name"
        @inputChanged="profilePayload.last_name = $event"
        inputPlaceholder="Enter your last name"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        :errorHandler="{
          validator: 'validateRequired',
          message: 'Last name is a required field',
        }"
      />

      <PhoneFieldInput
        labelId="businessPhoneNumber"
        labelTitle="Phone Number"
        :inputValue="profilePayload.phone_number"
        inputPlaceholder="Provide a business phone number"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        :activeCountryCode="phoneCountryCode"
        @countryCodeChanged="phoneCountryCode = $event"
        @inputChanged="profilePayload.phone_number = $event"
        @inputValidated="payloadValidity.phone_number = $event"
        :errorHandler="{
          validator: 'validatePhone',
        }"
      />
    </div>
  </SettingsDisplayBlock>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { IInputType } from "@/models/form-type";
import { useString } from "@/shared/composables/useString";
import { useFile } from "@/shared/composables/useFile";
import { useProfile } from "@/shared/composables/useProfile";
import { useGeneralStore } from "@/store/general";
import { useSettingsStore } from "../store";
import useEvents from "@/shared/composables/useEvents";
import SettingsDisplayBlock from "@/modules/settings/components/settings-display-block.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import PhoneFieldInput from "@/shared/components/form-comps/phone-field-input.vue";
import { storeToRefs } from "pinia";

type IProfileType = {
  logo: string;
  first_name: string;
  last_name: string;
  phone_number: string;
};

type IInputValidity = {
  phone_number: boolean;
};

const { getBusiness, getUser } = useProfile();
const getBusinessProfile = computed(() => getBusiness());
const getUserProfile = computed(() => getUser());

const { getStringInitials, formatPhoneNumber } = useString();
const { processAPIRequest, pushToastAlert } = useEvents();
const { processFileSize, processFileType } = useFile();

const {
  getProfileDetails,
  getProfileAccount,
  getProfileContact,
  getProfileDeveloper,
} = storeToRefs(useSettingsStore());
const { updateUserProfile } = useSettingsStore();
const { uploadFile } = useGeneralStore();

const stopClickHandler = ref<boolean>(false);

const fileUploadRef = ref<HTMLInputElement | null>(null);
const allowedFiles = ref<string[]>(["jpeg", "jpg", "png"]);

const isDocUploaded = ref<boolean>(false);
const isUploading = ref<boolean>(false);

const getBrandInitials = (brandName: string): string =>
  getStringInitials(brandName);

const profilePayload = ref<IProfileType>({
  logo: getProfileDetails.value?.logo || "",
  first_name: getProfileDetails.value?.first_name || "",
  last_name: getProfileDetails.value?.last_name || "",
  phone_number: getProfileDetails.value?.phone_number || "",
});

const payloadValidity = ref<IInputValidity>({
  phone_number: false,
});

const phoneCountryCode = ref<string>(
  getProfileDetails.value?.phone_number?.split("-")[0] || "260"
);

const isActionReady = computed(() => {
  return profilePayload.value.first_name &&
    profilePayload.value.last_name &&
    profilePayload.value.phone_number &&
    payloadValidity.value.phone_number
    ? false
    : true;
});

const getPayload = computed(() => {
  const { phone_number } = profilePayload.value;

  const profile = {
    ...profilePayload.value,
    phone_number: formatPhoneNumber(phone_number, phoneCountryCode.value),
  };

  return {
    profile,
    bank: { ...getProfileAccount.value },
    contact: { ...getProfileContact.value },
    ...getProfileDeveloper.value,
  };
});

const processDocumentUpload = async ($event: Event) => {
  const inputElement = $event.target as HTMLInputElement;
  const uploadedFile = inputElement.files ? inputElement.files[0] : null;

  if (!uploadedFile) return;

  isUploading.value = true;

  if (!processFileType(uploadedFile.name, allowedFiles.value)) {
    pushToastAlert({
      message: "File type is not supported!",
      description: "Document file type should either be jpg, jpeg, png or pdf",
      type: "warning",
    });

    isUploading.value = false;
    inputElement.value = "";
    return false;
  }

  if (!processFileSize(uploadedFile.size)) {
    pushToastAlert({
      message: "Upload a maximum file size of 5mb",
      type: "warning",
    });

    isUploading.value = false;
    inputElement.value = "";
    return false;
  }

  // UPLOAD FILE TO BUCKET
  const payload = new FormData();
  payload.append("files", uploadedFile);

  const response = await processAPIRequest({
    action: uploadFile,
    payload,
    alertHandler: {
      201: {
        message: "Business logo uploaded successfully",
        type: "success",
      },

      400: {
        message: "Business logo upload failed",
        type: "error",
      },
    },
  });

  if (response.code == 201) {
    isDocUploaded.value = true;

    inputElement.value = "";
    isUploading.value = false;

    profilePayload.value.logo = response.data[0].file_url;
  }

  // FAILED STATE
  else {
    inputElement.value = "";
    isUploading.value = false;
    isDocUploaded.value = false;
  }
};

const saveChanges = async () => {
  const response = await processAPIRequest({
    action: updateUserProfile,
    payload: getPayload.value,
    alertHandler: {
      200: {
        message: "Profile updated successfully",
        type: "success",
      },

      400: {
        message: "Profile update failed",
        type: "error",
      },
    },
  });

  if (response.code) stopClickHandler.value = true;
};

watch(
  getProfileDetails,
  (newValue) => {
    if (newValue) {
      profilePayload.value = {
        logo: newValue.logo || "",
        first_name: newValue.first_name || "",
        last_name: newValue.last_name || "",
        phone_number: newValue.phone_number?.split("-")[1] || "",
      };

      phoneCountryCode.value = newValue.phone_number?.split("-")[0] || "260";
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.profile-banner-area {
  @apply -mt-2 mb-10 flex justify-start items-start gap-x-3;

  .image-wrapper {
    @apply relative size-16 xl:size-14 sm:size-12 min-w-16 xl:min-w-14 sm:min-w-12 min-h-16 xl:min-h-14 sm:min-h-12 rounded-full border border-grey-200/70 bg-grey-300/60 flex justify-center items-center overflow-hidden;

    img {
      @apply w-full h-full object-cover;
    }

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
