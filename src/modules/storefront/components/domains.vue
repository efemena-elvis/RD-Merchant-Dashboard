<template>
  <div class="xl:w-full 2xl:w-[80%] sm:w-full">
    <h6 class="text-2xl font-semibold text-gray-800 border-gray-400">
      Your {{ allDomains.length > 1 ? "Domains" : "Domain" }}
    </h6>
    <p class="mt-2 mb-8 text-gray-600">
      Manage your domains effortlessly. Copy your domain for easy sharing or
      activate it to connect seamlessly.
    </p>
    <div class="flex flex-col justify-center gap-y-0.5 2xl:w-[60%] xl:w-full sm:w-full">
      <div class="relative w-full">
        <div
          class="z-10 text-[15px] absolute top-1/2 left-4 transform -translate-y-1/2 text-grey-600 icon-search-normal"
        ></div>

        <input
          type="search"
          v-model="searchInput"
          @input="handleSearch"
          class="rounded-md w-full text-grey-600 text-[13.5px] placeholder:text-[13.5px] py-[12.5px] pl-10 pr-4 border-grey-300 hover:border-green-400/80 focus:border-green-400"
          placeholder="Search domain..."
        />
      </div>
      <span v-if="allDomains.length === 0" class="py-6 mx-auto text-red-600">
        No result found.
      </span>
    </div>
  
    <div
      v-for="(domain, index) in allDomains"
      :key="index"
      class="relative py-4 mt-6 border border-gray-600 rounded-lg"
    >
      <div
        class="flex justify-between gap-4 px-4 xl:items-center 2xl:items-center sm:flex-col sm:items-start sm:gap-4"
      >
        <span class="w-1/3 font-semibold">{{ domain }}</span>
        <div
          class="bg-green-300 p-1 rounded-full w-[80px] text-center font-semibold text-[12px] sm:absolute right-4"
        >
          Active
        </div>
        <div class="space-x-3 ">
          <button
            @click="copyToClipboard(domain)"
            class="border border-gray-500 rounded-md hover:bg-[#04324a] w-[80px] hover:text-white p-2"
          >
            {{ domainCopied === domain ? "Copied" : "Copy" }}
          </button>
          <button
            class="border border-gray-500 rounded-md hover:bg-[#04324a] w-[80px] hover:text-white p-2"
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps(["store", "domains"]);
const allDomains = ref<string[]>([...props.domains]);
const domainCopied = ref<string>("");
const searchInput = ref<string>("");




const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    domainCopied.value = text;
    setTimeout(() => (domainCopied.value = ""), 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};

const handleSearch = () => {
  if (!searchInput.value.trim()) {
    allDomains.value = [...props.domains];
    return;
  }

  allDomains.value = props.domains?.filter((domain: string) =>
    domain.toLowerCase().includes(searchInput.value.toLowerCase().trim())
  );
};


</script>

<style scoped></style>
