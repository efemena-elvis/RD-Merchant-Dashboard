<template>
  <ComplianceDisplayBlock
    title="Verify your business registration document"
    description="Provide your certificate of business incorporation document below to help us verify your business."
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
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
        <FileUploadInput
          showSkip
          skipRoute="RedstoneRepresentativeProfile"
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

const router = useRouter();

const uploadedDocument = ref<string>("");

const isActionReady = computed(() => {
  return uploadedDocument.value ? false : true;
});

const getBusinessPayload = computed(() => {
  return {
    doc_url: uploadedDocument.value,
  };
});

const handleRegistrationConfirmUpdate = () => {
  // router.push({ name: 'RedstoneRepresentativeProfile' })

  console.log("Payload", getBusinessPayload.value);
};
</script>

<style lang="scss" scoped>
.content-block {
  // @apply ;
}
</style>
