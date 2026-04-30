<template>
  <div class="skeleton-loader">
    <!-- Skeleton for Customer Full Name -->
    <div class="skeleton-input skeleton-title"></div>
    <div class="skeleton-input"></div>

    <!-- Skeleton for Email Address -->
    <div class="skeleton-input skeleton-title"></div>
    <div class="skeleton-input"></div>

    <!-- Skeleton for Phone Number -->
    <div class="skeleton-input skeleton-title"></div>
    <div class="skeleton-input"></div>

    <!-- Skeleton for Pay Button -->
    <div class="skeleton-button"></div>
  </div>
</template>

<script setup>
// No additional logic is needed for this simple skeleton loader.
</script>

<style lang="scss" scoped>
.skeleton-loader {
  @apply flex flex-col gap-y-5 sm:gap-y-4 my-0 mx-auto w-full max-w-sm;

  .skeleton-input,
  .skeleton-button {
    @apply bg-gray-300 rounded-md;
    animation: shimmer 1.5s infinite linear;
    background: linear-gradient(90deg, #e8e8e8 25%, #efefef 50%, #e8e8e8 75%);
    background-size: 200% 100%;
  }

  .skeleton-input {
    @apply w-full h-10 -mt-3.5;
  }

  .skeleton-title {
    @apply h-4 w-2/5 mt-0;
  }

  .skeleton-button {
    @apply w-full h-12 mt-6;
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
