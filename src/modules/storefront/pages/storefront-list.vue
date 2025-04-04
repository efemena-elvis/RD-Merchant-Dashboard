<template>
  <PageContentWrapper
    searchInputPlaceholder="Search storefronts..."
    :filterActiveValue="activePeriod"
    :filterListValue="periodList"
    pageDescription="All Storefronts"
    :pagingData="tablePaging"
    :pageKeys="{ green: 'Successful', yellow: 'Pending', red: 'Failed' }"
    :showFilterSelection="false"
    :hasPayload="tableBody.length > 0"
    :showCustomActionBtn="true"
    :customActionBtnText="'Create a storefront'"
    @customActionBtnClicked="toggleCreateStorefrontModal"
    @searchEntered="processSearchEntry"
  >
    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="tableBody"
      :isLoading="isLoading"
      :emptyData="{
        title: 'No storefront yet',
        description:
          'You haven\'t created any merchant storefront on this account yet. This is where you\'ll be able to manage all created storefronts',
        actionText: 'Create a storefront',
        customImg: 'empty-cart.png',
      }"
      @onActionClicked="toggleCreateStorefrontModal"
    >
      <TableContainerBody
        v-for="(payload, index) in tableBody"
        :key="index"
        :tableHeader="tableHeader"
        :tableData="payload"
      />
    </TableContainer>
  </PageContentWrapper>

  <teleport to="body" v-if="showCreateStorefrontModal">
    <CreateStoreFrontModal
      @closeTriggered="toggleCreateStorefrontModal"
      @reloadStorefront="fetchAllStorefront"
    />
  </teleport>

  <teleport to="body" v-if="showDeleteStorefrontModal">
    <DeleteStoreFrontModal
      :storefrontData="deleteStorefrontData"
      @closeTriggered="toggleDeleteStorefrontModal"
      @reloadStorefront="fetchAllStorefront"
    />
  </teleport>
</template>

<script lang="ts" setup>
import { h, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useString } from "@/shared/composables/useString";
import { TableHeaderType } from "@/models/dashboard-type";
import { useProfile } from "@/shared/composables/useProfile";
import { useStorefrontStore } from "@/modules/storefront/store";
import useEvents from "@/shared/composables/useEvents";
import PageContentWrapper from "@/shared/components/global-comps/page-content-wrapper.vue";
import TableContainer from "@/shared/components/table-comps/table-container.vue";
import TableContainerBody from "@/shared/components/table-comps/table-container-body.vue";
import CreateStoreFrontModal from "@/modules/storefront/modals/create-storefront-modal.vue";
import DeleteStoreFrontModal from "@/modules/storefront/modals/delete-storefront-modal.vue";
import TableActionBtn from "@/shared/components/table-comps/table-action-btn.vue";

const { getBoldTableText, getStatus, createPreviewLink, formatNumber } =
  useString();

const router = useRouter();
const { getBusiness } = useProfile();

const { fetchStorefront, getDomainConfig } = useStorefrontStore();
const { processAPIRequest } = useEvents();
const storeDomains = ref<Record<string, string>>({});

const isLoading = ref<boolean>(true);

const tableHeader = ref<TableHeaderType[]>([
  { title: "#", slug: "counter" },
  { title: "Name", slug: "name" },
  { title: "Orders", slug: "orders" },
  { title: "Revenue", slug: "revenue" },
  { title: "Link", slug: "link" },
  { title: "Status", slug: "status" },
  { title: "", slug: "action" },
]);

const tableBody = reactive<any[]>([]);
const tablePaging = ref<any>({});

const activePeriod = ref<string>("This month");
const periodList = ref<string[]>([
  "Today",
  "Last 7 days",
  "This month",
  "Last month",
  "All time",
]);

const deleteStorefrontData = ref<any>({});
const showCreateStorefrontModal = ref(false);
const showDeleteStorefrontModal = ref(false);

const toggleCreateStorefrontModal = () => {
  showCreateStorefrontModal.value = !showCreateStorefrontModal.value;
};

const toggleDeleteStorefrontModal = () => {
  showDeleteStorefrontModal.value = !showDeleteStorefrontModal.value;
};

const processSearchEntry = (searchValue: string) => {
  console.log("SEARCH VALUE", searchValue);
};

const processFilterSelection = (selectedPeriod: string) => {
  console.log("FILTERING BY PERIOD", selectedPeriod);
};

// const handleGetDomainConfig = async (store: any): Promise<void> => {
//   if (!store || storeDomains.value[store.id]) return;

//   try {
//     const response = await processAPIRequest({
//       action: getDomainConfig,
//       payload: { id: store.id },
//       showAlert: false,
//     });

//     if (response.code === 200 && response.data.domain) {
//       storeDomains.value[store.id] = response.data.domain;
//     }
//   } catch (err: any) {
//     console.log("Error fetching domain config:", err.message);
//   }
// };

const fetchAllStorefront = async () => {
  const response = await processAPIRequest({
    action: fetchStorefront,
    payload: {},
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    tableBody.length = 0;

    // await Promise.all(response.data.map(handleGetDomainConfig));

    const updatedTableBody = response.data.map((data: any, index: number) => {
      const domain =
        storeDomains.value[data.id] || `store.redstonepgs.com/${data.slug}`;

      return {
        counter: index + 1,
        name: getBoldTableText(data.name),
        orders: data?.total_orders ?? 0,
        revenue: getBoldTableText(
          `ZMW${formatNumber(data?.total_amount ?? 0)}`
        ),
        link: createPreviewLink(`https://${domain}`, "Preview storefront"),
        status: `${getStatus("success", "Active")}`,
        action: h(TableActionBtn, {
          showPrimaryBtn: true,
          showSecondaryBtn: false,
          primaryBtnText: "Manage Store",
          onManageClick: () => {
            router.push(
              `storefront/overview/${data.id}?storeSlug=${data.slug}`
            );
          },
          onDeleteClick: () => handleDeleteStorefront(data),
        }),
      };
    });

    tableBody.push(...updatedTableBody);
  }
};

const handleDeleteStorefront = (storefrontData: any) => {
  deleteStorefrontData.value = storefrontData;
  toggleDeleteStorefrontModal();
};

fetchAllStorefront();
</script>

<style lang="scss" scoped></style>
