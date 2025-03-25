<template>
  <div class="xl:w-[80%] 2xl:w-[80%] sm:w-full">
    <div class="flex items-center gap-16 pb-6 font-semibold">
          <div @click="activeTab = 'Add'"
          :class="tabBackground('Add')"
           class="p-3 rounded-md w-[120px] cursor-pointer text-center hover:opacity-50 transition-opacity">
            <h4>+Add</h4>
          </div>
          <div
           @click="activeTab ='Domains'" class=" p-3 rounded-md w-[120px] cursor-pointer  text-center hover:opacity-50 transition-opacity"
           :class="tabBackground('Domains')">
            <h4>Domains</h4>
          </div>
        </div>

  <AddDomain v-if = "activeTab === 'Add'"/>

   
    <Domains v-else/>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import useEvents from "@/shared/composables/useEvents";
import { useStorefrontStore } from "@/modules/storefront/store";
import { useRoute, useRouter } from "vue-router";
import AddDomain from "../components/add-domain.vue";
import Domains from "../components/domains.vue";

const route = useRoute();

const router = useRouter();

const storeDetails = ref(null);
const loading = ref(true);
const activeTab = ref("Add");

const { fetchStoreById } = useStorefrontStore();
const { processAPIRequest } = useEvents();

const tabBackground = (tab:string) => (tab === activeTab.value ? 'bg-[#04324a] text-white border-none' : 'bg-transparent border border-gray-700 text-black');



</script>

<style lang="scss" scoped></style>
