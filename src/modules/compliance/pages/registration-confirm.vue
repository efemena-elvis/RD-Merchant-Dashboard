<template>
  <ComplianceDisplayBlock
    title="Verify your business registration document"
    description="Provide your certificate of business incorporation document below to help us verify your business."
    showActionRow
    @onBackClick="router.push({ name: 'RedstoneRegistrationInformation' })"
    @onContinueClick="router.push({ name: 'RedstoneRepresentativeProfile' })"
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
        <FileUploadInput showSkip skipRoute="RedstoneRepresentativeProfile" />
      </div>
    </div>
  </ComplianceDisplayBlock>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import ComplianceDisplayBlock from "@/modules/compliance/components/compliance-display-block.vue";
import UploadGuidelines from "@/modules/compliance/components/upload-guidelines.vue";
import FileUploadInput from "@/shared/components/form-comps/file-upload-input.vue";

const router = useRouter();
</script>

<style lang="scss" scoped>
.content-block {
  // @apply ;
}
</style>
