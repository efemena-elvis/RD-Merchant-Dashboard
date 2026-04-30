<template>
  <ComplianceDisplayBlock
    title="Verify your business registration document"
    description="Provide your certificate of business incorporation document below to help us verify your business."
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'RedstoneRegistrationInformation' })"
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
            >Certificate of business incorporation</label
          >
          <FileUploadInput
            showSkip
            skipRoute="RedstoneRegistrationTPIN"
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
  name: "Certificate of incorporation",
  link: getComplianceRegistration.value?.doc_url || "",
});

const getUploadedDocumentContent = computed(() => {
  return uploadedDocumentContent.value;
});

const isActionReady = computed(() => {
  return uploadedDocument.value ? false : true;
});

const getBusinessPayload = computed(() => {
  return {
    doc_url: uploadedDocument.value,
  };
});

const handleRegistrationConfirmUpdate = async () => {
  await handleComplianceRequest({
    payload: getBusinessPayload,
    redirectRoute: "RedstoneRegistrationTPIN",
    stopClickHandler,
    succesMsg: "Registration document submitted",
    errorMsg: "Registration update failed",
    payloadType: "registration",
  });
};

watch(
  getComplianceRegistration,
  (newValue) => {
    if (newValue) {
      uploadedDocument.value = newValue.doc_url || "";

      uploadedDocumentContent.value = {
        name: "Certificate of incorporation",
        link: newValue.doc_url,
      };
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
