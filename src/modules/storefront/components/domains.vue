<template>
  <div>
    <div class="mb-8">
      <div class="text-xl font-semibold text-neutral-800">Your Domain List</div>

      <p class="mt-2 text-grey-600/90 text-sm leading-6 w-1/2">
        Manage your domains effortlessly. Copy your domain for easy sharing or
        activate it to connect seamlessly.
      </p>
    </div>

    <div class="domain-list-area w-[70%]">
      <div
        v-for="(domain, index) in allDomains"
        :key="index"
        class="relative py-4 mt-6 border border-grey-400/75 rounded-lg"
      >
        <div
          class="flex justify-between gap-4 px-4 xl:items-center 2xl:items-center sm:flex-col sm:items-start sm:gap-4"
        >
          <span class="w-1/3 font-medium text-grey-700 text-sm">{{
            domain
          }}</span>

          <div
            class="bg-green-400/65 px-5 py-2 rounded-full w-max text-center font-medium text-xs sm:absolute right-4"
          >
            Active
          </div>

          <div class="flex justify-end items-center gap-2">
            <button
              @click="copyToClipboard(domain)"
              class="btn btn-sm btn-primary text-[11px] !h-[40px]"
            >
              {{ domainCopied === domain ? "Copied" : "Copy" }}
            </button>

            <button class="btn btn-sm btn-alert text-[11px] !h-[40px]">
              Deactivate
            </button>
          </div>
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
