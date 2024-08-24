<template>
  <ComplianceDisplayBlock
    title="Verify your signatory address"
    description="Provide the relevant document to confirm your signatory residential address."
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'RedstoneSignatoryAddress' })"
    @onContinueClick="handleSignatoryConfirmUpdate"
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
          skipRoute="RedstoneAgreementSignature"
          :hasDocumentUploaded="!!uploadedDocument"
          :uploadedDocumentContent="getUploadedDocumentContent"
          @onDocumentUploaded="businessPayload.url = $event"
        />
      </div>
    </div>
  </ComplianceDisplayBlock>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import ComplianceDisplayBlock from "@/modules/compliance/components/compliance-display-block.vue";
import UploadGuidelines from "@/modules/compliance/components/upload-guidelines.vue";
import FileUploadInput from "@/shared/components/form-comps/file-upload-input.vue";
import SelectFieldInput from "@/shared/components/form-comps/select-field-input.vue";
import { useComplianceUtil } from "../composable/useComplianceUtil";
import { useComplianceStore } from "../store";
import { storeToRefs } from "pinia";

type IBusinessType = {
  type: string;
  url: string;
};

const router = useRouter();
const stopClickHandler = ref<boolean>(false);

const { handleComplianceRequest } = useComplianceUtil();
const { getComplianceBusinessSignatory } = storeToRefs(useComplianceStore());

const businessPayload = ref<IBusinessType>({
  type: getComplianceBusinessSignatory.value?.address_doc.type || "",
  url: getComplianceBusinessSignatory.value?.address_doc.url || "",
});

const computeAddress = computed(() => {
  if (getComplianceBusinessSignatory.value?.first_address?.length)
    return getComplianceBusinessSignatory.value.first_address;

  return "----";
});

const businessAddress = ref<string>(computeAddress.value || "");
const uploadedDocument = ref<string>(
  getComplianceBusinessSignatory.value?.address_doc.url || ""
);

const getUploadedDocumentContent = computed(() => {
  return {
    name: getComplianceBusinessSignatory.value?.address_doc.type
      ?.split("_")
      .join(" "),
    link: getComplianceBusinessSignatory.value?.address_doc.url,
  };
});

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

const handleSignatoryConfirmUpdate = async () => {
  await handleComplianceRequest({
    payload: getBusinessPayload,
    redirectRoute: "RedstoneAgreementSignature",
    stopClickHandler,
    succesMsg: "Signatory address document submitted",
    errorMsg: "Signatory update failed",
    payloadType: "business_signatory",
  });
};

watch(
  getComplianceBusinessSignatory,
  (newValue) => {
    if (newValue) {
      businessPayload.value = {
        type: newValue.address_doc.type || "",
        url: newValue.address_doc.url || "",
      };

      businessAddress.value = newValue.first_address;
      uploadedDocument.value = newValue.address_doc.url;
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
