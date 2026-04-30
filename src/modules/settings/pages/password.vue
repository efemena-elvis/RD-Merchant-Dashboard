<template>
  <SettingsDisplayBlock
    title="Manage your account authentication"
    description="Keep your account secure by managing your authentication settings."
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onContinueClick="saveChanges"
  >
    <div class="content-block mb-12">
      <TextFieldInput
        labelId="oldPassword"
        labelTitle="Old Password"
        :inputType="IInputType.Password"
        :inputValue="payload.old_password"
        inputPlaceholder="Enter your existing password"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @inputChanged="payload.old_password = $event"
        @inputValidated="payloadValidity.old_password = $event"
        :errorHandler="{
          validator: 'validateRequired',
        }"
      />

      <TextFieldInput
        labelId="newPassword"
        labelTitle="New Password"
        :inputType="IInputType.Password"
        :inputValue="payload.new_password"
        inputPlaceholder="Enter your new password"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @inputChanged="payload.new_password = $event"
        @inputValidated="payloadValidity.new_password = $event"
        :errorHandler="{
          validator: 'validatePasswordStrength',
        }"
      />

      <TextFieldInput
        labelId="retypeNewPassword"
        labelTitle="Retype New Password"
        :inputType="IInputType.Password"
        :inputValue="payload.confirm_password"
        inputPlaceholder="Retype your new password"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
        @inputChanged="payload.confirm_password = $event"
        @inputValidated="payloadValidity.confirm_password = $event"
        :errorHandler="{
          validator: 'validatePasswordStrength',
        }"
      />
    </div>
  </SettingsDisplayBlock>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { IInputType } from "@/models/form-type";
import { useSettingsStore } from "../store";
import SettingsDisplayBlock from "@/modules/settings/components/settings-display-block.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import useEvents from "@/shared/composables/useEvents";

type IPayloadInputType = {
  old_password: string;
  new_password: string;
  confirm_password: string;
};

type IPayloadValidity = {
  old_password: boolean;
  new_password: boolean;
  confirm_password: boolean;
};

const { updateUserPassword } = useSettingsStore();
const { processAPIRequest, pushToastAlert } = useEvents();

const stopClickHandler = ref<boolean>(false);

const payload = ref<IPayloadInputType>({
  old_password: "",
  new_password: "",
  confirm_password: "",
});

const payloadValidity = ref<IPayloadValidity>({
  old_password: false,
  new_password: false,
  confirm_password: false,
});

const isActionReady = computed(() => {
  return payload.value.old_password &&
    payload.value.new_password &&
    payload.value.confirm_password &&
    payloadValidity.value.old_password &&
    payloadValidity.value.new_password &&
    payloadValidity.value.confirm_password
    ? false
    : true;
});

const getPayload = computed(() => {
  const { old_password, new_password } = payload.value;
  return { old_password, new_password };
});

const saveChanges = async () => {
  if (payload.value.new_password !== payload.value.confirm_password) {
    pushToastAlert({ message: "Passwords do not match", type: "warning" });
    stopClickHandler.value = true;
    return;
  }

  const response = await processAPIRequest({
    action: updateUserPassword,
    payload: getPayload.value,
    alertHandler: {
      200: {
        message: "Password updated successfully",
        type: "success",
      },

      400: {
        message: "Password update failed",
        type: "error",
      },
    },
  });

  if (response.code) stopClickHandler.value = true;
};
</script>

<style lang="scss" scoped></style>
