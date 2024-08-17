<template>
  <SettingsDisplayBlock
    title="How can we reach you?"
    description="If a dispute or support issue arises, Redstone will notify you via the email addresses you provide below."
    showActionRow
    @onContinueClick="saveChanges"
  >
    <div class="content-block mb-12">
      <TextFieldInput
        labelId="disputeEmailAddress"
        labelTitle="Dispute Email Address"
        :inputType="IInputType.Email"
        inputPlaceholder="Provide a dispute email address"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
      />

      <TextFieldInput
        labelId="supportEmailAddress"
        labelTitle="Support Email Address"
        :inputType="IInputType.Email"
        inputPlaceholder="Provide a support email address"
        inputBaseColor="bg-grey-10"
        :isRequired="true"
      />

      <TextFieldInput
        labelId="generalEmailAddress"
        labelTitle="General Email Address"
        :inputType="IInputType.Email"
        inputPlaceholder="Provide a general email address"
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

const saveChanges = () => {
  console.log("Saving changes");
};
</script>

<style lang="scss" scoped>
.content-block {
  // @apply ;
}
</style>
