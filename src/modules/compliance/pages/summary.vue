<template>
  <ComplianceDisplayBlock
    title="Compliance Review"
    description="Please ensure the information you submitted are accurate. Incomplete information or documents can delay the activation of your business."
    primaryActionText="Activate my business"
    showActionRow
    @onBackClick="router.push({ name: 'RedstoneAgreementSignature' })"
    @onContinueClick=""
  >
    <div class="content-block mb-14">
      <!-- CONTENT TAB -->
      <div class="content-tab">
        <div
          class="content-tab-item"
          :class="activeTab === 'incomplete' && 'content-tab-item--active'"
          @click="toggleTab('incomplete')"
        >
          Incomplete Sections
        </div>

        <div
          class="content-tab-item"
          :class="activeTab === 'complete' && 'content-tab-item--active'"
          @click="toggleTab('complete')"
        >
          Complete Sections
        </div>
      </div>

      <!-- INCOMPLETE SECTIONS -->
      <div
        class="section-block incomplete-content"
        v-if="activeTab === 'incomplete'"
      >
        <SectionTextCard title="Business Address Verification" completed />
        <SectionTextCard title="Registration Verificationn" completed />
      </div>

      <!-- COMPLETE SECTIONS -->
      <div class="section-block" v-if="activeTab === 'complete'">
        <SectionTextCard title="Business Profile" />
        <SectionTextCard title="Business Contact" />
      </div>
    </div>
  </ComplianceDisplayBlock>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import ComplianceDisplayBlock from "@/modules/compliance/components/compliance-display-block.vue";
import SectionTextCard from "@/modules/compliance/components/section-text-card.vue";

const router = useRouter();

const activeTab = ref<string>("incomplete");

const toggleTab = (selection: string) => (activeTab.value = selection);
</script>

<style lang="scss" scoped>
.content-block {
  .content-tab {
    @apply mb-6 flex justify-between items-start;

    &-item {
      @apply cursor-pointer w-1/2 text-center pb-2 border-b border-b-grey-200 text-grey-700/65 text-[14.75px];
    }

    &-item--active {
      @apply text-green-600 font-medium border-b-2 border-b-green-600;
    }
  }

  .section-block {
    @apply flex flex-col justify-start items-start gap-y-4;
  }
}
</style>
