<template>
  <div class="page-content-wrapper">
    <!-- TOP ROW -->
    <div class="top-row">
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
      </div>
    </div>

    <!-- BOTTOM ROW -->
    <div class="bottom-row">
      <slot></slot>
    </div>

    <!-- PAGINATION -->
    <template v-if="pagingData.page_count > 0">
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
  filterActiveValue: string;
  filterListValue: string[];
  showFilterSelection: boolean;
  pageDescription: string;
  pagingData: any;
  pageKeys: any;
}

const props = withDefaults(defineProps<IPageContentType>(), {
  searchInputPlaceholder: "Search data",
  filterActiveValue: "",
  filterListValue: () => [],
  showFilterSelection: true,
  pageDescription: "",
  pagingData: { page_count: 0 },
  pageKeys: {},
});

const emits = defineEmits(["filterSelected", "searchEntered"]);

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
  @apply w-full h-full bg-neutral-10 rounded-lg border border-grey-200/50 p-5 mdLg:p-4 shadow-lg shadow-grey-200/40 flex flex-col justify-between items-start gap-y-9 mb-12;

  .top-row {
    @apply flex justify-between items-start gap-x-4 xs:gap-x-2.5 w-full;

    &--left {
      @apply flex justify-start items-center gap-x-3 xs:w-[70%];

      .search-block {
        @apply w-[260px] xs:w-full;
      }
    }

    &--right {
      @apply flex justify-end items-center gap-x-3 xs:w-1/5;
    }
  }

  .bottom-row {
    @apply w-full;
  }
}
</style>
