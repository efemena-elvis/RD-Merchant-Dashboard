<template>
  <ComplianceDisplayBlock
    title="Verify your PACRA registration document"
    description="Provide your Patents and Companies Registration Agency (PACRA) document to help us verify the legal status your business."
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'RedstoneRegistrationTPIN' })"
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
          <label class="form-label-basic">PACRA document</label>
          <FileUploadInput
            showSkip
            skipRoute="RedstoneRepresentativeProfile"
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
  name: "PACRA document",
  link: getComplianceRegistration.value?.pacra_doc_url || "",
});

const getUploadedDocumentContent = computed(() => {
  return uploadedDocumentContent.value;
});

const isActionReady = computed(() => {
  return uploadedDocument.value ? false : true;
});

const getBusinessPayload = computed(() => {
  return {
    pacra_doc_url: uploadedDocument.value,
  };
});

const handleRegistrationConfirmUpdate = async () => {
  await handleComplianceRequest({
    payload: getBusinessPayload,
    redirectRoute: "RedstoneRepresentativeProfile",
    stopClickHandler,
    succesMsg: "PACRA document submitted",
    errorMsg: "PACRA update failed",
    payloadType: "registration",
  });
};

watch(
  getComplianceRegistration,
  (newValue) => {
    if (newValue) {
      uploadedDocument.value = newValue.pacra_doc_url || "";

      uploadedDocumentContent.value = {
        name: "PACRA document",
        link: newValue.pacra_doc_url,
      };
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
