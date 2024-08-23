<template>
  <div class="table-skeleton-loader">
    <!-- Skeleton rows for the table -->
    <div v-for="index in 6" :key="index" class="skeleton-row">
      <div class="skeleton-circle"></div>
      <div class="skeleton-text"></div>
      <div class="skeleton-text"></div>
      <div class="skeleton-text"></div>
      <div class="skeleton-text"></div>
      <div class="skeleton-text"></div>
    </div>
  </div>
</template>

<script setup>
// No additional logic is needed for this simple skeleton loader.
</script>

<style scoped lang="scss">
.table-skeleton-loader {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .skeleton-row {
    display: grid;
    grid-template-columns: 20px 1fr 1fr 1fr 1fr 1fr;
    align-items: center;
    gap: 1rem;

    .skeleton-circle,
    .skeleton-text {
      @apply bg-grey-10/40 rounded-lg;
      animation: shimmer 1.5s infinite linear;
      background: linear-gradient(90deg, #e8e8e8 25%, #efefef 50%, #e8e8e8 75%);
      background-size: 200% 100%;
    }

    .skeleton-circle {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .skeleton-text {
      height: 20px;
      &:nth-child(2) {
        width: 80px;
      }
      &:nth-child(3) {
        width: 100px;
      }
      &:nth-child(4) {
        width: 180px;
      }
      &:nth-child(5) {
        width: 90px;
      }
      &:nth-child(6) {
        width: 120px;
      }
    }
  }
}

@keyframes shimmer {
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 100% 0;
  }
}
</style>
