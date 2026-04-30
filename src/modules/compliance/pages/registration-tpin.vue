<template>
  <ComplianceDisplayBlock
    title="Verify your TPIN document"
    description="Provide your Tax Payer Identification document below to help us verify your tax registration."
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'RedstoneRegistrationConfirm' })"
    @onContinueClick="handleRegistrationConfirmUpdate"
  >
    <div class="content-block">
      <UploadGuidelines
        title="Please upload a document that:"
        :guidelines="[
          'Is government issued',
          'Is full-sized, original and unedited',
          'Is in JPG, JPEG, PNG or PDF file formats',
        ]"
      />

      <!-- DOCUMENT FIELD UPLOAD -->
      <div class="mb-14">
        <div class="form-block">
          <label class="form-label-basic"
            >Tax Payer Identification Document</label
          >
          <FileUploadInput
            showSkip
            skipRoute="RedstoneRegistrationPACRA"
            :hasDocumentUploaded="!!uploadedDocument"
            :uploadedDocumentContent="getUploadedDocumentContent"
            @onDocumentUploaded="uploadedDocument = $event"
          />
        </div>
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
import { useComplianceUtil } from "../composable/useComplianceUtil";
import { useComplianceStore } from "../store";
import { storeToRefs } from "pinia";

const router = useRouter();
const { handleComplianceRequest } = useComplianceUtil();
const { getComplianceRegistration } = storeToRefs(useComplianceStore());

const stopClickHandler = ref<boolean>(false);
const uploadedDocument = ref<string>("");

const uploadedDocumentContent = ref<{ name: string; link: string }>({
  name: "TPIN document",
  link: getComplianceRegistration.value?.tpin_doc_url || "",
});

const getUploadedDocumentContent = computed(() => {
  return uploadedDocumentContent.value;
});

const isActionReady = computed(() => {
  return uploadedDocument.value ? false : true;
});

const getBusinessPayload = computed(() => {
  return {
    tpin_doc_url: uploadedDocument.value,
  };
});

const handleRegistrationConfirmUpdate = async () => {
  await handleComplianceRequest({
    payload: getBusinessPayload,
    redirectRoute: "RedstoneRegistrationPACRA",
    stopClickHandler,
    succesMsg: "TPIN document submitted",
    errorMsg: "TPIN update failed",
    payloadType: "registration",
  });
};

watch(
  getComplianceRegistration,
  (newValue) => {
    if (newValue) {
      uploadedDocument.value = newValue.tpin_doc_url || "";

      uploadedDocumentContent.value = {
        name: "TPIN document",
        link: newValue.tpin_doc_url,
      };
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
