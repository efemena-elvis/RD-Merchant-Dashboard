<template>
  <div>
    <div class="mb-8">
      <div class="text-xl font-semibold text-neutral-800">Your Domain List</div>

      <p class="mt-2 text-sm leading-6 text-grey-600/90 lg:w-1/2 sm:w-full">
        Manage your domains effortlessly. Copy your domain for easy sharing or
        activate it to connect seamlessly.
      </p>
    </div>

    <div class="domain-list-area w-[70%] sm:w-full">
      <div
        v-for="(domain, index) in allDomains"
        :key="index"
        class="relative py-4 mt-6 border rounded-lg sm:py-6 border-grey-400/75"
      >
        <div
          class="flex justify-between px-4 lg:gap-4 xl:items-center 2xl:items-center sm:flex-col sm:items-start sm:gap-4"
        >
          <a
            :href="`https://${domain}`"
            class="underline xl:w-1/2 2xl:w-1/2 sm:w-full"
          >
            {{ domain }}
          </a>
          <div class="w-1/2 sm:w-full flex items-center justify-between gap-4">
            <div
              class="px-5 py-2 text-xs font-medium text-center rounded-full bg-green-400/65 w-max sm:absolute right-4 top-5"
            >
              Active
            </div>

            <div class="flex items-center justify-end gap-2">
              <button
                @click="copyToClipboard(domain)"
                class="btn btn-sm btn-primary text-[11px] !h-[45px] sm:!h-[35px] !w-[80px]"
              >
                {{ domainCopied === domain ? "Copied" : "Copy" }}
              </button>

              <button
                class="btn btn-sm btn-alert text-[11px] !h-[45px] sm:!h-[35px] !w-[80px]"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  store: any;
  domains: string[];
}>();

const allDomains = ref<string[]>([]);
const domainCopied = ref<string>("");

watch(
  () => props.domains,
  (newVal) => {
    allDomains.value = Array.isArray(newVal) ? [...newVal] : [];
  },
  { immediate: true }
);

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    domainCopied.value = text;
    setTimeout(() => (domainCopied.value = ""), 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};
</script>

<style scoped></style>
