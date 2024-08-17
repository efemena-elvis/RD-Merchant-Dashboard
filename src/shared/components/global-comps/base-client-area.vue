<template>
  <div class="client-area-wrapper">
    <div
      class="client-area"
      ref="togglerRef"
      @click="toggleDropdown(!showDropdown)"
    >
      <div class="client-area-brand">
        {{ getBrandInitials("Vesicash Innovative Technologies") }}
      </div>

      <div class="client-area-details w-full">
        <!-- CLIENT AREA INFO -->
        <div class="client-area-info cursor-pointer">
          <div class="brand-name" title="Vesicash Innovative Technologies">
            Vesicash Innovative Technologies
          </div>
          <div class="brand-id">Merchant ID: <span>12345678</span></div>
        </div>

        <!-- CLIENT TOGGLER -->
        <div class="client-toggler cursor-pointer">
          <div class="icon-double-caret-fill cursor-pointer"></div>
        </div>
      </div>
    </div>

    <div
      class="dropdown-area-wrapper"
      ref="dialogRef"
      v-if="showDropdown"
      role="dialog"
      aria-modal="true"
    >
      <div class="dropdown-area select-none">
        <div class="dropdown-item">Sign Out</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useString } from "@/shared/composables/useString";
import useClickOutside from "@/shared/composables/useClickOutside";

const showDropdown = ref(false);
const dialogRef = ref<HTMLElement | null>(null);
const togglerRef = ref<HTMLElement | null>(null);
const toggleDropdown = (state: boolean) => (showDropdown.value = state);
useClickOutside(dialogRef, togglerRef, toggleDropdown);

const { getStringInitials } = useString();

const getBrandInitials = (brandName: string): string =>
  getStringInitials(brandName);
</script>

<style lang="scss" scoped>
.client-area-wrapper {
  @apply relative bg-[#04324A] h-auto;
  z-index: 99;

  .client-area {
    @apply relative flex justify-start items-center gap-x-2 px-3 py-[18px] h-[82px];

    &-brand {
      @apply relative min-w-9 min-h-9 size-9 rounded-full bg-neutral-10/65 flex justify-center items-center font-medium;
    }

    &-details {
      @apply flex justify-between items-center gap-x-1;

      .client-area-info {
        @apply flex flex-col justify-center items-start gap-0.5;

        .brand-name {
          @apply font-semibold text-[14px] text-neutral-50 line-clamp-1;
        }

        .brand-id {
          @apply text-grey-300/90 text-[11px];
        }
      }

      .client-toggler {
        @apply text-neutral-50/55 text-sm;
      }
    }
  }

  .dropdown-area-wrapper {
    @apply relative px-3 animate-slide-down;

    .dropdown-area {
      @apply relative py-2 border-t border-t-grey-400/25;

      .dropdown-item {
        @apply text-neutral-10/70 text-sm px-[10px] py-[10px] rounded-sm cursor-pointer transition duration-300 ease-in-out hover:bg-[#042c41];
      }
    }
  }
}
</style>
