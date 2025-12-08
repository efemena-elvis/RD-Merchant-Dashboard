<template>
  <SettingsDisplayBlock
    title="Manage your API configurations"
    description="Easily configure and manage your API settings to ensure seamless integration with your services."
    showActionRow
    :showSecondaryAction="false"
    secondaryActionText="Generate secret key"
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onSecondaryActionClick="generateNewSecretKey"
    @onContinueClick="saveChanges"
  >
    <div class="content-block -mt-1 mb-12">
      <!-- INFO BLOCK -->
      <div class="info-block mb-10">
        <div class="text">Need help with your integration?</div>

        <a
          href="https://developer.redstonepgs.com/"
          target="_blank"
          class="btn btn-sm btn-tertiary"
        >
          Explore our API
        </a>
      </div>

      <TextFieldInput
        labelId="textSecretKey"
        labelTitle="Test Secret Key"
        :inputType="IInputType.Password"
        :inputValue="getKeys.secret"
        inputPlaceholder="Secret key"
        inputBaseColor="bg-grey-10"
        :showTextCopy="true"
        copiedText="Secret key copied successfully"
        :isRequired="true"
        :isDisabled="true"
      />

      <TextFieldInput
        labelId="textPublicKey"
        labelTitle="Test Public Key"
        :inputType="IInputType.Text"
        :inputValue="getKeys.public"
        inputPlaceholder="Public key"
        inputBaseColor="bg-grey-10"
        :showTextCopy="true"
        copiedText="Public key copied successfully"
        :isRequired="true"
        :isDisabled="true"
      />

      <TextFieldInput
        labelId="textCallbackURL"
        labelTitle="Test Callback URL"
        :inputType="IInputType.Text"
        inputPlaceholder="Callback URL"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        :inputValue="urlPayload.callback_url"
        @inputChanged="urlPayload.callback_url = $event"
        @inputValidated="payloadValidity.callback_url = $event"
       
      />

      <TextFieldInput
        labelId="textWebhookURL"
        labelTitle="Test Webhook URL"
        :inputType="IInputType.Text"
        inputPlaceholder="Webhook URL"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        :inputValue="urlPayload.webhook_url"
        @inputChanged="urlPayload.webhook_url = $event"
        @inputValidated="payloadValidity.webhook_url = $event"
     
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
import { useProfile } from "@/shared/composables/useProfile";
import SettingsDisplayBlock from "@/modules/settings/components/settings-display-block.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";

type IURLType = {
  callback_url: string;
  webhook_url: string;
};

type IInputValidity = {
  callback_url: boolean;
  webhook_url: boolean;
};

const { getBusiness, getAPIKeys } = useProfile();

const getBusinessProfile = computed(() => getBusiness());
const getAPIProfile = computed(() => getAPIKeys());

const { processAPIRequest } = useEvents();

const {
  getProfileDetails,
  getProfileAccount,
  getProfileContact,
  getProfileDeveloper,
} = storeToRefs(useSettingsStore());
const { updateUserProfile } = useSettingsStore();

const stopClickHandler = ref<boolean>(false);

const urlPayload = ref<IURLType>({
  callback_url: getProfileDeveloper.value?.callback_url || "",
  webhook_url: getProfileDeveloper.value?.webhook_url || "",
});

const payloadValidity = ref<IInputValidity>({
  callback_url: false,
  webhook_url: false,
});

const getKeys = computed(() => {
  if (getBusinessProfile.value.businessMode === "test") {
    return getAPIProfile.value.test;
  } else return getAPIProfile.value?.live;
});

const isActionReady = computed(() => {
  return (urlPayload.value.callback_url &&
    payloadValidity.value.callback_url) ||
    (urlPayload.value.webhook_url && payloadValidity.value.webhook_url)
    ? false
    : true;
});

const getPayload = computed(() => {
  return {
    profile: { ...getProfileDetails.value },
    bank: { ...getProfileAccount.value },
    contact: { ...getProfileContact.value },
    ...urlPayload.value,
  };
});

const saveChanges = async () => {
  const response = await processAPIRequest({
    action: updateUserProfile,
    payload: getPayload.value,
    alertHandler: {
      200: {
        message: "Developer URL updated successfully",
        type: "success",
      },

      400: {
        message: "Developer URL update failed",
        type: "error",
      },
    },
  });

  if (response.code) stopClickHandler.value = true;
};

const generateNewSecretKey = () => {
  console.log("Generating new secret key");
};

watch(
  getProfileDeveloper,
  (newValue) => {
    if (newValue) {
      urlPayload.value = {
        callback_url: newValue.callback_url || "",
        webhook_url: newValue.webhook_url || "",
      };
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.content-block {
  .info-block {
    @apply flex justify-between items-center gap-x-3 border border-grey-200 p-3.5 bg-white rounded-lg;

    .text {
      @apply text-sm text-grey-800;
    }
  }
}
</style>
