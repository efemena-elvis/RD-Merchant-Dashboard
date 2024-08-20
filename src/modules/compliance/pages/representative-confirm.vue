<template>
  <ComplianceDisplayBlock
    title="Verify your representative address"
    description="Provide the relevant document to confirm your representative residential address."
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    @onBackClick="router.push({ name: 'RedstoneRepresentativeAddress' })"
    @onContinueClick="handleRepresentativeConfirmUpdate"
  >
    <div class="content-block">
      <UploadGuidelines
        title="Please upload a proof of address that:"
        :guidelines="[
          `Confirm residential address at: <br/> ${businessAddress || '------'}`,
          'Is less than 4 months old either in JPG, JPEG, PNG or PDF',
        ]"
      />

      <UploadGuidelines
        title="We accept any ONE of the following documents:"
        :guidelines="[
          'Bank statement',
          'Utility bills (e.g electricity, water bills)',
          'Signed lease/tenancy agreement',
        ]"
      />

      <SelectFieldInput
        labelId="DocumentType"
        labelTitle="Document Type"
        inputPlaceholder="Select document type"
        :inputValue="businessPayload.type"
        inputBaseColor="bg-grey-10"
        :selectData="documentTypes"
        isRequired
        @onSelectionChange="businessPayload.type = $event"
      />

      <!-- DOCUMENT FIELD UPLOAD -->
      <div class="mb-14">
        <FileUploadInput
          showSkip
          skipRoute="RedstoneBankAccount"
          @onDocumentUploaded="businessPayload.url = $event"
        />
      </div>
    </div>
  </ComplianceDisplayBlock>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import ComplianceDisplayBlock from "@/modules/compliance/components/compliance-display-block.vue";
import UploadGuidelines from "@/modules/compliance/components/upload-guidelines.vue";
import FileUploadInput from "@/shared/components/form-comps/file-upload-input.vue";
import SelectFieldInput from "@/shared/components/form-comps/select-field-input.vue";

type IBusinessType = {
  type: string;
  url: string;
};

const router = useRouter();

const businessPayload = ref<IBusinessType>({
  type: "",
  url: "",
});

const businessAddress = ref<string>("");

const documentTypes = ref<{ value: string; name: string }[]>([
  {
    value: "bank_statement",
    name: "Bank statement",
  },
  {
    value: "utility_bills",
    name: "Utility bills",
  },
  {
    value: "tenancy_agreement",
    name: "Signed lease / tenancy agreement",
  },
]);

const isActionReady = computed(() => {
  return businessPayload.value.type && businessPayload.value.url ? false : true;
});

const getBusinessPayload = computed(() => {
  const { type, url } = businessPayload.value;
  return { address_doc: { type, url } };
});

const handleRepresentativeConfirmUpdate = () => {
  // router.push({ name: 'RedstoneBankAccount' })

  console.log("Payload", getBusinessPayload.value);
};
</script>

<style lang="scss" scoped>
.content-block {
  // @apply ;
}
</style>
