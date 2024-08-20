<template>
  <ComplianceDisplayBlock
    title="Compliance Review"
    description="Please ensure the information you submitted are accurate. Incomplete information or documents can delay the activation of your business."
    primaryActionText="Activate my business"
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
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
        <template v-if="incompleteSections.length">
          <SectionTextCard
            :title="section.title"
            :sectionRoute="section.route"
            v-for="(section, index) in incompleteSections"
            :key="index"
          />
        </template>

        <template v-else>
          <EmptyComplianceSection
            title="Compliance sections completed"
            description="Congratulations, you have completed all your compliance sections. Proceed to activate my business"
          />
        </template>
      </div>

      <!-- COMPLETE SECTIONS -->
      <div class="section-block" v-if="activeTab === 'complete'">
        <template v-if="completedSections.length">
          <SectionTextCard
            :title="section.title"
            :sectionRoute="section.route"
            completed
            v-for="(section, index) in completedSections"
            :key="index"
          />
        </template>

        <template v-else>
          <EmptyComplianceSection
            title="No completed sections"
            description="You haven't kick started your compliance journey yet. Navigate to
              business section to get started."
          />
        </template>
      </div>
    </div>
  </ComplianceDisplayBlock>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import ComplianceDisplayBlock from "@/modules/compliance/components/compliance-display-block.vue";
import SectionTextCard from "@/modules/compliance/components/section-text-card.vue";
import EmptyComplianceSection from "@/modules/compliance/components/empty-compliance-section.vue";
import {
  IComplianceSectionType,
  complianceSections,
} from "@/modules/compliance/constant/compliance-navigation-list";

const router = useRouter();

const activeTab = ref<string>("incomplete");
const toggleTab = (selection: string) => (activeTab.value = selection);

const complianceSectionList = ref<IComplianceSectionType[]>([
  ...complianceSections,
]);

const completedSections = computed(() =>
  complianceSectionList.value.filter((section) => section.completed)
);

const incompleteSections = computed(() =>
  complianceSectionList.value.filter((section) => !section.completed)
);

const isActionReady = computed(() =>
  incompleteSections.value.length === 0 ? false : true
);
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
