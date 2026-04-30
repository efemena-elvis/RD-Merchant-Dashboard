<template>
  <SettingsDisplayBlock
    title="How can we reach you?"
    description="If a dispute or support issue arises, Redstone will notify you via the email addresses you provide below."
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onContinueClick="saveChanges"
  >
    <div class="content-block mb-12">
      <TextFieldInput
        labelId="disputeEmailAddress"
        labelTitle="Dispute Email Address"
        :inputType="IInputType.Email"
        :inputValue="contactPayload.dispute_email_address"
        inputPlaceholder="Provide a dispute email address"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @inputChanged="contactPayload.dispute_email_address = $event"
        @inputValidated="payloadValidity.dispute_email_address = $event"
        :errorHandler="{
          validator: 'validateEmail',
        }"
      />

      <TextFieldInput
        labelId="supportEmailAddress"
        labelTitle="Support Email Address"
        :inputType="IInputType.Email"
        :inputValue="contactPayload.support_email_address"
        inputPlaceholder="Provide a support email address"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @inputChanged="contactPayload.support_email_address = $event"
        @inputValidated="payloadValidity.support_email_address = $event"
        :errorHandler="{
          validator: 'validateEmail',
        }"
      />

      <TextFieldInput
        labelId="generalEmailAddress"
        labelTitle="General Email Address"
        :inputType="IInputType.Email"
        :inputValue="contactPayload.general_email_address"
        inputPlaceholder="Provide a general email address"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @inputChanged="contactPayload.general_email_address = $event"
        @inputValidated="payloadValidity.general_email_address = $event"
        :errorHandler="{
          validator: 'validateEmail',
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

type IContactType = {
  dispute_email_address: string;
  support_email_address: string;
  general_email_address: string;
};

type IInputValidity = {
  dispute_email_address: boolean;
  support_email_address: boolean;
  general_email_address: boolean;
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

const contactPayload = ref<IContactType>({
  dispute_email_address: getProfileContact.value?.dispute_email_address || "",
  support_email_address: getProfileContact.value?.support_email_address || "",
  general_email_address: getProfileContact.value?.general_email_address || "",
});

const payloadValidity = ref<IInputValidity>({
  dispute_email_address: false,
  support_email_address: false,
  general_email_address: false,
});

const isActionReady = computed(() => {
  return contactPayload.value.dispute_email_address &&
    contactPayload.value.support_email_address &&
    contactPayload.value.general_email_address &&
    payloadValidity.value.dispute_email_address &&
    payloadValidity.value.support_email_address &&
    payloadValidity.value.general_email_address
    ? false
    : true;
});

const getPayload = computed(() => {
  return {
    profile: { ...getProfileDetails.value },
    bank: { ...getProfileAccount.value },
    contact: { ...contactPayload.value },
    ...getProfileDeveloper.value,
  };
});

const saveChanges = async () => {
  const response = await processAPIRequest({
    action: updateUserProfile,
    payload: getPayload.value,
    alertHandler: {
      200: {
        message: "Contact updated successfully",
        type: "success",
      },

      400: {
        message: "Contact update failed",
        type: "error",
      },
    },
  });

  if (response.code) stopClickHandler.value = true;
};

watch(
  getProfileContact,
  (newValue) => {
    if (newValue) {
      contactPayload.value = {
        dispute_email_address: newValue.dispute_email_address || "",
        support_email_address: newValue.support_email_address || "",
        general_email_address: newValue.general_email_address || "",
      };
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
