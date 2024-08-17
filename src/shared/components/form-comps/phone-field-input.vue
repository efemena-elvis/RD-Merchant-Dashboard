<template>
  <div
    :class="['form-block form-text-block', hasBottomPadding ? 'mb-8' : 'mb-0']"
  >
    <!-- LABEL TEXT -->
    <label
      v-if="labelTitle"
      :for="labelId"
      class="form-label"
      :class="inputBaseColor"
      >{{ labelTitle }}</label
    >

    <div class="form-block-input has-prefix">
      <div class="prefix-item">
        <div class="relative">
          <div
            class="item-selection"
            ref="togglerRef"
            @click="toggleDropdown(!showDropdown)"
          >
            <div class="selected-text">+234</div>
            <div
              class="toggler-icon icon-caret-down"
              :class="showDropdown && 'rotate-180'"
            ></div>
          </div>

          <!-- COUNTRY SELECT DROPDOWN -->
          <div
            class="app-dropdown country-select-dropdown"
            ref="dialogRef"
            v-if="showDropdown"
            role="dialog"
            aria-modal="true"
          >
            <div class="dropdown-wrapper">
              <div class="selection-area">
                <!-- SEARCH TOP AREA -->
                <div class="search-top">
                  <div class="icon icon-search-normal"></div>

                  <input
                    type="search"
                    class="form-control search-input"
                    placeholder="Search country..."
                  />
                </div>

                <!-- OPTION LIST -->
                <div class="option-list">
                  <div
                    class="option-list-item"
                    v-for="(country, index) in countries"
                    :key="index"
                  >
                    <div class="primary-text">{{ country.country }}</div>
                    <div class="secondary-text">
                      +{{ country.dialing_code }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <input
        type="number"
        :id="labelId"
        :class="['form-control', inputBaseColor]"
        :placeholder="inputPlaceholder"
        :defaultValue="inputValue"
        :required="isRequired"
        :disabled="isDisabled"
        @input="handleFormInput"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { IPhoneInputField } from "@/models/form-type";
import useClickOutside from "@/shared/composables/useClickOutside";
import countries from "@/shared/constants/country-list";

const props = withDefaults(defineProps<IPhoneInputField>(), {
  labelId: "",
  labelTitle: "",
  inputValue: "",
  inputPlaceholder: "",
  inputBaseColor: "bg-neutral-10",
  isRequired: false,
  isDisabled: false,
  hasBottomPadding: true,
});

const handleFormInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (props.onInputChange) props.onInputChange(target.value);
};

// SETUP DROPDOWN FUNCTIONALITY
const showDropdown = ref<boolean>(false);
const dialogRef = ref<HTMLElement | null>(null);
const togglerRef = ref<HTMLElement | null>(null);

const toggleDropdown = (state: boolean) => (showDropdown.value = state);

useClickOutside(dialogRef, togglerRef, toggleDropdown);
</script>

<style lang="scss" scoped>
.form-text-block {
  .form-block-input {
    @apply relative;

    .prefix-item {
      @apply hidden;
    }

    &.has-prefix {
      .prefix-item {
        @apply absolute block top-1/2 pt-[3px] -translate-y-1/2 left-5 sm:left-4 z-20;

        .item-selection {
          @apply relative flex justify-start items-center gap-x-1 cursor-pointer;

          .selected-text {
            @apply text-sm text-grey-600;
          }

          .toggler-icon {
            @apply text-grey-700 relative text-[15.5px] transition duration-300 ease-in-out;
          }
        }
      }

      .form-control {
        @apply pl-[86px] sm:pl-[45px];
      }
    }

    .country-select-dropdown {
      @apply absolute -left-[20px] w-[260px] mt-[18px] z-10;

      .dropdown-wrapper {
        @apply relative after:left-[10.75%];

        .selection-area {
          @apply pt-3 pb-1;

          .search-top {
            @apply relative px-4 z-40;

            .icon {
              @apply text-grey-700/80 absolute block top-1/2 -translate-y-1/2 left-7 z-20 text-[15.5px];
            }

            .search-input {
              @apply px-3 py-[10.5px] pl-9;
            }
          }

          .option-list {
            @apply mt-1 min-h-10 h-auto max-h-40 overflow-auto;

            &::-webkit-scrollbar {
              @apply w-1;
            }

            &::-webkit-scrollbar-track {
              @apply rounded-md;
            }

            &::-webkit-scrollbar-thumb {
              @apply rounded-md bg-green-200;
            }

            &-item {
              @apply flex justify-between items-start gap-x-4 py-2.5 px-4 border-b border-b-grey-200/70 last-of-type:border-0 cursor-pointer transition duration-300 ease-in-out hover:bg-grey-10;

              .primary-text {
                @apply text-grey-600/90 text-sm;
              }

              .secondary-text {
                @apply text-grey-500/85 text-[13.5px];
              }
            }
          }
        }
      }
    }
  }
}
</style>
