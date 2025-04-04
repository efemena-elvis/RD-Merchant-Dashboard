<template>
  <div>
    <div class="flex w-max justify-start items-center gap-4 mb-9">
      <div
        @click="activeTab = 'Add'"
        :class="tabBackground('Add')"
        class="btn btn-sm"
      >
        <div class="icon icon-add"></div>
        <div>Add Domain</div>
      </div>

      <div
        @click="activeTab = 'Domains'"
        class="btn btn-sm"
        :class="tabBackground('Domains')"
      >
        <div class="icon icon-layer"></div>
        <div>Domain List</div>
      </div>
    </div>

    <AddDomain v-if="activeTab === 'Add'" :store="storeDetails" />

    <Domains v-else :store="storeDetails" :domains="allDomains" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import useEvents from "@/shared/composables/useEvents";
import { useStorefrontStore } from "@/modules/storefront/store";
import { useRoute } from "vue-router";
import TabSwitcher from "@/shared/components/global-comps/tab-switcher.vue";
import AddDomain from "../components/add-domain.vue";
import Domains from "../components/domains.vue";

const route = useRoute();

interface StoreDetails {
  id: string;
  slug: string;
  [key: string]: any;
}

const storeDetails = ref<StoreDetails | null>(null);
const loading = ref(true);
const activeTab = ref("Add");
const allDomains = ref<string[]>([]);

const { fetchStoreById, getDomainConfig } = useStorefrontStore();
const { processAPIRequest } = useEvents();

// Fetch Store Details
const getStoreDetails = async () => {
  loading.value = true;
  try {
    const response = await processAPIRequest({
      action: fetchStoreById,
      payload: { storeId: route.params.storeId },
      showAlert: false,
    });

    storeDetails.value = response.data;

    allDomains.value = [`store.redstonepgs.com/${response.data.slug}`];

    handleGetDomainConfig();
  } catch (error) {
    console.error("Error fetching store details:", error);
  } finally {
    loading.value = false;
  }
};

const handleGetDomainConfig = async (): Promise<void> => {
  if (!storeDetails.value) return;

  try {
    const response = await processAPIRequest({
      action: getDomainConfig,
      payload: { id: storeDetails.value.id },
      showAlert: false,
    });

    if (response.code === 200 && response.data.domain) {
      allDomains.value.unshift(response.data.domain);
    }
  } catch (err: any) {
    console.log("Error fetching domain config:", err.message);
  }
};

const tabBackground = (tab: string) =>
  tab === activeTab.value
    ? "btn-primary text-white"
    : "btn-tertiary text-black";

getStoreDetails();
</script>

<style lang="scss" scoped>
.btn {
  @apply w-auto h-auto px-7 py-2.5 text-sm gap-2;

  .icon {
    @apply text-lg;
  }
}
</style>
