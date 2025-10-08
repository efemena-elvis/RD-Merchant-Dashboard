<template>
  <div class="page-content-wrapper">
    <!-- TOP ROW -->
    <div class="top-row" v-if="hasPayload">
      <div class="top-row--left">
        <div class="search-block">
          <TextFieldInput
            labelId="searchInput"
            labelTitle=""
            :inputType="IInputType.Search"
            :inputPlaceholder="searchInputPlaceholder"
            inputBaseColor="bg-neutral-10 py-2"
            :isRequired="false"
            :hasBottomPadding="false"
            @inputChanged="handleSearchEntry"
          />
        </div>
      </div>

      <div class="top-row--right">
        
        <OverviewFilter
          v-if="showFilterSelection"
          filterSize="lg"
          :activePeriod="filterActiveValue"
          :periodList="filterListValue"
          @onFilterSelected="handleFilterSelection"
        />

        <template name="customActionBtn" v-if="showCustomActionBtn">

          <button
            class="btn btn-sm btn-primary custom-action-btn"
            @click="$emit('customActionBtnClicked')"
          >
            {{ customActionBtnText }}
          </button>
        </template>
      </div>
    </div>

    <!-- BOTTOM ROW -->
    <div class="bottom-row">
      <slot></slot>
    </div>

    <!-- PAGINATION -->
    <template v-if="hasPayload && pagingData.page_count > 0">
      <Pagination
        :pageDescription="pageDescription"
        :pagingData="pagingData"
        :pageKeys="pageKeys"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { IInputType } from "@/models/form-type";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import OverviewFilter from "@/modules/overview/components/overview-filter.vue";
import Pagination from "@/shared/components/global-comps/pagination.vue";

interface IPageContentType {
  searchInputPlaceholder: string;
  filterActiveValue?: string;
  filterListValue?: string[];
  showFilterSelection?: boolean;
  pageDescription: string;
  pagingData: any;
  pageKeys: any;
  hasPayload: boolean;
  showCustomActionBtn?: boolean;
  customActionBtnText?: string;
}

const props = withDefaults(defineProps<IPageContentType>(), {
  searchInputPlaceholder: "Search data",
  filterActiveValue: "",
  filterListValue: () => [],
  showFilterSelection: true,
  pageDescription: "",
  pagingData: { page_count: 0 },
  pageKeys: {},
  hasPayload: false,
  showCustomActionBtn: false,
  customActionBtnText: "",
});

const emits = defineEmits([
  "filterSelected",
  "searchEntered",
  "customActionBtnClicked",
]);

// Handle search functionality
const handleSearchEntry = (searchValue: string) => {
  emits("searchEntered", searchValue);
};

// Handle filter functionality
const handleFilterSelection = (filterValue: string) => {
  emits("filterSelected", filterValue);
};
</script>

<style lang="scss">
.page-content-wrapper {
  @apply w-full h-full flex flex-col justify-between items-start gap-y-9 pb-10;

  .top-row {
    @apply flex sm:flex-wrap justify-between items-start gap-4 sm:gap-3 w-full;

    &--left {
      @apply flex justify-start items-center gap-3 sm:w-full;

      .search-block {
        @apply w-[260px] sm:w-full;
      }
    }

    &--right {
      @apply flex justify-end items-center gap-3 sm:w-full;

      .custom-action-btn {
        @apply px-7 font-normal text-[14px];
      }
    }
  }

  .bottom-row {
    @apply w-full;
  }
}
</style>
