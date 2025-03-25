<template>
  <div>
    <h6
        class="text-2xl font-semibold text-gray-800 border-gray-400 "
      >
        Your {{domains.length > 1 ?  "Domains" : "Domain"}}
      </h6>
    <p class="mt-2 mb-8 text-gray-600">
      Manage your domains effortlessly. Copy your domain for easy sharing or
      activate it to connect seamlessly.
    </p>
    <div class="flex flex-col justify-center gap-y-0.5 w-[60%] sm:w-full">
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
    </div>
    <div
      v-for="(domain, index) in domains"
      :key="index"
      class="relative py-4 mt-6 border border-gray-600 rounded-lg"
    >
   
      <div
        class="flex justify-between px-4 xl:items-center 2xl:items-center sm:flex-col sm:items-start sm:gap-4"
      >
        <span class="font-semibold">{{ domain }}</span>
        <div
          class="bg-green-300 p-1 rounded-full w-[80px] text-center font-semibold text-[12px] sm:absolute right-4"
        >
          Active
        </div>
        <div class="space-x-6">
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
      <p
        class="mt-2 text-blue-600 underline break-all transition cursor-pointer hover:text-blue-800"
      ></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";


const allDomains = ref<string[]>(["aishat.com", "omolola.net"]); 
const domains = ref<string[]>([...allDomains.value]);
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
    domains.value = [...allDomains.value]; 
    return;
  }
  
  domains.value = allDomains.value.filter((domain) =>
    domain.toLowerCase().includes(searchInput.value.toLowerCase().trim())
  );
};

</script>

<style scoped></style>
