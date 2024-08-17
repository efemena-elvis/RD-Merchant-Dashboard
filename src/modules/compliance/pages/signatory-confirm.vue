<template>
  <ComplianceDisplayBlock
    title="Verify your signatory address"
    description="Provide the relevant document to confirm your signatory residential address."
    showActionRow
    @onBackClick="router.push({ name: 'RedstoneSignatoryAddress' })"
    @onContinueClick="router.push({ name: 'RedstoneAgreementSignature' })"
  >
    <div class="content-block">
      <UploadGuidelines
        title="Please upload a proof of address that:"
        :guidelines="[
          'Confirm your address at: <br/> 9a, Ademola Oshinowo, Ketu-ikosi, Lagos, Nigeria',
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

      <!-- DOCUMENT FIELD UPLOAD -->
      <div class="mb-14">
        <FileUploadInput showSkip skipRoute="RedstoneAgreementSignature" />
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
