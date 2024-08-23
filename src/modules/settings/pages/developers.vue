<template>
  <SettingsDisplayBlock
    title="Manage your API configurations"
    description="Easily configure and manage your API settings to ensure seamless integration with your services."
    showActionRow
    showSecondaryAction
    secondaryActionText="Generate secret key"
    @onSecondaryActionClick="generateNewSecretKey"
    @onContinueClick="saveChanges"
  >
    <div class="content-block -mt-1 mb-12">
      <!-- INFO BLOCK -->
      <div class="info-block mb-10">
        <div class="text">Need help with your integration?</div>

        <button class="btn btn-sm btn-tertiary">Explore our API</button>
      </div>

      <TextFieldInput
        labelId="textSecretKey"
        labelTitle="Test Secret Key"
        :inputType="IInputType.Password"
        :inputValue="getKeys.secret"
        inputPlaceholder="Secret key"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
      />

      <TextFieldInput
        labelId="textPublicKey"
        labelTitle="Test Public Key"
        :inputType="IInputType.Text"
        :inputValue="getKeys.public"
        inputPlaceholder="Public key"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
      />

      <TextFieldInput
        labelId="textCallbackURL"
        labelTitle="Test Callback URL"
        :inputType="IInputType.Text"
        inputPlaceholder="Callback URL"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
      />

      <TextFieldInput
        labelId="textWebhookURL"
        labelTitle="Test Webhook URL"
        :inputType="IInputType.Text"
        inputPlaceholder="Webhook URL"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
      />
    </div>
  </SettingsDisplayBlock>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { IInputType } from "@/models/form-type";
import { useProfile } from "@/shared/composables/useProfile";
import useEvents from "@/shared/composables/useEvents";
import SettingsDisplayBlock from "@/modules/settings/components/settings-display-block.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";

const { getBusiness, getAPIKeys } = useProfile();

const getBusinessProfile = computed(() => getBusiness());
const getAPIProfile = computed(() => getAPIKeys());

const { processAPIRequest } = useEvents();

const getKeys = computed(() => {
  if (getBusinessProfile.value.businessMode === "test") {
    return getAPIProfile.value.test;
  } else return getAPIProfile.value.live;
});

const saveChanges = () => {
  console.log("Saving changes");
};

const generateNewSecretKey = () => {
  console.log("Generating new secret key");
};
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
