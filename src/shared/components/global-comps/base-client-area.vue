<template>
  <div class="client-area-wrapper">
    <div class="client-area">
      <div class="client-area-brand">
        {{ getBrandInitials(getBusinessProfile.businessName) }}
      </div>

      <div class="client-area-details">
        <!-- CLIENT AREA INFO -->
        <div class="client-area-info cursor-pointer">
          <div class="brand-name" :title="getBusinessProfile.businessName">
            {{ getBusinessProfile.businessName }}
          </div>

          <!-- MERCHANT ACCOUNT ID -->
          <div class="brand-id-row">
            <div class="brand-id">ID: {{ getBusinessProfile.businessId }}</div>
            <div class="copy-action" @click="copyMerchantID">
              {{ copied ? "Copied" : "Click to Copy" }}
            </div>
          </div>
        </div>

        <!-- CLIENT TOGGLER -->
        <div
          class="client-toggler cursor-pointer"
          ref="togglerRef"
          @click="toggleDropdown(!showDropdown)"
        >
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
      <div class="dropdown-area select-none" @click="logoutUser">
        <div class="dropdown-item">Sign Out</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useString } from "@/shared/composables/useString";
import { useProfile } from "@/shared/composables/useProfile";
import { useAuthStore } from "@/modules/auth/store";
import useClickOutside from "@/shared/composables/useClickOutside";
import useEvents from "@/shared/composables/useEvents";

const { getBusiness } = useProfile();
const getBusinessProfile = computed(() => getBusiness());

const { logoutUser } = useAuthStore();
const { pushToastAlert } = useEvents();

const showDropdown = ref(false);
const dialogRef = ref<HTMLElement | null>(null);
const togglerRef = ref<HTMLElement | null>(null);
const toggleDropdown = (state: boolean) => (showDropdown.value = state);
useClickOutside(dialogRef, togglerRef, toggleDropdown);

const { getStringInitials } = useString();

const getBrandInitials = (brandName: string): string =>
  getStringInitials(brandName);

const copied = ref<boolean>(false);

const copyMerchantID = async () => {
  const { businessId } = getBusiness();
  await navigator.clipboard.writeText(businessId);

  pushToastAlert({
    message: "Merchant ID copied successfully",
    type: "success",
  });

  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
};
</script>

<style lang="scss" scoped>
.client-area-wrapper {
  @apply relative bg-[#04324A] h-auto;
  z-index: 99;

  .client-area {
    @apply relative flex justify-start items-center gap-x-2 px-3 py-[18px] h-[84px];

    &-brand {
      @apply relative min-w-9 min-h-9 size-9 rounded-full bg-neutral-10/65 flex justify-center items-center font-medium;
    }

    &-details {
      @apply flex justify-between items-center gap-x-1 relative w-full;

      .client-area-info {
        @apply flex flex-col justify-center items-start gap-y-[4.5px] w-[90%];

        .brand-name {
          @apply font-semibold text-[14px] text-neutral-50 line-clamp-1 w-full;
        }

        .brand-id-row {
          @apply relative w-[96%];

          .brand-id {
            @apply relative cursor-pointer text-grey-300/90 text-[11px] line-clamp-1 w-full;
          }

          .copy-action {
            @apply absolute bg-[#194969] text-neutral-10 left-1/2 -translate-x-1/2 -top-0.5 text-[10.5px] rounded-lg px-3 py-[5px] text-nowrap w-full text-center animate-zoom-out hidden;
          }

          &:hover {
            .copy-action {
              @apply block;
            }
          }
        }
      }

      .client-toggler {
        @apply text-neutral-50/55 text-sm w-[8%];
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
