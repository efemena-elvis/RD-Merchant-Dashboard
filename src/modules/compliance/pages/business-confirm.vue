<template>
  <ComplianceDisplayBlock
    title="Verify your business address"
    description="Provide any of the listed relevant document below to help us verify your business address."
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    @onBackClick="router.push({ name: 'RedstoneBusinessAddress' })"
    @onContinueClick="handleBusinessConfirmUpdate"
  >
    <div class="content-block">
      <UploadGuidelines
        title="Please upload a proof of address that:"
        :guidelines="[
          `Confirm your business address at: <br/> ${businessAddress || '------'}`,
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
        :inputValue="businessPayload.doc_type"
        inputBaseColor="bg-grey-10"
        :selectData="documentTypes"
        isRequired
        @onSelectionChange="businessPayload.doc_type = $event"
      />

      <!-- DOCUMENT FIELD UPLOAD -->
      <div class="mb-14">
        <FileUploadInput
          showSkip
          skipRoute="RedstoneRegistrationInformation"
          @onDocumentUploaded="uploadedDocument = $event"
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
import useEvents from "@/shared/composables/useEvents";
import { useComplianceStore } from "../store";

type IBusinessType = {
  doc_type: string;
};

const router = useRouter();
const stopClickHandler = ref<boolean>(false);

const { processAPIRequest } = useEvents();
const {
  uploadCompliance,
  getComplianceBusiness,
  getComplianceRegistration,
  getComplianceRepresentative,
  getComplianceBankAccount,
  getComplianceBusinessSignatory,
  getComplianceAgreement,
} = useComplianceStore();

const businessPayload = ref<IBusinessType>({
  doc_type: getComplianceBusiness?.doc_type || "",
});

const computeBusinessAddress = computed(() => {
  return `${getComplianceBusiness?.first_address}, ${getComplianceBusiness?.city}`;
});

const businessAddress = ref<string>(computeBusinessAddress.value || "");
const uploadedDocument = ref<string>(getComplianceBusiness?.doc_url || "");

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
  return businessPayload.value.doc_type && uploadedDocument.value
    ? false
    : true;
});

const getBusinessPayload = computed(() => {
  return {
    doc_type: businessPayload.value.doc_type,
    doc_url: uploadedDocument.value,
  };
});

const handleBusinessConfirmUpdate = async () => {
  const response = await processAPIRequest({
    action: uploadCompliance,
    payload: {
      business: { ...getComplianceBusiness, ...getBusinessPayload.value },
      getComplianceRegistration,
      getComplianceRepresentative,
      getComplianceBankAccount,
      getComplianceBusinessSignatory,
      getComplianceAgreement,
    },
    alertHandler: {
      200: {
        message: "Business address document submitted",
        type: "success",
      },

      400: {
        message: "Document update failed",
        type: "error",
      },
    },
  });

  if (response.code === 200) {
    stopClickHandler.value = true;
    setTimeout(
      () => router.push({ name: "RedstoneRegistrationInformation" }),
      2000
    );
  }

  // ON FAILED UPDATE STOP PROCESSING
  else {
    stopClickHandler.value = true;
  }
};
</script>

<style lang="scss" scoped>
.content-block {
}
</style>
