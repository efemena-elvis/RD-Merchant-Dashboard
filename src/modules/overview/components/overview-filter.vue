<template>
  <div class="overview-filter">
    <VueDatePicker
      v-model="dateRange"
      range
      format="dd MMM yyyy"
      placeholder="Select Date Range"
      :enable-time-picker="false"
      @update:model-value="handleDateChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import useClickOutside from "@/shared/composables/useClickOutside";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const dateRange = ref<[Date, Date] | null>(null);

interface IFilterType {
  filterSize: string;
 activePeriod: [Date, Date] | null;
  periodList: string[];
}

const props = withDefaults(defineProps<IFilterType>(), {
  filterSize: "sm",
  activePeriod: null,
  periodList: () => [],
});

const emits = defineEmits(["onFilterSelected"]);



const handleDateChange = (value: [Date, Date] | null) => {
  dateRange.value = value;

  if (value && value.length === 2) {
   
    emits("onFilterSelected", value);
  } else {
    emits("onFilterSelected", null);
  }
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

  :deep(.dp__input) {
    @apply p-5 border border-gray-300 rounded-md text-sm font-semibold text-teal-800 bg-white cursor-pointer transition duration-200 ease-in-out focus:outline-none;
  }

  :deep(.dp__input::placeholder) {
    @apply text-teal-800 relative left-6 font-bold;
  }

  :deep(.dp__menu) {
    @apply border border-gray-200 shadow-lg rounded-lg bg-white text-gray-800;
  }

  :deep(.dp__range_start),
  :deep(.dp__range_end) {
    @apply bg-teal-600 text-white;
  }

  :deep(.dp__cell_inner:hover) {
    @apply bg-teal-50 text-teal-700;
  }

  :deep(.dp__today) {
    @apply border border-teal-500;
  }

  :deep(.dp__icon) {
    @apply text-teal-800;
  }
}
</style>
