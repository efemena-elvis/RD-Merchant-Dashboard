<template>
  <div>

    <div class="spinner-icon icon-spinner-ios" v-if="storeIsLoading"></div>
    <div v-else>
      <div class="flex w-max justify-start items-center gap-4 mb-9">
        <div
          v-if="!storeDetails?.domain_config?.domain"
          @click="activeTab = 'Add'"
          :class="tabBackground('Add')"
          class="btn btn-sm"
        >
          <div class="icon icon-add"></div>
          <div>Add Domain</div>
        </div>
        <div
          @click="activeTab = 'Domains'"
          :class="tabBackground('Domains')"
          class="btn btn-sm"
        >
          <div class="icon icon-layer"></div>
          <div>Domain List</div>
        </div>
      </div>
      <AddDomain v-if="activeTab === 'Add'" :store="storeDetails" />
      <Domains v-else :store="storeDetails" :domains="allDomains" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import AddDomain from "../components/add-domain.vue";
import Domains from "../components/domains.vue";
import useEvents from "@/shared/composables/useEvents";
import { useStorefrontStore } from "@/modules/storefront/store";


interface StoreDetailsType {
  id: string;
  slug: string;
  domain_config: {
    domain?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

const storeDetails = ref<StoreDetailsType | null>(null);
const storeIsLoading = ref(true);
const activeTab = ref("");
const allDomains = ref<string[]>([]); 

const route = useRoute();
const { fetchStoreById } = useStorefrontStore();
const { processAPIRequest } = useEvents();

const getStoreDetails = async () => {
  storeIsLoading.value = true;
  try {
    const response = await processAPIRequest({
      action: fetchStoreById,
      payload: { storeId: route.params.storeId },
      showAlert: false,
    });

    const data = response.data;
    storeDetails.value = { ...data };

    allDomains.value = [
      ...(data.domain_config?.domain ? [data.domain_config?.domain] : []),
      `store.redstonepgs.com/${data.slug}`,
    ];

    activeTab.value = data.domain_config?.domain ? "Domains" : "Add"
  } catch (error) {
    console.error("Error fetching store details:", error);
  } finally {
    storeIsLoading.value = false;
  }
};

const tabBackground = (tab: string) =>
  tab === activeTab.value
    ? "btn-primary text-white"
    : "btn-tertiary text-black";

onMounted(() => getStoreDetails());
</script>

<style lang="scss" scoped>
.btn {
  @apply w-auto h-auto px-7 py-2.5 text-sm gap-2;

  .icon {
    @apply text-lg;
  }
}

.spinner-icon {
      @apply text-5xl text-grey-400/90 animate-spin mx-auto absolute right-1/2 ;
    }
</style>
