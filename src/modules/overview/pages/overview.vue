<template>
  <div class="dashboard-overview">
    <!-- DASHBOARD OVERVIEW TOP -->
    <div class="dashboard-overview-block top-block">
      <OverviewBlock />
    </div>

    <!-- DASHBOARD OVERVIEW MID -->
    <div class="dashboard-overview-block mid-block">
      <div class="dashboard-overview-block--left">
        <TransactionBlock />
      </div>

      <div class="dashboard-overview-block--right">
        <CustomerOverview />
      </div>
    </div>

    <!-- DASHBOARD OVERVIEW BASE -->
    <div class="dashboard-overview-block base-block">
      <CollectionsBlock />
    </div>
  </div>
</template>

<script lang="ts" setup>
import OverviewBlock from "@/modules/overview/components/overview-block.vue";
import TransactionBlock from "@/modules/overview/components/transaction-block.vue";
import CustomerOverview from "@/modules/overview/components/customer-overview.vue";
import CollectionsBlock from "@/modules/overview/components/collections-block.vue";
</script>

<style lang="scss" scoped>
.dashboard-overview {
  @apply flex flex-col justify-start items-start gap-y-6 mb-8;

  &-block {
    @apply flex justify-between items-start gap-x-5 w-full;

    &--left {
      @apply w-[68%] h-full;
    }

    &--right {
      @apply w-[32%] h-full;
    }
  }

  .top-block,
  .base-block {
    @apply w-full;
  }

  .mid-block {
    @apply h-[370px];

    .dashboard-overview-block--left {
      @apply h-full;
    }

    .dashboard-overview-block--right {
      @apply h-full;
    }
  }
}
</style>
