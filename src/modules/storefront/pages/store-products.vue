<template>
  <div class="strorefront-product-page pb-10">
    <!-- TOP AREA -->
    <div class="top-area">
      <div class="top-area--left">
        <div class="form-input-block">
          <div class="icon icon-search-normal"></div>

          <input
            type="search"
            class="form-control form-input"
            placeholder="Search products..."
          />
        </div>
      </div>

      <div class="top-area--right button-actions">
        <button
          class="btn btn-sm btn-primary"
          @click="toggleManageProductModal"
        >
          Add a Product
        </button>
      </div>
    </div>

    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="tableBody"
      :isLoading="isLoading"
      :emptyData="{
        title: 'No product yet!',
        description:
          'You haven\'t created any product on this storefront yet. This is where you\'ll be able to manage all created products',
      }"
    >
      <TableContainerBody
        v-for="(payload, index) in tableBody"
        :key="index"
        :tableHeader="tableHeader"
        :tableData="payload"
      />
    </TableContainer>
  </div>

  <teleport to="body" v-if="showManageProductModal">
    <ManageProductModal
      :productData="productDataItem"
      :productCategories="productCategories"
      @closeTriggered="toggleManageProductModal"
      @reloadStoreProducts="fetchAllStoreProducts"
    />
  </teleport>

  <teleport to="body" v-if="showDeleteProductModal">
    <DeleteProductModal
      :productData="productDataItem"
      @closeTriggered="toggleDeleteProductModal"
      @reloadStoreProducts="fetchAllStoreProducts"
    />
  </teleport>
</template>

<script lang="ts" setup>
import { h, ref, reactive } from "vue";
import { useRoute } from "vue-router";
import { useString } from "@/shared/composables/useString";
import { TableHeaderType } from "@/models/dashboard-type";
import { useStorefrontStore } from "@/modules/storefront/store";
import useEvents from "@/shared/composables/useEvents";
import TableContainer from "@/shared/components/table-comps/table-container.vue";
import TableContainerBody from "@/shared/components/table-comps/table-container-body.vue";
import ManageProductModal from "@/modules/storefront/modals/manage-product-modal.vue";
import DeleteProductModal from "@/modules/storefront/modals/delete-product-modal.vue";
import TableActionBtn from "@/shared/components/table-comps/table-action-btn.vue";
import TableDoubleColumn from "@/shared/components/table-comps/table-double-column.vue";
import { storefrontNiches } from "@/shared/constants/storefront-niches";
import useDate from "@/shared/composables/useDate";

const { getBoldTableText, getStatus, formatNumber } = useString();

const route = useRoute();

const { getStoreProducts, fetchStoreById } = useStorefrontStore();
const { processAPIRequest } = useEvents();

const isLoading = ref<boolean>(true);

const tableHeader = ref<TableHeaderType[]>([
  { title: "#", slug: "counter" },
  { title: "Product Details", slug: "product" },
  { title: "Amount Per Unit", slug: "amount" },
  { title: "Stock", slug: "quantity" },
  { title: "Status", slug: "status" },
  { title: "Date Added", slug: "date_created" },
  { title: "", slug: "action" },
]);

const tableBody = reactive<any[]>([]);

const tablePaging = ref<any>({});

const productDataItem = ref<any>({});
const productCategories = ref<any>([]);

const showManageProductModal = ref(false);
const showDeleteProductModal = ref(false);

const toggleManageProductModal = () => {
  productDataItem.value = {};
  showManageProductModal.value = !showManageProductModal.value;
};

const toggleDeleteProductModal = () => {
  showDeleteProductModal.value = !showDeleteProductModal.value;
};

const getDateAdded = (date: string) => {
  let { m4, d3, y1 } = useDate.formatDate(date).getAll();
  return `${d3} ${m4}, ${y1}`;
};

const fetchAllStoreProducts = async () => {
  isLoading.value = true;

  const response = await processAPIRequest({
    action: getStoreProducts,
    payload: { storefrontSlug: route.query.storeSlug },
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    tableBody.length = 0;

    tableBody.push(
      ...response.data.map((data: any, index: number) => ({
        counter: `${index + 1}`,
        product: h(TableDoubleColumn, {
          entry: {
            primaryText: data.name,
            secondaryText: data.category,
            displayImage: data.image,
          },
        }),
        amount: getBoldTableText(`ZMW ${formatNumber(data.amount)}`),
        quantity: data.stock,
        status: `${getStatus(data.stock > 0 ? "success" : "danger", data.stock > 0 ? "Available" : "Out of Stock")}`,
        date_created: getDateAdded(data.created_at),
        action: h(TableActionBtn, {
          showPrimaryBtn: true,
          primaryBtnText: "Edit",
          showSecondaryBtn: true,
          showSecondaryText: true,
          onManageClick: () => handleEditProduct(data),
          onDeleteClick: () => handleDeleteProduct(data),
        }),
      }))
    );

    // tablePaging.value = response.pagination[0];
  }
};

const handleDeleteProduct = (productData: any) => {
  productDataItem.value = productData;
  toggleDeleteProductModal();
};

const handleEditProduct = (productData: any) => {
  productDataItem.value = productData;
  showManageProductModal.value = !showManageProductModal.value;
  // toggleManageProductModal();
};

const fetchStorefrontById = async () => {
  const response = await processAPIRequest({
    action: fetchStoreById,
    payload: { storeId: route.params.storeId },
    showAlert: false,
  });

  if (response.code === 200) {
    const niche = storefrontNiches.find(
      (niche) => niche.slug === response.data.tag
    );
    productCategories.value = niche?.categories || [];
  }
};

fetchAllStoreProducts();
fetchStorefrontById();
</script>

<style lang="scss" scoped>
.strorefront-product-page {
  .top-area {
    @apply flex justify-between items-center gap-x-3 mb-11;

    &--left {
      @apply flex flex-col justify-center items-start gap-y-0.5 w-1/2;

      .section-title {
        @apply font-semibold text-base sm:text-[15.5px] text-grey-700;
      }

      .section-description {
        @apply text-grey-600/85 text-[12.5px];
      }
    }

    &--right {
      @apply flex justify-end items-center gap-x-3 sm:hidden;
    }
  }

  .form-input-block {
    @apply relative w-full;

    .form-input {
      @apply w-full text-grey-600 text-[13.5px] placeholder:text-[13.5px] py-[12.5px] pl-10 pr-4 border-grey-300 hover:border-green-400/80 focus:border-green-400;
    }

    .icon {
      @apply z-10 text-[15px] absolute top-1/2 left-4 transform -translate-y-1/2 text-grey-600;
    }
  }

  .button-actions {
    @apply w-full;

    .btn {
      @apply w-max h-[46px] py-3 sm:py-3 px-7 text-grey-800/80 border text-[13px];
    }

    .btn-primary {
      @apply text-neutral-10;
    }
  }
}
</style>
