<template>
  <div class="xl:w-[80%] 2xl:w-[60%] sm:w-full">
    <div class="flex items-center gap-8 pb-6 font-semibold">
      <div
        @click="activeTab = 'Add'"
        :class="tabBackground('Add')"
        class="btn btn-sm"
      >
        <h4>+Add</h4>
      </div>
      <div
        @click="activeTab = 'Domains'"
        class="btn btn-sm"
        :class="tabBackground('Domains')"
      >
        <h4>Domains</h4>
      </div>
    </div>

    <AddDomain v-if="activeTab === 'Add'" :store="storeDetails" />

    <Domains v-else :store="storeDetails" :domains="allDomains" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import useEvents from "@/shared/composables/useEvents";
import { useStorefrontStore } from "@/modules/storefront/store";
import { useRoute } from "vue-router";
import AddDomain from "../components/add-domain.vue";
import Domains from "../components/domains.vue";
import { getDomainConfig } from "../store/actions";

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
const { fetchStoreById } = useStorefrontStore();
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

onMounted(getStoreDetails);

const tabBackground = (tab: string) =>
  tab === activeTab.value ? "btn-primary text-white" : "btn-tertiary text-black";
</script>

<style lang="scss" scoped>
.btn {
  @apply w-[100px] h-[46px] py-3 sm:py-3 px-7 border text-[13px];
}
</style>
