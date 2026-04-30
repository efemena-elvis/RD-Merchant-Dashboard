<template>
  <ComplianceDisplayBlock
    title="Activate your merchant account"
    description="To get your merchant account activated and fully compliant with legal and regulatory standards, we’ll need the following business documents:"
  >
    <div class="content-block">
      <DocumentInfoCard
        title="Certificate of business incorporation"
        description="Provide a copy of your official certificate of incorporation to verify that your business is legally registered in Zambia."
      />

      <DocumentInfoCard
        title="Proof of business address"
        description="Provide a recent document not more than FOUR months, showing your business address, such as a utility bill, lease agreement or a statement of account."
      />

      <DocumentInfoCard
        title="Taxpayer Identification Number (TPIN) document"
        description="Provide a copy of your TPIN document to verify that your tax registration and obligations"
      />

      <DocumentInfoCard
        title="Patents and Companies Registration Agency (PACRA) document"
        description="Provide a copy of your PACRA document to verify the legal status of your business"
      />

      <DocumentInfoCard
        title="Shareholders identification document"
        description="Submit a Government issued ID of your Shareholders, such as National ID, Voter ID, Driver’s License or International Passport"
      />

      <DocumentInfoCard
        title="Signatory representative identification document"
        description="Submit a Government issued ID of your Signatory representative, such as National ID, Voter ID, Driver’s License or International Passport"
      />
    </div>

    <button
      class="btn btn-primary w-full"
      @click="router.push({ name: 'RedstoneBusinessProfile' })"
    >
      Continue to Verification
    </button>
  </ComplianceDisplayBlock>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import ComplianceDisplayBlock from "@/modules/compliance/components/compliance-display-block.vue";
import DocumentInfoCard from "@/modules/compliance/components/document-info-card.vue";

const router = useRouter();
</script>

<style lang="scss" scoped>
.content-block {
  @apply flex flex-col justify-start items-start mb-10;
}

.btn {
  @apply sm:text-[14px];
}
</style>
