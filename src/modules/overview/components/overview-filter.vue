<template>
  <div class="overview-filter">
    <div
      class="filter-row"
      :class="filterSize === 'lg' && 'filter-lg'"
      ref="togglerRef"
      @click="toggleDropdown(!showDropdown)"
    >
      <div class="filter-type">
        <div class="icon icon-calendar"></div>
      </div>

      <div class="filter-value-row">
        <div class="filter-text">{{ selectedPeriod }}</div>
        <div
          class="filter-icon icon-caret-down"
          :class="showDropdown && 'rotate-180'"
        ></div>
      </div>
    </div>

    <div
      class="app-dropdown filter-dropdown"
      ref="dialogRef"
      v-if="showDropdown"
      role="dialog"
      aria-modal="true"
    >
      <div class="dropdown-wrapper">
        <div
          class="app-dropdown-item capitalize"
          @click="updateActivePeriod(item)"
          v-for="(item, index) in periodList"
          :key="index"
        >
          <div class="text">{{ item }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import useClickOutside from "@/shared/composables/useClickOutside";

interface IFilterType {
  filterSize: string;
  activePeriod: string;
  periodList: string[];
}

const props = withDefaults(defineProps<IFilterType>(), {
  filterSize: "sm",
  activePeriod: "Weekly",
  periodList: () => [],
});

const emits = defineEmits(["onFilterSelected"]);

const selectedPeriod = ref<string>(props.activePeriod);

const updateActivePeriod = (value: string) => {
  selectedPeriod.value = value;
  emits("onFilterSelected", value);
  toggleDropdown(false);
};

const showDropdown = ref(false);
const dialogRef = ref<HTMLElement | null>(null);
const togglerRef = ref<HTMLElement | null>(null);

const toggleDropdown = (state: boolean) => (showDropdown.value = state);

useClickOutside(dialogRef, togglerRef, toggleDropdown);
</script>

<style lang="scss" scoped>
.overview-filter {
  @apply relative;

  .filter-row {
    @apply flex justify-end items-center gap-x-2 w-max px-3 py-1.5 rounded-lg border border-grey-300/70 cursor-pointer transition duration-300 ease-in-out hover:bg-grey-50/30 hover:border-grey-400/50;

    .filter-type {
      .icon {
        @apply relative -top-[0.5px] text-lg text-grey-700/80;
      }
    }

    .filter-value-row {
      @apply flex justify-end items-center gap-x-2;

      .filter-text {
        @apply text-sm sm:hidden font-semibold mdLg:font-medium text-teal-800 capitalize;
      }

      .filter-icon {
        @apply relative text-base text-grey-800 transition duration-300 ease-in-out;
      }
    }
  }

  .filter-lg {
    @apply px-5 md:px-3.5 py-[11px] md:py-[10.5px] gap-x-2.5;

    .filter-type {
      .icon {
        @apply text-xl;
      }
    }

    .filter-value-row {
      @apply gap-x-2.5;

      .filter-text {
        @apply text-[14.25px];
      }

      .filter-icon {
        @apply text-[16.5px];
      }
    }
  }

  .filter-dropdown {
    @apply w-[170px] -mb-2;

    .dropdown-wrapper {
      @apply after:right-[10.25%];
    }
  }
}
</style>
